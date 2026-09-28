import { cv1stAdExp, cvOtherExperience } from "../data/cv";
import { portfolio } from "../data/portfolio";
import type { SiteContent } from "./types";

export const defaultContent: SiteContent = {
  schemaVersion: 1,
  profile: { name: "Mira El Bacha", role: "1st Assistant Director" },
  biography: [
    {
      id: "bio-1",
      lead: "",
      text: "Welcome! I am a 1st AD based in East London. I have worked as an AD across continents, collaborating with brands in Italy, the UAE, Germany, the Netherlands, and the UK.",
      italic: false,
    },
    {
      id: "bio-2",
      lead: "",
      text: "You can find a full list of my brand collaborations and AD work below: they range from the Roundhouse in London, to the Cineteca di Bologna in Italy, to the Abu Dhabi Media Company in the UAE.",
      italic: false,
    },
    {
      id: "bio-3",
      lead: "",
      text: "I am currently open to new work.",
      italic: true,
    },
    {
      id: "bio-4",
      lead: "Organised.",
      text: "I keep everything on track while making sure creativity has the space it needs to thrive. I have managed schedules for teams of over 50 people without a hitch. Every film I have AD-ed has wrapped up on time, and with satisfied creative teams.",
      italic: false,
    },
    {
      id: "bio-5",
      lead: "Inclusive.",
      text: "I have been an LGBT activist since I was fifteen, as an queer Arab myself. I have worked in anti-racist advocacy, and I am trained in disability inclusion. My work is about listening to the needs of everyone on set and making sure every crew member is valued and motivated.",
      italic: false,
    },
    {
      id: "bio-6",
      lead: "Passionate.",
      text: "I love being part of this industry. I have taught film, studied film, and made films since 2014. Films are the most powerful tool for inspiring and connecting people: my commitment to this field is unwavering.",
      italic: false,
    },
  ],
  portfolio: portfolio.map((entry, index) => ({
    ...entry,
    id: `project-${index + 1}`,
  })),
  assistantExperience: cv1stAdExp.map((entry, index) => ({
    ...entry,
    id: `ad-${index + 1}`,
  })),
  otherExperience: cvOtherExperience.map((entry, index) => ({
    ...entry,
    id: `experience-${index + 1}`,
  })),
  education: [
    {
      id: "education-1",
      title: "UAL; University of the Arts London",
      year: "BA Film Practice | 2020 - 2023",
      description:
        "Roles: Directing, Casting directing, 1AD, Cinematography and Screenwriting.",
    },
    {
      id: "education-2",
      title: "Liceo Artistico Arcangeli, Bologna",
      year: "2015 - 2020",
      description: "Specialized in audiovisual and multimedia.",
    },
  ],
  skills: [
    "Languages: English (C2), Italian (C2) and Levantine Arabic (B2)",
    "Excellent team work and team building skills",
    "Fast learner",
    "Organised",
    "Time management",
  ].map((text, index) => ({ id: `skill-${index + 1}`, text })),
  contacts: {
    email: "miraelbacha.eb@gmail.com",
    phone: "+44 7884 177270",
    mandy: "https://www.mandy.com/uk/c/mira-el-bacha",
    instagram:
      "https://www.instagram.com/mira.elbacha/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==",
    linkedin: "https://www.linkedin.com/in/mira-el-bacha-00a5ab2a9",
  },
};
