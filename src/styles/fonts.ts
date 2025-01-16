import {
  Monoton,
  Montserrat,
  Abel,
  Source_Code_Pro,
  Yesteryear,
} from "next/font/google";

export const monoton = Monoton({
  variable: "--font-monoton",
  weight: "400",
  subsets: ["latin"],
});

// Classic font
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

// Typewriter font
export const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

// Handwriting font
export const yesteryear = Yesteryear({
  variable: "--font-yesteryear",
  weight: "400",
  subsets: ["latin"],
});

// Neon font
export const abel = Abel({
  variable: "--font-abel",
  weight: "400",
  subsets: ["latin"],
});
