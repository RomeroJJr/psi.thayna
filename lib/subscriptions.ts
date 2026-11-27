import { BlobNotFoundError, del, get, put } from "@vercel/blob";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

function hash(value:string){return createHash("sha256").update(value).digest("hex");}
const pathFor=(id:string)=>"entrelinhas/inscricoes/"+id+".json";

export async function register(email:string) {
  const salt=process.env.SUBSCRIBER_KEY;
  if(!salt) throw new Error("Configuração de inscrições ausente.");
  const id=createHmac("sha256",salt).update(email).digest("hex");
  const token=id+"."+randomBytes(32).toString("hex");
  const path=pathFor(id);
  const record={email,createdAt:new Date().toISOString(),consentVersion:"interesse-caderno-1",cancelHash:hash(token)};
  try {
    await put(path,JSON.stringify(record),{access:"private",addRandomSuffix:false,allowOverwrite:false,contentType:"application/json"});
  } catch(error) {
    // A repeated signup must neither disclose prior registration nor rotate its cancellation link.
    const present=await get(path,{access:"private",useCache:false});
    if (!present || present.statusCode!==200) throw error;
    await present.stream.cancel();
  }
  return token;
}
export async function cancel(token:string) {
  if(!/^[0-9a-f]{64}\.[0-9a-f]{64}$/.test(token)) return false;
  const path=pathFor(token.split(".")[0]);
  try {
    const file=await get(path,{access:"private", useCache:false});
    if(!file||file.statusCode!==200) return false;
    const saved=await new Response(file.stream).json();
    if(typeof saved.cancelHash!=="string"||saved.cancelHash.length!==64||!timingSafeEqual(Buffer.from(saved.cancelHash),Buffer.from(hash(token)))) return false;
    await del(file.blob.url,{ifMatch:file.blob.etag});
    return true;
  } catch(error) {
    if(error instanceof BlobNotFoundError) return false;
    throw error;
  }
}
