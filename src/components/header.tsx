"use client";

import { Bot, Code2, SquareTerminal } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const path = usePathname();

  return (
    <nav className="grid gap-1 p-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-lg ${path === "/" ? "bg-muted" : ""}`}
              aria-label="Gen UI explorations"
            >
              <SquareTerminal className="size-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          Gen UI explorations
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/rsc">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-lg ${path === "/rsc" ? "bg-muted" : ""}`}
              aria-label="Models"
            >
              <Bot className="size-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          Models
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/structured-output">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-lg ${
                path === "/structured-output" ? "bg-muted" : ""
              }`}
              aria-label="API"
            >
              <Code2 className="size-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          API
        </TooltipContent>
      </Tooltip>
    </nav>
  );
};
