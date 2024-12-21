'use client'

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ScrollToAnchor() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToAnchor = () => {
      const hash = window.location.hash;
      if (hash !== "" && hash !== "#top") {
        try {
          const anchorElement = document.querySelector(hash);
          if (anchorElement !== null) {
            anchorElement.scrollIntoView({ behavior: "smooth" });
          }
        } catch {}
      }
    };

    const timeoutId = setTimeout(scrollToAnchor, 1500);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}

