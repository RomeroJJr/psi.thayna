import { recentEditions } from "../../lib/caderno/editions";
export const dynamic = "force-dynamic";
const xml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
export async function GET(req: Request) {
  const origin = xml(new URL(req.url).origin);
  const rows = await recentEditions();
  const items = rows
    .map(
      (e) =>
        `<item><title>${xml(e.title)}</title><link>${origin}/?edicao=${e.day}#caderno</link><guid>${origin}/?edicao=${e.day}#caderno</guid><pubDate>${new Date(e.day + "T07:00:00-03:00").toUTCString()}</pubDate><description>${xml(e.body + "\n\n" + e.question)}</description></item>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Entrelinhas · Thayna Christer</title><link>${origin}/#caderno</link><language>pt-BR</language><description>Reflexões diárias sobre a vida cotidiana.</description>${items}</channel></rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "max-age=300",
      },
    },
  );
}
