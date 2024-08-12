"use client";

import Output from "@/components/output";
import { StreamingContent } from "@/components/streaming-response";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RscPage() {
  const [start, setStart] = useState(false);
  return (
    <>
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl border border-gray-500/2 p-4 lg:col-span-1">
        RSC details
      </div>
      <Output>
        <Button onClick={() => setStart(true)}>Start</Button>
        <StreamingContent start={start} />
      </Output>
    </>
  );
}
