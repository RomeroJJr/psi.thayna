import { BlobNotFoundError, get, put } from "@vercel/blob";
import { createHash } from "node:crypto";
import initial from "./primeira-edicao.json";

export type Edition = { day: string; theme: string; title: string; body: string; question: string; source: string };
export const firstEdition: Edition = initial;
export function localDay(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {timeZone:"America/Fortaleza", year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
}
export function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

const archive = "entrelinhas/edicoes.json";
async function readArchive(): Promise<{ rows: Edition[]; etag?: string }> {
  try {
    const result = await get(archive,{access:"private",useCache:false});
    if (!result) return {rows: [firstEdition]};
    if(result.statusCode !== 200) throw new Error("Falha na leitura do arquivo.");
    return {rows: await new Response(result.stream).json(), etag: result.blob.etag};
  } catch (error) {
    if(error instanceof BlobNotFoundError) return {rows: [firstEdition]};
    throw error;
  }
}
export async function recentEditions() {
  const {rows} = await readArchive();
  return rows.filter(e=>e.day<=localDay()).sort((a,b)=>b.day.localeCompare(a.day)).slice(0,30);
}
export async function publishEdition(edition: Edition) {
  for (let attempt=0;attempt<3;attempt++) {
    const {rows,etag} = await readArchive();
    const existing = rows.find(e=>e.day===edition.day);
    if(existing && etag) return existing;
    const next=existing ? rows : [...rows, edition];
    try {
      await put(archive,JSON.stringify(next),{access:"private",addRandomSuffix:false,allowOverwrite:!!etag,ifMatch:etag,contentType:"application/json"});
      return existing || edition;
    } catch(error) {
      if(attempt===2) throw error;
    }
  }
  throw new Error("Não foi possível publicar a edição.");
}
