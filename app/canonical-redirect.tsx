"use client";

import { useEffect } from "react";

export default function CanonicalRedirect() {
  useEffect(() => {
    const canonical = process.env.NEXT_PUBLIC_CANONICAL_HOST;
    if (!canonical) return;
    if (typeof window === "undefined") return;
    const here = window.location.hostname;
    if (here === canonical) return;
    // Only redirect off vercel.app throwaway hosts. Don't hijack
    // localhost, custom domains, or any host the user explicitly opened.
    if (!/\.vercel\.app$/.test(here)) return;
    if (here === canonical) return;
    const target =
      "https://" + canonical + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(target);
  }, []);
  return null;
}
