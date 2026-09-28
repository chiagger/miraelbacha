import { parseSnapshot } from "@content/validation";

export async function readContentResponse(response: Response) {
  const unavailable =
    "Il server del pannello non è disponibile. Riprova tra poco.";
  const unexpected =
    "Il server ha restituito una risposta inattesa. Riprova tra poco.";
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error(response.status >= 500 ? unavailable : unexpected);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(response.status >= 500 ? unavailable : unexpected);
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? payload.error
        : undefined;
    throw new Error(
      typeof message === "string" && message.trim()
        ? message
        : response.status >= 500
          ? unavailable
          : "Operazione non riuscita. Riprova tra poco.",
    );
  }

  return parseSnapshot(payload);
}
