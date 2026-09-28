import "server-only";
import { defaultContent } from "@content/defaults";
import { parseSnapshot } from "@content/validation";
import type { ContentSnapshot, SiteContent } from "@content/types";
import { ApiError, getContentDatabase } from "./firebase-server";

const DOCUMENT_PATH = "siteContent/miraelbacha";

export async function readContent(): Promise<ContentSnapshot> {
  const doc = await getContentDatabase().doc(DOCUMENT_PATH).get();
  return doc.exists
    ? parseSnapshot(doc.data())
    : { content: defaultContent, revision: 0, updatedAt: null };
}

export async function saveContent(
  content: SiteContent,
  revision: number,
  uid: string,
): Promise<ContentSnapshot> {
  const db = getContentDatabase();
  const ref = db.doc(DOCUMENT_PATH);
  return db.runTransaction(async (transaction) => {
    const current = await transaction.get(ref);
    const latest = current.exists ? parseSnapshot(current.data()).revision : 0;
    if (latest !== revision) {
      throw new ApiError(
        409,
        "Il sito è stato modificato da un’altra sessione. Ricarica i contenuti prima di salvare.",
      );
    }
    const snapshot = {
      content,
      revision: latest + 1,
      updatedAt: new Date().toISOString(),
    };
    transaction.set(ref, { ...snapshot, updatedBy: uid });
    return snapshot;
  });
}
