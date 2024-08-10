import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Laugh } from "lucide-react";
import { Button } from "@/components/ui/button";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";

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

          <div className="grid h-screen w-full pl-[55px]">
            <div className="flex flex-col">{children}</div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
