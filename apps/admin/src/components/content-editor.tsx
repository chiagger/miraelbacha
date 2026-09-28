"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type { ContentSnapshot, SiteContent } from "@content/types";
import { defaultContent } from "@content/defaults";
import { parseContent } from "@content/validation";
import { readContentResponse } from "@/lib/content-response";
import { ContentFields, sections, type Section } from "./content-fields";

const initial: ContentSnapshot = {
  content: defaultContent,
  revision: 0,
  updatedAt: null,
};

export function ContentEditor({
  user,
  onSignOut,
}: {
  user: User | null;
  onSignOut: () => Promise<void>;
}) {
  const [snapshot, setSnapshot] = useState<ContentSnapshot>(initial);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [section, setSection] = useState<Section>("portfolio");
  const [loading, setLoading] = useState(Boolean(user));
  const [loaded, setLoaded] = useState(!user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  const dirty = JSON.stringify(content) !== JSON.stringify(snapshot.content);
  const current = sections.find((item) => item.key === section)!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const token = await user!.getIdToken();
        const response = await fetch("/api/admin/content", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await readContentResponse(response);
        if (!controller.signal.aborted) {
          setSnapshot(result);
          setContent(result.content);
          setLoaded(true);
        }
      } catch (err) {
        if (!controller.signal.aborted)
          setError(
            err instanceof Error
              ? err.message
              : "Impossibile caricare il sito.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [user, reload]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    if (!user || !loaded || saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const validated = parseContent(content);
      const token = await user.getIdToken();
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: validated,
          revision: snapshot.revision,
        }),
      });
      const result = await readContentResponse(response);
      setSnapshot(result);
      setContent(result.content);
      setNotice("Modifiche salvate. Sono già disponibili ricaricando il sito.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Salvataggio non riuscito. Le modifiche sono ancora qui.",
      );
    } finally {
      setSaving(false);
    }
  }

  function discard() {
    if (window.confirm("Annullare tutte le modifiche non salvate?")) {
      setContent(snapshot.content);
      setError("");
      setNotice("");
    }
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">m.</span>
          <span>
            Mira El Bacha<small>Gestione del sito</small>
          </span>
        </div>
        <nav aria-label="Sezioni del sito">
          {sections.map((item) => (
            <div key={item.key}>
              {"group" in item && <p className="nav-group">{item.group}</p>}
              <button
                aria-current={section === item.key ? "page" : undefined}
                onClick={() => setSection(item.key)}
              >
                <span>{item.label}</span>
                {Array.isArray(content[item.key]) && (
                  <span className="count">
                    {(content[item.key] as unknown[]).length}
                  </span>
                )}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="avatar">ME</div>
          <div>
            <strong>{user ? "Area riservata" : "Modalità demo"}</strong>
            <small>{user?.email || "Esplora il pannello"}</small>
          </div>
        </div>
        {user && (
          <button
            className="signout"
            disabled={saving}
            onClick={() => {
              if (
                !dirty ||
                window.confirm("Uscire e perdere le modifiche non salvate?")
              )
                void onSignOut().catch(() =>
                  setError("Uscita non riuscita. Riprova."),
                );
            }}
          >
            Esci dall’account
          </button>
        )}
      </aside>
      <div className="workspace">
        <header className="toolbar">
          <div>
            <span className="eyebrow">IL TUO SITO</span>
            <p>
              {saving
                ? "Salvataggio in corso…"
                : dirty
                  ? "Modifiche non salvate"
                  : !user
                    ? "Anteprima dei contenuti"
                    : loading
                      ? "Caricamento…"
                      : !loaded
                        ? "Da collegare"
                        : "Nessuna modifica in sospeso"}
            </p>
          </div>
          <div className="toolbar-actions">
            {siteUrl && (
              <a
                className="secondary"
                href={siteUrl}
                target="_blank"
                rel="noreferrer"
              >
                Apri sito ↗
              </a>
            )}
            <button
              className="primary"
              disabled={!user || !dirty || saving || loading || !loaded}
              onClick={() => void save()}
            >
              {saving ? "Salvataggio…" : "Salva sul sito"}
            </button>
          </div>
        </header>
        <main id="main-content">
          {!user && (
            <div className="demo-banner">
              <strong>Stai provando il pannello.</strong> Le modifiche restano
              in questa pagina. Il salvataggio sul sito sarà disponibile dopo la
              configurazione di Firebase.
            </div>
          )}
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                CONTENUTI /{" "}
                {section === "profile" || section === "contacts"
                  ? "INFORMAZIONI"
                  : section === "portfolio"
                    ? "PORTFOLIO"
                    : "CV"}
              </p>
              <h1>{current.label}</h1>
              <p>{current.description}</p>
            </div>
            <span className="section-index">
              {String(
                sections.findIndex((item) => item.key === section) + 1,
              ).padStart(2, "0")}
            </span>
          </div>
          {error && (
            <div role="alert" className="error-message">
              <p>{error}</p>
              <button
                className="text-button"
                onClick={() => {
                  if (
                    !dirty ||
                    window.confirm(
                      "Ricaricare i dati dal sito e annullare le modifiche locali?",
                    )
                  ) {
                    setNotice("");
                    setReload((value) => value + 1);
                  }
                }}
              >
                Ricarica i contenuti
              </button>
            </div>
          )}
          {notice && (
            <p role="status" className="success-message">
              {notice}
            </p>
          )}
          {loading ? (
            <p role="status" className="loading">
              Caricamento dei contenuti…
            </p>
          ) : !loaded ? (
            <div className="empty-state">
              <h2>Contenuti non disponibili</h2>
              <p>Riprova il caricamento per iniziare a modificare il sito.</p>
            </div>
          ) : (
            <>
              <fieldset className="editor-fields" disabled={saving}>
                <legend className="sr-only">{current.label}</legend>
                <ContentFields
                  key={section}
                  section={section}
                  content={content}
                  onChange={(value) => {
                    setContent(value);
                    setNotice("");
                  }}
                />
              </fieldset>
              <footer className="editor-footer">
                <p>
                  {snapshot.updatedAt
                    ? `Ultimo salvataggio: ${new Date(snapshot.updatedAt).toLocaleString("it-IT")}`
                    : "I contenuti iniziali corrispondono al sito attuale."}
                </p>
                {dirty && (
                  <button
                    className="text-button"
                    disabled={saving}
                    onClick={discard}
                  >
                    Annulla modifiche
                  </button>
                )}
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
