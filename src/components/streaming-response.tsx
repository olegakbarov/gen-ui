"use client";

import { useEffect, useState } from "react";

import { getTimeline } from "./get-timeline-ui";

export function StreamingContent({ start }: { start: boolean }) {
  const [ui, setUI] = useState<any>(null);

  useEffect(() => {
    if (start) {
      getTimeline().then((ui) => {
        setUI(ui);
      });
    }
  }, [start]);

  return <div className="mt-5">{ui}</div>;
}
