import { ContentValidationError } from "@content/validation";
import { ApiError } from "./firebase-server";

export function apiError(error: unknown, headers?: HeadersInit) {
  const known =
    error instanceof ApiError || error instanceof ContentValidationError;
  return Response.json(
    {
      error: known
        ? error.message
        : "Operazione non riuscita. Riprova tra poco.",
    },
    {
      status:
        error instanceof ApiError
          ? error.status
          : error instanceof ContentValidationError
            ? 400
            : 500,
      headers: { "Cache-Control": "no-store", ...headers },
    },
  );
}
