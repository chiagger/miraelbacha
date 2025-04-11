export const portfolio: PortfolioItem[] = [
  {
    images: [
      "/img/PVC1.jpg",
      "/img/PVC2.jpg",
      "/img/PVC3.jpg",
      "/img/PVC4.jpg",
    ],
    title: "PVC Real Estate",
    directedBy: "Holly Hunter",
    description: "A music video for the song PVC Real Estate by Shelf Lives.",
  },
  {
    images: ["/img/jonah1.jpg", "/img/jonah2.jpg"],
    title: "Datura Daydreams",
    directedBy: "Jonah Garrett-Bannister",
    description:
      "Sam is bored of hookup culture, and while trying to find the balance between superficial appearance and genuine attraction he discovers an escape: an ugly thorned flower where he convinces himself the man of his dreams resides.",
  },
  {
    images: ["/img/3.jpg", "/img/4.jpg"],
    title: "Rise Like Water",
    directedBy: "Jonah Garrett-Bannister",
    description:
      "Lena comes across a group of nomads in London who help her come to terms with her troubled past by connecting her to spirit and balance. By turning her back on the establishment, she ultimately sees her connection to the natural world and learns the need to fight for it.",
  },
  {
    images: ["/img/5.jpg", "/img/6.jpg"],
    title: "Morning After",
    directedBy: "Saoirse D. Byrne",
    description:
      "Three queer friends make their way home from a night out. Throughout the film, they will question their own self-censorship, and the place in which it is coming from – is it out of fear, embarrassment, self-preservation, or a combination of the three? And how can we liberate ourselves from this judgment not only from others but from ourselves, and become comfortable in being unapologetically queer?",
  },
  {
    images: ["/img/7.jpg", "/img/8.jpg"],
    title: "Fragile",
    directedBy: "Laura Esteban",
    description: "A music video for the song Fragile by Noor Mandviwalla.",
  },
];

export interface PortfolioItem {
  images: string[];
  title: string;
  directedBy: string;
  description?: string;
}
