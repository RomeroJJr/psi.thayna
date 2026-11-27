"use client";
import { useState, useRef, useEffect } from "react";
import type { Edition } from "../lib/caderno/editions";
import {
  BookOpen,
  Mail,
  Rss,
  CalendarDays,
  X,
  Plus,
  Minus,
} from "lucide-react";
const dateLabel = (d: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(d + "T12:00:00Z"));
export default function Caderno({ initial }: { initial: Edition[] }) {
  const [rows, setRows] = useState(initial);
  const [selected, setSelected] = useState(initial[0]?.day || "");
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const item = rows.find((r) => r.day === selected) || rows[0];
  useEffect(() => {
    let live = true;
    const desired = new URLSearchParams(location.search).get("edicao");
    let first = true;
    async function refresh() {
      try {
        const r = await fetch("/api/caderno", { cache: "no-store" });
        if (!r.ok) return;
        const data = (await r.json()) as { editions: Edition[] };
        if (live && data.editions.length) {
          setRows(data.editions);
          if (first) {
            setSelected(
              data.editions.some((e: Edition) => e.day === desired)
                ? desired!
                : data.editions[0].day,
            );
            if (desired) setOpen(true);
            first = false;
          }
        }
      } catch {
        /* retain the last edition */
      }
    }
    refresh();
    const timer = setInterval(refresh, 60000);
    const remove = new URLSearchParams(location.hash.slice(1)).get("cancelar");
    if (remove) {
      setToken(remove);
      dialog.current?.showModal();
    }
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, []);
  async function register(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await fetch("/api/inscricao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = (await res.json()) as {
        error?: string;
        cancelToken: string;
      };
      if (!res.ok) throw Error(data.error);
      setToken(data.cancelToken);
      setStatus(
        "Solicitação recebida. Para um novo cadastro, guarde o link abaixo. Se já havia uma inscrição, use o link original.",
      );
      setEmail("");
    } catch {
      setStatus("Não foi possível registrar seu e-mail. Tente novamente.");
    } finally {
      setPending(false);
    }
  }
  async function cancel() {
    setPending(true);
    try {
      const r = await fetch("/api/inscricao/cancelar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (r.status === 404) {
        setStatus(
          "Este link é inválido ou já foi usado. Use o link original ou entre em contato por e-mail.",
        );
        return;
      }
      if (!r.ok) throw Error();
      setStatus("Cadastro cancelado.");
      setToken("");
      setConsent(false);
      if (location.hash.startsWith("#cancelar="))
        history.replaceState(null, "", "#caderno");
    } catch {
      setStatus("Não foi possível concluir. Tente novamente.");
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="journal section" id="caderno">
      <div className="wrap journal-layout">
        <div className="journal-intro">
          <p className="kicker">NEWSLETTER DIÁRIA</p>
          <h2>
            Entrelinhas<span>.</span>
          </h2>
          <p>
            Um caderno de reflexões sobre emoções, relações e os pequenos
            acontecimentos da vida.
          </p>
          <button
            className="button outline"
            onClick={() => {
              setStatus("");
              dialog.current?.showModal();
            }}
          >
            <Mail size={17} />
            Acompanhar o caderno
          </button>
        </div>
        {item && (
          <article className="edition">
            <div className="edition-top">
              <span>
                <BookOpen size={16} /> Edição de {dateLabel(item.day)}
              </span>
              <span className="edition-theme">{item.theme}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.body.split("\n\n")[0]}</p>
            {open && (
              <div className="continued">
                {item.body
                  .split("\n\n")
                  .slice(1)
                  .map((v, i) => (
                    <p key={i}>{v}</p>
                  ))}
                <blockquote>{item.question}</blockquote>
                {item.source && (
                  <a
                    href={item.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Leitura de referência
                  </a>
                )}
              </div>
            )}
            <button
              className="text-button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
            >
              {open ? <Minus /> : <Plus />}
              {open ? "Recolher edição" : "Ler a edição completa"}
            </button>
            {rows.length > 1 && (
              <div className="archive">
                <label htmlFor="archive">
                  <CalendarDays size={16} /> Outras edições
                </label>
                <select
                  id="archive"
                  value={item.day}
                  onChange={(e) => {
                    setSelected(e.target.value);
                    setOpen(true);
                  }}
                >
                  {rows.map((r) => (
                    <option key={r.day} value={r.day}>
                      {dateLabel(r.day)} · {r.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </article>
        )}
      </div>
      <dialog
        ref={dialog}
        className="modal subscription"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="modal-inner">
          <button
            aria-label="Fechar"
            className="close"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
          <p className="kicker">ENTRELINHAS</p>
          <h2>Acompanhar o caderno</h2>
          <p>
            Leia a edição diária neste site ou abra o feed em um leitor RSS com
            acesso à página.
          </p>
          <a className="button outline" href="/caderno.xml">
            <Rss size={16} />
            Abrir feed RSS
          </a>
          <hr />
          <h3>Lista de interesse por e-mail</h3>
          <p>
            As edições já estão no site. Cadastre seu e-mail se quiser receber o
            caderno quando os envios começarem.
          </p>
          {!token && (
            <form onSubmit={register}>
              <label htmlFor="sub-email">Seu e-mail</label>
              <input
                type="email"
                id="sub-email"
                maxLength={254}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                autoComplete="email"
              />
              <label className="consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                Autorizo o uso do meu e-mail para receber o Entrelinhas.
              </label>
              <button className="button solid" disabled={pending}>
                {pending ? "Salvando…" : "Registrar interesse"}
              </button>
            </form>
          )}
          <p role="status" className="feedback">
            {status}
          </p>
          {token && (
            <div className="manage">
              <a
                href={"#cancelar=" + token}
                onClick={(e) => {
                  e.preventDefault();
                  history.replaceState(null, "", "#cancelar=" + token);
                  setStatus(
                    "Guarde o endereço desta página para voltar ao gerenciamento.",
                  );
                }}
              >
                Link para gerenciar o cadastro
              </a>
              <button
                className="text-button"
                disabled={pending}
                onClick={cancel}
              >
                Cancelar cadastro
              </button>
            </div>
          )}
          <p className="fine">
            Para falar sobre seu cadastro, escreva para{" "}
            <a href="mailto:thaynachrister1996@outlook.com">
              thaynachrister1996@outlook.com
            </a>
            .
          </p>
        </div>
      </dialog>
    </section>
  );
}
