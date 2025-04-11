export interface CV1stAdExp {
  title: string;
  year: string;
}

export interface CVOtherExp {
  role: string;
  title: string;
  year: string;
  description: string;
}

export const cv1stAdExp: CV1stAdExp[] = [
  { title: "Paper Cranes", year: "2025" },
  { title: "Get Out Breathing", year: "2025" },
  { title: "The Surrogate", year: "2024" },
  { title: "Oblivion", year: "2024" },
  { title: "Moirai (Karma)", year: "2024" },
  { title: "The Black Pill", year: "2024" },
  { title: "The Sandman", year: "2024" },
  { title: "The Chopping Block", year: "2024" },
  { title: "That's All From Me", year: "2024" },
  { title: "PVC Real Estate", year: "2024" },
  { title: "The Barn", year: "2024" },
  { title: "In Two Minds", year: "2024" },
  { title: "You Won't Help Me", year: "2023 - 2024" },
  { title: "Datura Daydream", year: "2022" },
  { title: "The Morning After", year: "2022" },
  { title: "Rise Like Water", year: "2021" },
  { title: "Fragile", year: "2021" },
];

export const cvOtherExperience: CVOtherExp[] = [
  {
    role: "Production Assistant",
    title: "This Person Does Not Exist",
    year: "2022",
    description: "Short film production.",
  },
  {
    role: "Documentary Film Maker",
    title: "Il sole in cantina",
    year: "2019",
    description:
      "Production of a short documentary about music and history. Production of a series of interviews.",
  },
  {
    role: "Film Festival Organiser",
    title: "Some Prefer Cake and Genderbender",
    year: "2014 - 2020",
    description:
      "Administrative work to put the festival together, from getting more volunteers to helping choose the films to be screened.",
  },
  {
    role: "Film Tutor",
    title: "Mediateca di San Lazzaro",
    year: "2019",
    description: "Tutor younger people in making a short video.",
  },
  {
    role: "Events Organiser",
    title: "Cassero LGBT Center",
    year: "2015 - 2020",
    description:
      "Coordinated a team to organise events and awareness campaigns. Did a lot of team-building.",
  },
  {
    role: "Internship TV",
    title: "Twofour54",
    year: "2018",
    description:
      "Internship in television where I rehearsed every role in a live news programme.",
  },
  {
    role: "Documentary Film Maker",
    title: "Younet",
    year: "2017 - 2018",
    description:
      "Cultural exchange in Germany to make a documentary about young jugglers. Interviewer.",
  },
  {
    role: "Director",
    title: "Salaborsa, Cineteca di Bologna",
    year: "2014 - 2015",
    description: "Production of a short film for the municipal library.",
  },
];
