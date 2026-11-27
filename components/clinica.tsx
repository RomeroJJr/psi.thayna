"use client";
import { useState, useRef, useEffect } from "react";
import {
  CalendarDays,
  Menu,
  X,
  Monitor,
  MapPin,
  Clock3,
  Plus,
  Minus,
  Mail,
  Camera,
  MessageCircle,
  Cloud,
  MessagesSquare,
  Blocks,
} from "lucide-react";
import { Brand, Sprig } from "./botanical";
import Agenda from "./agenda";
import Caderno from "./caderno";
import type { Edition } from "../lib/caderno/editions";

const approaches = [
  {
    abbr: "TCC",
    title: "Terapia Cognitivo-Comportamental",
    text: "Na TCC, observamos como pensamentos, emoções e ações se relacionam em situações da sua rotina. Esse olhar orienta os objetivos que definimos juntos.",
  },
  {
    abbr: "DBT",
    title: "Terapia Comportamental Dialética",
    text: "A DBT reúne acolhimento e mudança. O trabalho pode envolver reconhecer emoções, atravessar momentos difíceis e praticar novas formas de se relacionar.",
  },
  {
    abbr: "ABA",
    title: "Análise do Comportamento Aplicada",
    text: "A ABA considera a relação entre o comportamento e o contexto em que ele acontece. O acompanhamento parte das necessidades individuais e de objetivos que façam sentido na vida cotidiana.",
  },
];
const situations = [
  {
    id: "preocupacoes",
    label: "Preocupações",
    Icon: Cloud,
    approach: approaches[0],
    scene:
      "Mandei uma mensagem e a pessoa não respondeu. Já comecei a pensar que fiz algo errado.",
    question: "O que passou pela sua cabeça enquanto esperava?",
    explanation:
      "Na sessão, vocês podem retomar esse intervalo. O que você sabia naquele momento? O que imaginou? Perceber como uma interpretação mexeu com o seu dia abre espaço para considerar outras leituras da mesma situação.",
  },
  {
    id: "limites",
    label: "Relações e limites",
    Icon: MessagesSquare,
    approach: approaches[1],
    scene:
      "Aceitei mais um favor. Só depois percebi o quanto eu queria ter dito não.",
    question: "Como dizer o que você precisa?",
    explanation:
      "Uma possibilidade é ensaiar essa conversa na sessão. Você pode experimentar maneiras de recusar o pedido, perceber o desconforto que aparece e encontrar palavras que respeitem tanto o seu limite quanto a relação.",
  },
  {
    id: "rotina",
    label: "Rotina na infância",
    Icon: Blocks,
    approach: approaches[2],
    scene:
      "Quando chega a hora de sair do parquinho, meu filho chora. Como posso ajudar nessa hora?",
    question: "Como é o fim da brincadeira para essa criança?",
    explanation:
      "A psicóloga e a família podem observar como a saída é anunciada e o que a criança tenta comunicar. A partir daí, podem experimentar um aviso antes de ir embora ou combinar um jeito de a criança pedir mais tempo para terminar o que está fazendo.",
  },
];
const faq = [
  [
    "Como funciona a primeira consulta?",
    "É uma conversa para nos conhecermos. Você pode contar o que trouxe você até aqui, tirar dúvidas e combinar os próximos passos. Quando o atendimento é infantil, os responsáveis participam desse início.",
  ],
  [
    "Como funciona a terapia online?",
    "As sessões acontecem por videochamada. Escolha um lugar reservado e tenha por perto um dispositivo com câmera, microfone e conexão com a internet. Os detalhes de acesso são combinados antes da consulta.",
  ],
  [
    "Quanto tempo dura uma sessão?",
    "Uma sessão dura, em média, 50 minutos. A frequência é combinada de acordo com suas necessidades e pode ser revista ao longo do acompanhamento.",
  ],
  [
    "O atendimento é particular ou por convênio?",
    "Os atendimentos são particulares. Você pode solicitar recibo e consultar diretamente sua operadora sobre a possibilidade de reembolso.",
  ],
  [
    "Onde acontece o atendimento presencial?",
    "Em João Pessoa, na Paraíba. A localização e as orientações para chegar ao consultório são informadas na confirmação da consulta.",
  ],
];
const nav = [
  ["Sobre mim", "sobre"],
  ["Atendimentos", "atendimentos"],
  ["Newsletter", "caderno"],
  ["Dúvidas", "duvidas"],
];
const whats = "https://wa.me/5583987999427";
export default function Clinica({
  initialDay,
  editions,
}: {
  initialDay: string;
  editions: Edition[];
}) {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  const [situationIndex, setSituationIndex] = useState(0);
  const situation = situations[situationIndex];
  const situationTabs = useRef<Array<HTMLButtonElement | null>>([]);
  const [approach, setApproach] = useState(0);
  const [faqIndex, setFaqIndex] = useState<number | null>(0);
  const menuBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        if (menu) menuBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [menu]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -58% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((el) => obs.observe(el));
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("seen");
            reveal.unobserve(e.target);
          }
      },
      { threshold: 0.06 },
    );
    document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));
    return () => {
      obs.disconnect();
      reveal.disconnect();
    };
  }, []);
  function navigateSituations(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const count = situations.length;
    const nextIndex: Record<string, number> = {
      ArrowRight: (index + 1) % count,
      ArrowLeft: (index + count - 1) % count,
      Home: 0,
      End: count - 1,
    };
    const next = nextIndex[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSituationIndex(next);
    situationTabs.current[next]?.focus();
  }
  return (
    <>
      <a href="#conteudo" className="skip">
        Ir para o conteúdo
      </a>
      <header className="site-header">
        <div className="wrap header-layout">
          <Brand />
          <nav
            id="main-nav"
            className={menu ? "nav open" : "nav"}
            aria-label="Navegação principal"
          >
            {nav.map(([label, id]) => (
              <a
                key={id}
                href={"#" + id}
                aria-current={active === id ? "location" : undefined}
                onClick={() => setMenu(false)}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a
              className="button solid header-cta"
              href="#agenda"
              onClick={() => setMenu(false)}
            >
              <CalendarDays />{" "}
              <span>
                Agendar <b>consulta</b>
              </span>
            </a>
            <button
              className="hamburger"
              ref={menuBtn}
              onClick={() => setMenu(!menu)}
              aria-label={menu ? "Fechar menu" : "Abrir menu"}
              aria-controls="main-nav"
              aria-expanded={menu}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="conteudo">
        <section id="inicio" className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="kicker">
                PSICOLOGIA CLÍNICA <span className="dot-sep">·</span> CRP
                13/11584
              </p>
              <h1>
                Um espaço para
                <br />
                <em>ser você.</em>
              </h1>
              <p className="hero-text">
                Psicoterapia para crianças, adolescentes e adultos. Um cuidado
                que respeita a sua história e o seu tempo.
              </p>
              <div className="hero-actions">
                <a className="button solid" href="#agenda">
                  <CalendarDays />
                  Agendar consulta
                </a>
                <a className="quiet-link" href="#sobre">
                  Conheça meu trabalho
                </a>
              </div>
            </div>
            <figure className="hero-visual">
              <div className="portrait-outline" />
              <div className="portrait-frame">
                <img
                  src="/imagens/thayna-consultorio.webp"
                  alt="Thayna Christer em seu consultório"
                  width="512"
                  height="640"
                  fetchPriority="high"
                />
                <figcaption>
                  <span>Thayna Christer</span>
                  <small>PSICÓLOGA CLÍNICA</small>
                </figcaption>
              </div>
              <Sprig className="hero-sprig" />
            </figure>
          </div>
        </section>
        <div className="info-strip">
          <div className="wrap strip-layout">
            <div>
              <Monitor />
              <span>
                <strong>Atendimento online</strong>
                <small>Para todo o Brasil</small>
              </span>
            </div>
            <div>
              <MapPin />
              <span>
                <strong>Atendimento presencial</strong>
                <small>João Pessoa, PB</small>
              </span>
            </div>
            <div>
              <Clock3 />
              <span>
                <strong>Segunda a sexta</strong>
                <small>Das 7h30 às 17h30</small>
              </span>
            </div>
          </div>
        </div>
        <section
          id="atendimentos"
          className="section practice"
          aria-labelledby="practice-title"
        >
          <div className="wrap">
            <div className="practice-heading">
              <div>
                <p className="kicker">PSICOLOGIA NA PRÁTICA</p>
                <h2 id="practice-title">
                  O que te traz <em>à terapia?</em>
                </h2>
              </div>
              <p>
                Escolha uma situação do cotidiano e veja como ela pode ser
                trabalhada em uma sessão com a Thayna.
              </p>
            </div>
            <div
              className="practice-tabs"
              role="tablist"
              aria-label="Situações do cotidiano"
            >
              {situations.map(({ id, label, Icon }, index) => (
                <button
                  key={id}
                  ref={(element) => {
                    situationTabs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={"tema-" + id}
                  aria-selected={situationIndex === index}
                  aria-controls="exemplo-clinico"
                  tabIndex={situationIndex === index ? 0 : -1}
                  onClick={() => setSituationIndex(index)}
                  onKeyDown={(event) => navigateSituations(event, index)}
                >
                  <Icon aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
            <div
              id="exemplo-clinico"
              className="practice-panel"
              role="tabpanel"
              aria-labelledby={"tema-" + situation.id}
              tabIndex={0}
            >
              <div className="practice-scene">
                <Sprig className="practice-sprig" />
                <span className="scene-label">Situação ilustrativa</span>
                <blockquote key={situation.id} className="scene-quote">
                  “{situation.scene}”
                </blockquote>
              </div>
              <div key={situation.id} className="practice-reading">
                <p className="practice-method">
                  <b>{situation.approach.abbr}</b> {situation.approach.title}
                </p>
                <h3>{situation.question}</h3>
                <p className="practice-explanation">{situation.explanation}</p>
                <a className="quiet-link practice-link" href="#agenda">
                  <CalendarDays aria-hidden="true" />
                  Solicitar uma consulta
                </a>
              </div>
            </div>
          </div>
        </section>
        <section id="sobre" className="section about">
          <div className="wrap about-layout">
            <figure className="about-photo reveal">
              <img
                src="/imagens/thayna-escuta.webp"
                alt="Thayna Christer sentada no consultório"
                loading="lazy"
                width="512"
                height="640"
              />
            </figure>
            <div className="about-copy">
              <p className="kicker">SOBRE MIM</p>
              <h2>
                Olá, sou <em>Thayna.</em>
              </h2>
              <p>
                Sou Thayna Christer, psicóloga clínica em João Pessoa. Há mais
                de cinco anos, acompanho crianças, adolescentes e adultos em
                diferentes momentos da vida.
              </p>
              <p>
                Minha prática reúne três abordagens. A escolha de como trabalhar
                começa pela sua história e pelo que faz sentido para você.
              </p>
              <div className="approaches">
                <div
                  className="approach-tabs"
                  aria-label="Abordagens terapêuticas"
                >
                  {approaches.map((a, i) => (
                    <button
                      key={a.abbr}
                      aria-pressed={approach === i}
                      onClick={() => setApproach(i)}
                    >
                      {a.abbr}
                    </button>
                  ))}
                </div>
                <div key={approach} className="approach-info">
                  <h3>{approaches[approach].title}</h3>
                  <p>{approaches[approach].text}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Agenda initialDay={initialDay} />
        <Caderno initial={editions} />
        <section id="duvidas" className="section questions">
          <div className="wrap faq-layout">
            <div>
              <p className="kicker">DÚVIDAS FREQUENTES</p>
              <h2>
                Antes da
                <br />
                <em>primeira sessão.</em>
              </h2>
              <a
                className="quiet-link"
                href={whats}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com a Thayna
              </a>
            </div>
            <div className="faq-list">
              {faq.map(([q, a], i) => (
                <div className="faq-item" key={q}>
                  <h3>
                    <button
                      aria-expanded={faqIndex === i}
                      aria-controls={"resposta" + i}
                      onClick={() => setFaqIndex(faqIndex === i ? null : i)}
                    >
                      {q}
                      {faqIndex === i ? <Minus /> : <Plus />}
                    </button>
                  </h3>
                  <div
                    id={"resposta" + i}
                    className={faqIndex === i ? "answer expanded" : "answer"}
                    aria-hidden={faqIndex !== i}
                  >
                    <div>
                      <p>{a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="wrap footer-main">
          <div>
            <Brand />
            <p>CRP 13/11584 · João Pessoa, PB</p>
          </div>
          <div className="footer-links">
            <a href={whats} target="_blank" rel="noopener noreferrer">
              <MessageCircle /> (83) 98799-9427
            </a>
            <a href="mailto:thaynachrister1996@outlook.com">
              <Mail /> thaynachrister1996@outlook.com
            </a>
            <a
              href="https://instagram.com/psicothaynachrister"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Camera /> @psicothaynachrister
            </a>
          </div>
        </div>
        <div className="wrap footer-base">
          <span>© {initialDay.slice(0, 4)} Thayna Christer</span>
          <a href="#inicio">Voltar ao início</a>
        </div>
      </footer>
    </>
  );
}
