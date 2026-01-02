"use client";

import { useEffect } from "react";

export function PushNotificationManager() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as unknown as { workbox: unknown }).workbox === undefined
    ) {
      const wb = navigator.serviceWorker;
      wb.register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered: ", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed: ", error);
        });
    }
  }, []);

  return null;
}
