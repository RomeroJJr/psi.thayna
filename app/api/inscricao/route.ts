import { register } from "../../../lib/subscriptions";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response(null, { status: 403 });
  let input;
  try {
    input = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(null, { status: 400 });
  }
  const email =
    typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    input.consent !== true
  )
    return Response.json(
      { error: "Confira seu e-mail e autorize o cadastro." },
      { status: 422 },
    );
  try {
    const token = await register(email);
    return Response.json(
      { ok: true, cancelToken: token },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Não foi possível salvar. Tente novamente." },
      { status: 503 },
    );
  }
}
