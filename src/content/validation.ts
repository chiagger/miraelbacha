import type { ContentSnapshot, SiteContent } from "./types";

export const MAX_CONTENT_BYTES = 800_000;

export class ContentValidationError extends Error {}

function fail(field: string): never {
  throw new ContentValidationError(`Controlla il campo «${field}».`);
}

function object(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(field);
  return value as Record<string, unknown>;
}

function text(
  value: unknown,
  field: string,
  max = 12_000,
  required = false,
): string {
  if (
    typeof value !== "string" ||
    value.length > max ||
    (required && !value.trim())
  )
    fail(field);
  return value;
}

export function isSafeImageUrl(value: string): boolean {
  if (/[\s\\\u0000-\u001f\u007f]/.test(value)) return false;
  if (value.startsWith("/img/") && !value.includes("..")) return true;
  return isSafeWebUrl(value);
}

export function isSafeWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !/[\s\u0000-\u001f\u007f]/.test(value)
    );
  } catch {
    return false;
  }
}

function entries<T>(
  value: unknown,
  field: string,
  parse: (entry: Record<string, unknown>) => T,
): (T & { id: string })[] {
  if (!Array.isArray(value) || value.length > 300) fail(field);
  const ids = new Set<string>();
  return value.map((item) => {
    const entry = object(item, field);
    const id = text(entry.id, `${field}: identificativo`, 100, true);
    if (ids.has(id)) fail(`${field}: identificativi duplicati`);
    ids.add(id);
    return { ...parse(entry), id };
  });
}

export function parseContent(value: unknown): SiteContent {
  const data = object(value, "contenuti");
  if (data.schemaVersion !== 1) fail("versione dei contenuti");
  const profile = object(data.profile, "profilo");
  const contacts = object(data.contacts, "contatti");
  const webLink = (key: string) => {
    const link = text(contacts[key], key, 2048);
    if (link && !isSafeWebUrl(link)) fail(`${key}: usa un link https://`);
    return link;
  };
  const email = text(contacts.email, "email", 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("email");
  const experience = (entry: Record<string, unknown>) => ({
    title: text(entry.title, "titolo", 300, true),
    year: text(entry.year, "periodo", 150),
  });
  const content: SiteContent = {
    schemaVersion: 1,
    profile: {
      name: text(profile.name, "nome", 200, true),
      role: text(profile.role, "professione", 300),
    },
    contacts: {
      email,
      phone: text(contacts.phone, "telefono", 100),
      mandy: webLink("mandy"),
      instagram: webLink("instagram"),
      linkedin: webLink("linkedin"),
    },
    biography: entries(data.biography, "biografia", (entry) => {
      if (typeof entry.italic !== "boolean") fail("corsivo");
      return {
        lead: text(entry.lead, "introduzione", 300),
        text: text(entry.text, "paragrafo", 12_000, true),
        italic: entry.italic,
      };
    }),
    portfolio: entries(data.portfolio, "portfolio", (entry) => {
      if (
        !Array.isArray(entry.images) ||
        entry.images.length < 1 ||
        entry.images.length > 30
      )
        fail("immagini: da 1 a 30 per progetto");
      return {
        title: text(entry.title, "titolo progetto", 300, true),
        directedBy: text(entry.directedBy, "regia", 300),
        description: text(entry.description ?? "", "descrizione"),
        images: entry.images.map((image) => {
          const url = text(image, "immagine", 2048, true);
          if (!isSafeImageUrl(url))
            fail("immagine: usa un link https:// o /img/nome-file");
          return url;
        }),
      };
    }),
    assistantExperience: entries(
      data.assistantExperience,
      "esperienze AD",
      experience,
    ),
    otherExperience: entries(
      data.otherExperience,
      "altre esperienze",
      (entry) => ({
        ...experience(entry),
        role: text(entry.role, "ruolo", 300, true),
        description: text(entry.description, "descrizione"),
      }),
    ),
    education: entries(data.education, "formazione", (entry) => ({
      ...experience(entry),
      description: text(entry.description, "descrizione"),
    })),
    skills: entries(data.skills, "competenze", (entry) => ({
      text: text(entry.text, "competenza", 1000, true),
    })),
  };
  if (
    new TextEncoder().encode(JSON.stringify(content)).length > MAX_CONTENT_BYTES
  )
    fail("contenuti troppo grandi");
  return content;
}

export function parseSnapshot(value: unknown): ContentSnapshot {
  const data = object(value, "risposta del sito");
  if (!Number.isSafeInteger(data.revision) || (data.revision as number) < 0)
    fail("revisione");
  if (
    data.updatedAt !== null &&
    (typeof data.updatedAt !== "string" ||
      Number.isNaN(Date.parse(data.updatedAt)))
  )
    fail("data di aggiornamento");
  return {
    content: parseContent(data.content),
    revision: data.revision as number,
    updatedAt: data.updatedAt as string | null,
  };
}
