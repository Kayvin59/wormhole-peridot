'use client'

import { poppins, roboto } from "@/app/font";
import { usePathname } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import './globals.scss';
/* import CookieForm from '@/components/common/others/CookieForm';
import { ConnectionProvider } from '@/components-helper/contexts/ConnectionProvider';
import { WindowWidthProvider } from '@/components-helper/contexts/WindowWidthProvider';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import { scrollToAnchor } from '@/lib/wrapper/html'; */
import LoadingSpinnerPage from '@/components/common/loading/LoadingSpinnerPage';

export const metadata = {
  title: "Peridot",
  description: "Dividing Art, Multiplying Returns",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const scrollDelay = 1500;
  const pathname = usePathname();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToAnchor();
    }, scrollDelay);
  
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body>
        {/* <ConnectionProvider>
          <WindowWidthProvider> */}
            <Header/>
            
            <main>
              <Suspense fallback={<LoadingSpinnerPage />}>
                {children}
              </Suspense>
            </main>

            <CookieForm/>

            <Footer/>
          {/* </WindowWidthProvider>
        </ConnectionProvider> */}
      </body>
    </html>
  );
}

