"use client";

export function Authenticated({ children }: { children: React.ReactNode }) {
  // TODO: check if the user is logged in
  if (localStorage.getItem("token")) {
    return children;
  }

  return null;
}
