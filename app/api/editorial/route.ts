import { digest, localDay, publishEdition } from "../../../lib/caderno/editions";
function validText(value: unknown, min: number, max: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= min &&
    value.length <= max
  );
}
export async function POST(req: Request) {
  const proof = req.headers.get("X-Editorial-Proof") || "";
  const expected = process.env.EDITOR_PROOF_SHA256;
  if (!expected || proof.length !== 64 || (await digest(proof)) !== expected)
    return new Response(null, { status: 403 });
  let data;
  try {
    data = (await req.json()) as Record<string, unknown>;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (
    !data ||
    data.day !== localDay() ||
    !validText(data.title, 5, 120) ||
    !validText(data.body, 100, 3000) ||
    !validText(data.theme, 3, 50) ||
    !validText(data.question, 10, 240)
  ) {
    return Response.json(
      { error: "Confira a data local, título, tema, texto e pergunta." },
      { status: 422 },
    );
  }
  const source = data.source || "";
  if (
    typeof source !== "string" ||
    (source &&
      !/^https:\/\/(?:www\.)?(?:who\.int|paho\.org|gov\.br|fiocruz\.br|cfp\.org\.br)\//.test(
        source,
      ))
  )
    return new Response(null, { status: 422 });
  const record = {
    day: data.day,
    title: data.title.trim(),
    body: data.body.trim(),
    theme: data.theme.trim(),
    question: data.question.trim(),
    source,
  };
  const saved = await publishEdition(record);
  return Response.json(
    { edition: saved },
    { headers: { "Cache-Control": "no-store" } },
  );
}
