import { useId } from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
}

export function Field({
  label,
  value,
  onChange,
  multiline,
  type = "text",
  hint,
  required,
  maxLength = 12000,
}: FieldProps) {
  const id = useId();
  const props = {
    id,
    value,
    required,
    maxLength,
    "aria-describedby": hint ? `${id}-hint` : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
  };
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {multiline ? (
        <textarea {...props} rows={4} />
      ) : (
        <input {...props} type={type} />
      )}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </div>
  );
}

export function ImageFields({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  return (
    <div className="image-fields">
      <p className="field-label">Immagini del progetto</p>
      <p className="hint">
        La prima immagine è la copertina. Usa un link HTTPS oppure il percorso
        di un’immagine già nel sito, ad esempio /img/PVC1.jpg.
      </p>
      {images.map((url, index) => (
        <div className="image-row" key={index}>
          <Field
            label={`Immagine ${index + 1}`}
            value={url}
            onChange={(value) =>
              onChange(images.map((item, i) => (i === index ? value : item)))
            }
            required
            maxLength={2048}
          />
          <button
            type="button"
            className="icon-button"
            aria-label={`Sposta immagine ${index + 1} prima della precedente`}
            disabled={index === 0}
            onClick={() => {
              const next = [...images];
              [next[index - 1], next[index]] = [next[index], next[index - 1]];
              onChange(next);
            }}
          >
            ↑
          </button>
          <button
            type="button"
            className="text-button danger"
            aria-label={`Rimuovi immagine ${index + 1}`}
            onClick={() => onChange(images.filter((_, i) => i !== index))}
          >
            Rimuovi
          </button>
        </div>
      ))}
      <button
        type="button"
        className="secondary small"
        disabled={images.length >= 30}
        onClick={() => onChange([...images, ""])}
      >
        + Aggiungi immagine
      </button>
    </div>
  );
}
