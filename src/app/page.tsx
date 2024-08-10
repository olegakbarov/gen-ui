"use client";

import { newText } from "@/prompts";
import { Textarea } from "@/components/ui/textarea";
import Output from "@/components/output";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StreamableSchemaFragment } from "@/components/streamable-schema-fragment";
import {
  TimelineItem,
  TimelineSchema,
  timelineFallbacks,
} from "@/components/timeline-item";
import ZodStream from "zod-stream";

export default function Main() {
  const [currentSchema, setCurrentSchema] = useState(TimelineSchema);
  const [result, setResult] = useState({
    timeline: [],
    _meta: { _activePath: [], _completedPaths: [] },
  });
  const [text, setText] = useState(newText);
  const [loading, setLoading] = useState(false);

  const startStream = async ({ url }: { url: string }) => {
    setLoading(true);

    try {
      const completion = async () => {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            schema: "timeline",
            messages: [
              {
                content: text,
                role: "user",
              },
            ],
          }),
        });

        if (!response.ok || !response?.body)
          throw new Error("failed to fetch completion");

        return response?.body;
      };

      if (!currentSchema || currentSchema instanceof Error)
        throw new Error("failed to parse schema");

      const client = new ZodStream({});

      const extractionStream = await client.create({
        completionPromise: completion,
        response_model: { schema: currentSchema, name: "Extractor" },
      });

      for await (const data of extractionStream) {
        setResult(data);
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const submitMessage = async () => {
    if (loading) return;

    try {
      await startStream({
        url: "/api/ai",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <h1 className="text-xl font-semibold">ZOD Schema streaming</h1>
      </header>
      <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col">
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <div className="w-full flex-1">
              <h3 className="text-lg font-bold">Schema</h3>
              <Textarea
                className="w-full flex-1 h-[280px]"
                value={JSON.stringify(currentSchema.shape, null, 2)}
                readOnly
              />
            </div>

            <div className="w-full flex-1">
              <h3 className="text-lg font-bold">Raw text</h3>
              <Textarea
                className="w-full h-[270px] flex-1"
                value={newText}
                readOnly
              />
            </div>
          </div>
        </div>

        <Output>
          <Button onClick={submitMessage}>Start</Button>

          <div className="mt-5">
            <StreamableSchemaFragment
              schema={currentSchema}
              schemaKey="timeline"
              data={result}
              fallbacks={timelineFallbacks}
            >
              {(item, metadata) => {
                console.log({ item, metadata });
                return (
                  <TimelineItem key={item.eventTitle} {...item} {...metadata} />
                );
              }}
            </StreamableSchemaFragment>
          </div>
        </Output>
      </main>
    </>
  );
}
