import { poppins, roboto } from "@/app/font";
import "./global.scss";

export const metadata = {
  title: "Peridot",
  description: "Dividing Art, Multiplying Returns",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
