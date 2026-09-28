import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function getServerApp() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new ApiError(
      503,
      "Il collegamento a Firebase non è ancora configurato.",
    );
  }
  const name = "mira-content-admin";
  return (
    getApps().find((app) => app.name === name) ??
    initializeApp(
      {
        credential: cert({ projectId, clientEmail, privateKey }),
      },
      name,
    )
  );
}

export function getContentDatabase() {
  return getFirestore(getServerApp());
}

export async function requireAdmin(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer (\S+)$/)?.[1];
  if (!token) throw new ApiError(401, "Accedi per gestire il sito.");
  const allowed = (process.env.ADMIN_UIDS ?? "")
    .split(",")
    .map((uid) => uid.trim())
    .filter(Boolean);
  if (!allowed.length)
    throw new ApiError(503, "Nessun amministratore configurato.");
  const auth = getAuth(getServerApp());
  let uid: string;
  try {
    uid = (await auth.verifyIdToken(token, true)).uid;
  } catch {
    throw new ApiError(401, "Sessione scaduta. Accedi di nuovo.");
  }
  if (!allowed.includes(uid))
    throw new ApiError(
      403,
      "Questo account non è autorizzato a gestire il sito.",
    );
  return uid;
}
