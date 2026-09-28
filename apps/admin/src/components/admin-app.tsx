"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getClientAuth, prepareAuth } from "@/lib/firebase-client";
import { ContentEditor } from "./content-editor";

export function AdminApp({ configured }: { configured: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!configured);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!configured) return;
    try {
      return onAuthStateChanged(getClientAuth(), (nextUser) => {
        setUser(nextUser);
        setReady(true);
      });
    } catch {
      setError(
        "Il collegamento non è disponibile. Controlla la configurazione del pannello.",
      );
      setReady(true);
    }
  }, [configured]);

  if (!configured)
    return <ContentEditor user={null} onSignOut={async () => {}} />;
  if (!ready)
    return (
      <main className="auth-page">
        <p role="status">Accesso al pannello…</p>
      </main>
    );
  if (user)
    return (
      <ContentEditor
        key={user.uid}
        user={user}
        onSignOut={() => signOut(getClientAuth())}
      />
    );

  return (
    <main id="main-content" className="auth-page">
      <section className="auth-card">
        <span className="brand-mark">m.</span>
        <p className="eyebrow">MIRA EL BACHA / AREA RISERVATA</p>
        <h1>
          Gestisci
          <br />
          il tuo sito.
        </h1>
        <p>Accedi per aggiornare il portfolio e il CV.</p>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            const data = new FormData(event.currentTarget);
            try {
              const auth = await prepareAuth();
              await signInWithEmailAndPassword(
                auth,
                String(data.get("email")),
                String(data.get("password")),
              );
            } catch {
              setError(
                "Accesso non riuscito. Controlla email e password e riprova.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
          <button className="primary" disabled={busy}>
            {busy ? "Accesso in corso…" : "Accedi al pannello →"}
          </button>
        </form>
      </section>
    </main>
  );
}
