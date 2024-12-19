import { Poppins, Roboto } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poppins",
  display: "swap",
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto",
  display: "swap",
});
