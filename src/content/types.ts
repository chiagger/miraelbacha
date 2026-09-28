import type { CV1stAdExp, CVOtherExp } from "../data/cv";
import type { PortfolioItem } from "../data/portfolio";

export type ContentEntry<T> = T & { id: string };

export interface SiteContent {
  schemaVersion: 1;
  profile: { name: string; role: string };
  biography: ContentEntry<{ lead: string; text: string; italic: boolean }>[];
  portfolio: ContentEntry<PortfolioItem>[];
  assistantExperience: ContentEntry<CV1stAdExp>[];
  otherExperience: ContentEntry<CVOtherExp>[];
  education: ContentEntry<CV1stAdExp & { description: string }>[];
  skills: ContentEntry<{ text: string }>[];
  contacts: {
    email: string;
    phone: string;
    mandy: string;
    instagram: string;
    linkedin: string;
  };
}

export interface ContentSnapshot {
  content: SiteContent;
  revision: number;
  updatedAt: string | null;
}

export type CollectionKey = {
  [K in keyof SiteContent]: SiteContent[K] extends unknown[] ? K : never;
}[keyof SiteContent];
