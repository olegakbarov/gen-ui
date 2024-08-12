"use client";

import { useEffect, useState } from "react";

import { getTimeline } from "./get-timeline-ui";
import { useGlobalState } from "@/providers/global-state";

export function StreamingContent({ start }: { start: boolean }) {
  const [ui, setUI] = useState<any>(null);
  const {
    state: { schemaName, text },
  } = useGlobalState();

  useEffect(() => {
    if (start) {
      getTimeline({
        schemaName: schemaName,
        text,
      }).then((ui) => {
        setUI(ui);
      });
    }
  }, [start, schemaName, text]);

  return <div className="mt-5">{ui}</div>;
}
