import Clinica from "../components/clinica";
import {
  firstEdition,
  localDay,
  recentEditions,
} from "../lib/caderno/editions";
export const dynamic = "force-dynamic";
export default async function Home() {
  let editions = [firstEdition];
  try {
    editions = await recentEditions();
  } catch {
    /* The original edition can still be read when storage is unavailable. */
  }
  return <Clinica initialDay={localDay()} editions={editions} />;
}
