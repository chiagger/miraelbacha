import type { SiteContent } from "@content/types";
import { EntryList } from "./entry-list";
import { Field, ImageFields } from "./fields";

export const sections = [
  {
    key: "portfolio",
    label: "Portfolio",
    description: "Progetti, regia, descrizioni e gallerie di immagini.",
    group: "LAVORI",
  },
  {
    key: "assistantExperience",
    label: "Esperienze AD",
    description:
      "I lavori come 1st Assistant Director, nell’ordine in cui appariranno nel CV.",
    group: "CURRICULUM",
  },
  {
    key: "otherExperience",
    label: "Altre esperienze",
    description: "Ruoli, collaborazioni e altre esperienze professionali.",
  },
  {
    key: "education",
    label: "Formazione",
    description: "Scuole, corsi e percorsi di studio.",
  },
  {
    key: "skills",
    label: "Competenze",
    description: "Lingue e competenze da mostrare nel CV.",
  },
  {
    key: "profile",
    label: "Profilo e biografia",
    description: "Nome, professione e i paragrafi di presentazione nella home.",
    group: "INFORMAZIONI",
  },
  {
    key: "contacts",
    label: "Contatti",
    description: "Come raggiungerti: email, telefono e profili online.",
  },
] as const;
export type Section = (typeof sections)[number]["key"];

