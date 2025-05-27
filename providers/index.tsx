import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "next-themes";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light">
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  );
}
