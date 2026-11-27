"use client";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  MessageCircle,
  Sun,
  Moon,
  Clock3,
} from "lucide-react";
const zone = "America/Fortaleza";
const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pt-BR", { ...opts, timeZone: "UTC" }).format(d);
const dayKey = (d: Date) => d.toISOString().slice(0, 10);
function nowLocal() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const at = (k: string) => parts.find((p) => p.type === k)!.value;
  return {
    today: at("year") + "-" + at("month") + "-" + at("day"),
    minutes: +at("hour") * 60 + +at("minute"),
  };
}
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const mondayIndex = (d: Date) => (d.getUTCDay() + 6) % 7;
export default function Agenda({ initialDay }: { initialDay: string }) {
  const [clock, setClock] = useState({ today: initialDay, minutes: 0 });
  useEffect(() => {
    setClock(nowLocal());
    const t = setInterval(() => setClock(nowLocal()), 30000);
    return () => clearInterval(t);
  }, []);
  const [month, setMonth] = useState(initialDay.slice(0, 7));
  const [selected, setSelected] = useState("");
  const [mod, setMod] = useState("Online");
  const [period, setPeriod] = useState("");
  const [error, setError] = useState("");
  const first = new Date(month + "-01T12:00:00Z"),
    last = new Date(
      Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0, 12),
    );
  const max = dayKey(addDays(new Date(clock.today + "T12:00:00Z"), 90));
  const allowed = (d: Date) => {
    const k = dayKey(d);
    return (
      k >= clock.today &&
      k <= max &&
      d.getUTCDay() !== 0 &&
      d.getUTCDay() !== 6 &&
      (k !== clock.today || clock.minutes < 1050)
    );
  };
  function turn(delta: number) {
    setMonth(
      dayKey(
        new Date(
          Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + delta, 1, 12),
        ),
      ).slice(0, 7),
    );
    setError("");
  }
  const label = selected
    ? fmt(new Date(selected + "T12:00:00Z"), {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  function requestTime() {
    const now = nowLocal();
    if (
      !selected ||
      selected < now.today ||
      (selected === now.today && now.minutes >= 1050)
    ) {
      setError("Selecione uma data para solicitar seu atendimento.");
      return;
    }
    if (
      !period ||
      (selected === now.today && period === "Manhã" && now.minutes >= 720)
    ) {
      setError("Selecione um período para a consulta.");
      return;
    }
    const text =
      "Olá, Thayna! Gostaria de solicitar uma consulta " +
      (mod === "Online" ? "online" : "presencial em João Pessoa") +
      " para " +
      label +
      ", no período da " +
      period.toLocaleLowerCase("pt-BR") +
      ". Você pode confirmar a disponibilidade?";
    window.open(
      "https://wa.me/5583987999427?text=" + encodeURIComponent(text),
      "_blank",
      "noopener,noreferrer",
    );
    setError("Conclua o envio no WhatsApp e aguarde a confirmação da Thayna.");
  }
  return (
    <section id="agenda" className="schedule section">
      <div className="wrap agenda-layout">
        <div className="agenda-intro">
          <p className="kicker">AGENDA DE CONSULTAS</p>
          <h2>
            Vamos encontrar
            <br />
            <em>um horário?</em>
          </h2>
          <p>
            Escolha a modalidade, o dia e o período que funcionam para você. A
            Thayna confirma a disponibilidade pelo WhatsApp.
          </p>
          <ul className="facts">
            <li>
              <Clock3 />
              Segunda a sexta, das 7h30 às 17h30
            </li>
            <li>
              <MapPin />
              Horário de João Pessoa, PB
            </li>
          </ul>
        </div>
        <div className="calendar-card">
          <div className="calendar-title">
            <CalendarDays />
            <h3>Solicitar uma consulta</h3>
          </div>
          <fieldset>
            <legend>Modalidade</legend>
            <div className="segments">
              {[
                { name: "Online", Icon: Video },
                { name: "Presencial", Icon: MapPin },
              ].map(({ name, Icon }) => (
                <button
                  type="button"
                  key={name}
                  aria-pressed={mod === name}
                  onClick={() => setMod(name)}
                >
                  <Icon size={17} />
                  {name}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="month-head">
            <strong>{fmt(first, { month: "long", year: "numeric" })}</strong>
            <div>
              <button
                aria-label="Mês anterior"
                disabled={month <= clock.today.slice(0, 7)}
                onClick={() => turn(-1)}
              >
                <ChevronLeft />
              </button>
              <button
                aria-label="Próximo mês"
                disabled={month >= max.slice(0, 7)}
                onClick={() => turn(1)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="calendar-grid">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((v) => (
              <span className="weekday" key={v}>
                {v}
              </span>
            ))}
            {Array.from({ length: mondayIndex(first) }, (_, i) => (
              <span key={"blank" + i} />
            ))}
            {Array.from({ length: last.getUTCDate() }, (_, i) => {
              const date = addDays(first, i),
                key = dayKey(date);
              return (
                <button
                  key={key}
                  disabled={!allowed(date)}
                  aria-label={fmt(date, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  aria-pressed={selected === key}
                  className={key === clock.today ? "today" : ""}
                  onClick={() => {
                    setSelected(key);
                    setPeriod("");
                    setError("");
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <fieldset>
            <legend>Período de preferência</legend>
            <div className="periods">
              {["Manhã", "Tarde"].map((v, i) => (
                <button
                  key={v}
                  aria-pressed={v === period}
                  disabled={
                    !selected ||
                    (selected === clock.today &&
                      (i === 0 ? clock.minutes >= 720 : clock.minutes >= 1050))
                  }
                  onClick={() => {
                    setPeriod(v);
                    setError("");
                  }}
                >
                  {i === 0 ? <Sun size={16} /> : <Moon size={16} />} {v}
                </button>
              ))}
            </div>
          </fieldset>
          {selected && (
            <p className="picked">
              {label} · {mod}
              {period ? " · " + period : ""}
            </p>
          )}
          <button
            type="button"
            className="button solid calendar-submit"
            onClick={requestTime}
          >
            <MessageCircle size={18} />
            Solicitar pelo WhatsApp
          </button>
          <p className="feedback" aria-live="polite">
            {error}
          </p>
        </div>
      </div>
    </section>
  );
}
