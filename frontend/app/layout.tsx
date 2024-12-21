import { poppins, roboto } from "@/app/font";
import '@/app/global.scss';
import LoadingSpinnerPage from '@/components/common/loading/LoadingSpinnerPage';
import CookieForm from "@/components/common/others/CookieForm";
import { ScrollToAnchor } from '@/components/scrollToAnchor';
import Header from '@/components/structure/header/Header';
import { Suspense } from "react";
// import Providers from '@/components/Providers';

export const metadata = {
  title: "Peridot",
  description: "Dividing Art, Multiplying Returns",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body>
        {/* <Providers> */}
          <ScrollToAnchor />
          <Header/>
          <main>
            <Suspense fallback={<LoadingSpinnerPage />}>
              {children}
            </Suspense>
          </main>
          <span>cookie</span>
          <CookieForm />
          <span>cookie</span>
          {/* 
        </Providers> */}
      </body>
    </html>
  );
}

