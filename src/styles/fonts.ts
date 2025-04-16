import {
  Monoton,
  Montserrat,
  Abel,
  Source_Code_Pro,
  Yesteryear,
} from "next/font/google";

// Sans-serif, Modern
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

// Typewriter, Monospace
export const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

// Handwriting, Script
export const yesteryear = Yesteryear({
  variable: "--font-yesteryear",
  weight: "400",
  subsets: ["latin"],
});

// Neon/Decorative
export const monoton = Monoton({
  variable: "--font-monoton",
  weight: "400",
  subsets: ["latin"],
});

export const abel = Abel({
  variable: "--font-abel",
  weight: "400",
  subsets: ["latin"],
});
