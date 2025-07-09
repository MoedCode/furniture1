"use client";

import { useEffect, useState } from "react";

export function Unauthenticated({ children }: { children: React.ReactNode }) {
  const [isUnauthenticated, setIsUnauthenticated] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsUnauthenticated(true);
    }
  }, []);

  if (!isUnauthenticated) {
    return null;
  }

  return children;
}