export function ContentFields({
  section,
  content,
  onChange,
}: {
  section: Section;
  content: SiteContent;
  onChange: (content: SiteContent) => void;
}) {
  function change<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    onChange({ ...content, [key]: value });
  }
  const id = () => crypto.randomUUID();
  switch (section) {
    case "portfolio":
      return (
        <EntryList
          items={content.portfolio}
          onChange={(items) => change("portfolio", items)}
          addLabel="Aggiungi progetto"
          title={(item) => item.title}
          subtitle={(item) =>
            `${item.directedBy || "Regia da indicare"} · ${item.images.length} immagini`
          }
          create={() => ({
            id: id(),
            title: "",
            directedBy: "",
            description: "",
            images: [""],
          })}
          render={(item, update) => (
            <>
              <div className="field-grid">
                <Field
                  label="Titolo del progetto"
                  value={item.title}
                  onChange={(title) => update({ title })}
                  required
                  maxLength={300}
                />
                <Field
                  label="Regia"
                  value={item.directedBy}
                  onChange={(directedBy) => update({ directedBy })}
                  maxLength={300}
                />
              </div>
              <Field
                label="Descrizione"
                value={item.description ?? ""}
                onChange={(description) => update({ description })}
                multiline
              />
              <ImageFields
                images={item.images}
                onChange={(images) => update({ images })}
              />
            </>
          )}
        />
      );
    case "assistantExperience":
      return (
        <EntryList
          items={content.assistantExperience}
          onChange={(items) => change("assistantExperience", items)}
          addLabel="Aggiungi esperienza AD"
          title={(item) => item.title}
          subtitle={(item) => item.year}
          create={() => ({ id: id(), title: "", year: "" })}
          render={(item, update) => (
            <div className="field-grid">
              <Field
                label="Titolo del lavoro"
                value={item.title}
                onChange={(title) => update({ title })}
                required
                maxLength={300}
              />
              <Field
                label="Anno o periodo"
                value={item.year}
                onChange={(year) => update({ year })}
                maxLength={150}
              />
            </div>
          )}
        />
      );
    case "otherExperience":
      return (
        <EntryList
          items={content.otherExperience}
          onChange={(items) => change("otherExperience", items)}
          addLabel="Aggiungi esperienza"
          title={(item) => item.role}
          subtitle={(item) => `${item.title} · ${item.year}`}
          create={() => ({
            id: id(),
            title: "",
            role: "",
            year: "",
            description: "",
          })}
          render={(item, update) => (
            <>
              <div className="field-grid">
                <Field
                  label="Ruolo"
                  value={item.role}
                  onChange={(role) => update({ role })}
                  required
                  maxLength={300}
                />
                <Field
                  label="Progetto o organizzazione"
                  value={item.title}
                  onChange={(title) => update({ title })}
                  required
                  maxLength={300}
                />
              </div>
              <Field
                label="Anno o periodo"
                value={item.year}
                onChange={(year) => update({ year })}
                maxLength={150}
              />
              <Field
                label="Descrizione"
                value={item.description}
                onChange={(description) => update({ description })}
                multiline
              />
            </>
          )}
        />
      );
    case "education":
      return (
        <EntryList
          items={content.education}
          onChange={(items) => change("education", items)}
          addLabel="Aggiungi formazione"
          title={(item) => item.title}
          subtitle={(item) => item.year}
          create={() => ({ id: id(), title: "", year: "", description: "" })}
          render={(item, update) => (
            <>
              <Field
                label="Scuola o istituzione"
                value={item.title}
                onChange={(title) => update({ title })}
                required
                maxLength={300}
              />
              <Field
                label="Titolo di studio e periodo"
                value={item.year}
                onChange={(year) => update({ year })}
                maxLength={150}
              />
              <Field
                label="Descrizione"
                value={item.description}
                onChange={(description) => update({ description })}
                multiline
              />
            </>
          )}
        />
      );
    case "skills":
      return (
        <EntryList
          items={content.skills}
          onChange={(items) => change("skills", items)}
          addLabel="Aggiungi competenza"
          title={(item) => item.text}
          create={() => ({ id: id(), text: "" })}
          render={(item, update) => (
            <Field
              label="Competenza"
              value={item.text}
              onChange={(text) => update({ text })}
              required
              maxLength={1000}
            />
          )}
        />
      );
    case "profile":
      return (
        <>
          <section className="form-card">
            <h2>Intestazione del sito</h2>
            <div className="field-grid">
              <Field
                label="Nome"
                value={content.profile.name}
                onChange={(name) =>
                  change("profile", { ...content.profile, name })
                }
                required
                maxLength={200}
              />
              <Field
                label="Professione"
                value={content.profile.role}
                onChange={(role) =>
                  change("profile", { ...content.profile, role })
                }
                maxLength={300}
              />
            </div>
          </section>
          <h2 className="subheading">Biografia</h2>
          <EntryList
            items={content.biography}
            onChange={(items) => change("biography", items)}
            addLabel="Aggiungi paragrafo"
            title={(item) => item.lead || item.text.slice(0, 90)}
            create={() => ({ id: id(), lead: "", text: "", italic: false })}
            render={(item, update) => (
              <>
                <Field
                  label="Introduzione in grassetto (facoltativa)"
                  value={item.lead}
                  onChange={(lead) => update({ lead })}
                  maxLength={300}
                />
                <Field
                  label="Testo del paragrafo"
                  value={item.text}
                  onChange={(text) => update({ text })}
                  multiline
                  required
                />
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={item.italic}
                    onChange={(event) =>
                      update({ italic: event.target.checked })
                    }
                  />
                  Mostra il paragrafo in corsivo
                </label>
              </>
            )}
          />
        </>
      );
    case "contacts":
      return (
        <section className="form-card">
          <h2>Recapiti e profili</h2>
          <div className="field-grid">
            <Field
              label="Email"
              type="email"
              value={content.contacts.email}
              onChange={(email) =>
                change("contacts", { ...content.contacts, email })
              }
              maxLength={254}
            />
            <Field
              label="Telefono"
              type="tel"
              value={content.contacts.phone}
              onChange={(phone) =>
                change("contacts", { ...content.contacts, phone })
              }
              maxLength={100}
            />
          </div>
          {(["mandy", "instagram", "linkedin"] as const).map((key) => (
            <Field
              key={key}
              label={
                {
                  mandy: "Mandy",
                  instagram: "Instagram",
                  linkedin: "LinkedIn",
                }[key]
              }
              type="url"
              value={content.contacts[key]}
              onChange={(value) =>
                change("contacts", { ...content.contacts, [key]: value })
              }
              maxLength={2048}
              hint="Lascia vuoto per nascondere questo collegamento."
            />
          ))}
        </section>
      );
  }
}
