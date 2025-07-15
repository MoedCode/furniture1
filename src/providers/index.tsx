"use client";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "./react-query";
import { ThemeProvider } from "./theme";

export function Providers(props: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        enableColorScheme={false}
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {props.children}
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
