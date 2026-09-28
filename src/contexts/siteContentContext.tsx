"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { defaultContent } from "@/content/defaults";
import { parseSnapshot } from "@/content/validation";
import type { SiteContent } from "@/content/types";

const SiteContentContext = createContext<SiteContent>(defaultContent);

export function SiteContentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_CONTENT_API_URL;
    if (!endpoint) return;
    let disposed = false;
    let pending = false;
    let revision: number | null = null;
    let activeController: AbortController | null = null;

    async function refresh() {
      if (document.hidden || pending || disposed) return;
      pending = true;
      const controller = new AbortController();
      activeController = controller;
      const timeout = window.setTimeout(() => controller.abort(), 10_000);
      try {
        const response = await fetch(endpoint!, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const snapshot = parseSnapshot(await response.json());
        if (!disposed && snapshot.revision !== revision) {
          revision = snapshot.revision;
          setContent(snapshot.content);
        }
      } catch {
        // Keep the last valid content, or the original site while offline.
      } finally {
        window.clearTimeout(timeout);
        pending = false;
      }
    }

    void refresh();
    const interval = window.setInterval(() => void refresh(), 30_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      disposed = true;
      activeController?.abort();
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
