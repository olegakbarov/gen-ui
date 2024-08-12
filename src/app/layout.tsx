import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Laugh } from "lucide-react";
import { Button } from "@/components/ui/button";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";
import { GlobalStateProvider } from "@/providers/global-state";
import { Toolbar } from "@/components/toolbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Gen UI explorations",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <TooltipProvider>
          <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
              <Button variant="outline" size="icon" aria-label="Home">
                <Laugh className="size-5" />
              </Button>
            </div>
            <Header />
            <Navbar />
          </aside>

          <GlobalStateProvider>
            <div className="grid h-screen w-full pl-[55px]">
              <div className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                  <h1 className="text-xl font-semibold">
                    ZOD Schema streaming
                  </h1>
                </header>
                <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-3 ">
                  <Toolbar />
                  {children}
                </main>
              </div>
            </div>
          </GlobalStateProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
