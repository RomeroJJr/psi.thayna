import { cancel } from "../../../../lib/subscriptions";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response(null, { status: 403 });
  try {
    const { token } = (await request.json()) as { token: unknown };
    if (typeof token !== "string" || token.length !== 129)
      return new Response(null, { status: 422 });
    if (!(await cancel(token)))
      return Response.json(
        {
          error:
            "Este link é inválido ou já foi usado. Se já havia um cadastro, use o link original.",
        },
        { status: 404 },
      );
    return Response.json({ ok: true });
  } catch {
    return new Response(null, { status: 503 });
  }
}
