import { useState, type ReactNode } from "react";

interface EntryListProps<T extends { id: string }> {
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  title: (item: T) => string;
  subtitle?: (item: T) => string;
  addLabel: string;
  render: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
}

export function EntryList<T extends { id: string }>({
  items,
  onChange,
  create,
  title,
  subtitle,
  addLabel,
  render,
}: EntryListProps<T>) {
  const [openId, setOpenId] = useState<string | null>(null);
  function move(index: number, direction: number) {
    const next = [...items];
    [next[index], next[index + direction]] = [
      next[index + direction],
      next[index],
    ];
    onChange(next);
  }
  return (
    <div className="entry-list">
      {items.length === 0 && (
        <div className="empty-state">
          <strong>Nessuna voce in questa sezione</strong>
          <p>Aggiungi la prima voce per mostrarla sul sito.</p>
        </div>
      )}
      {items.map((item, index) => (
        <section
          className={`entry ${openId === item.id ? "expanded" : ""}`}
          key={item.id}
        >
          <div className="entry-heading">
            <span className="entry-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="entry-toggle"
              aria-expanded={openId === item.id}
              aria-controls={`entry-${item.id}`}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            >
              <strong>{title(item) || "Nuova voce"}</strong>
              {subtitle && <span>{subtitle(item) || "Da completare"}</span>}
            </button>
            <div className="entry-actions">
              <button
                type="button"
                className="icon-button"
                disabled={index === 0}
                aria-label={`Sposta ${title(item) || "voce"} in alto`}
                onClick={() => move(index, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="icon-button"
                disabled={index === items.length - 1}
                aria-label={`Sposta ${title(item) || "voce"} in basso`}
                onClick={() => move(index, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="text-button danger"
                aria-label={`Elimina ${title(item) || "voce"}`}
                onClick={() => {
                  if (
                    window.confirm(
                      `Eliminare “${title(item) || "Nuova voce"}”? La modifica sarà pubblicata solo dopo il salvataggio.`,
                    )
                  )
                    onChange(items.filter((entry) => entry.id !== item.id));
                }}
              >
                Elimina
              </button>
            </div>
          </div>
          {openId === item.id && (
            <div className="entry-body" id={`entry-${item.id}`}>
              {render(item, (patch) =>
                onChange(
                  items.map((entry) =>
                    entry.id === item.id ? { ...entry, ...patch } : entry,
                  ),
                ),
              )}
              <button
                className="text-button"
                type="button"
                onClick={() => setOpenId(null)}
              >
                Chiudi modifica ↑
              </button>
            </div>
          )}
        </section>
      ))}
      <button
        type="button"
        className="add-entry"
        disabled={items.length >= 300}
        onClick={() => {
          const item = create();
          onChange([...items, item]);
          setOpenId(item.id);
        }}
      >
        <span aria-hidden="true">＋</span>
        {addLabel}
      </button>
    </div>
  );
}
