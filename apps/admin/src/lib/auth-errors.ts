// Keep Firebase infrastructure failures distinct from invalid user sessions.
// SDK messages can contain sensitive details, so only return fixed messages.
export function getAuthFailure(error: unknown): {
  status: 401 | 403 | 503;
  message: string;
} {
  const code =
    error && typeof error === "object" && "code" in error
      ? error.code
      : undefined;

  switch (code) {
    case "auth/id-token-expired":
      return { status: 401, message: "Sessione scaduta. Accedi di nuovo." };
    case "auth/id-token-revoked":
      return {
        status: 401,
        message: "La sessione è stata revocata. Accedi di nuovo.",
      };
    case "auth/argument-error":
    case "auth/invalid-argument":
    case "auth/invalid-id-token":
      return {
        status: 401,
        message: "Accesso non valido. Esci e accedi di nuovo.",
      };
    case "auth/user-not-found":
      return {
        status: 401,
        message: "L’account non è più disponibile. Contatta l’amministratore.",
      };
    case "auth/user-disabled":
      return {
        status: 403,
        message: "Questo account è stato disabilitato. Contatta l’amministratore.",
      };
    case "auth/insufficient-permission":
      return {
        status: 503,
        message:
          "Il pannello non ha i permessi Firebase necessari per verificare l’accesso. L’amministratore deve completare la configurazione.",
      };
    case "auth/invalid-credential":
    case "app/invalid-credential":
    case "auth/project-not-found":
      return {
        status: 503,
        message:
          "La configurazione Firebase del pannello non è valida. Contatta l’amministratore.",
      };
    default:
      return {
        status: 503,
        message: "Non è stato possibile verificare l’accesso. Riprova tra poco.",
      };
  }
}
