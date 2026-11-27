import { recentEditions } from "../../../lib/caderno/editions";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return Response.json(
      { editions: await recentEditions() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Não foi possível carregar o caderno." },
      { status: 503 },
    );
  }
}
