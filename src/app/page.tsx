"use client";

import { useState } from "react";
import ZodStream from "zod-stream";

import { jsonToZod } from "@/lib/json-to-zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { newSchema, newText } from "@/prompts";
import { Timeline } from "@/components/timeline";
import { timelineFallbacks, TimelineItem } from "@/components/timeline-item";

const Main = () => {
  const [prompt] = useState("go");
  const [result, setResult] = useState({
    timeline: [],
    _meta: { _activePath: [], _completedPaths: [] },
  });
  const [schema, setSchema] = useState(newSchema);
  const [text, setText] = useState(newText);
  const [loading, setLoading] = useState(false);

  const startStream = async ({ url }: { url: string }) => {
    setLoading(true);

    try {
      const completion = async () => {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            schema,
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
      const zodSchema = jsonToZod(schema);

      if (!zodSchema || zodSchema instanceof Error)
        throw new Error("failed to parse schema");

      const client = new ZodStream({});

      const extractionStream = await client.create({
        completionPromise: completion,
        response_model: { schema: zodSchema, name: "Extractor" },
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
    if (!prompt.length || loading) return;

    try {
      await startStream({
        url: "/api/ai",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container pt-2 h-screen">
      <div className="flex gap-10 h-screen">
        <div className="flex flex-col items-start w-[50%] h-full gap-2">
          <div className="w-full flex-1">
            <h3 className="text-lg font-bold">Schema</h3>
            <Textarea
              className="w-full flex-1 h-[280px]"
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
            />
          </div>
          <div className="w-full flex-1">
            <h3 className="text-lg font-bold">Intermediate representation</h3>
            <Textarea
              className="w-full flex-1 h-[300px]"
              value={JSON.stringify(result)}
              readOnly
            />
          </div>
          <div className="w-full flex-1">
            <h3 className="text-lg font-bold">Raw text</h3>
            <Textarea
              className="w-full h-[270px] flex-1 "
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 min-h-[200px]">
          <div className="">
            <Button className="w-full" onClick={submitMessage}>
              {loading ? (
                <div className="flex items-center gap-2">Loading...</div>
              ) : (
                "Start stream"
              )}
            </Button>
            <div className="mt-5">
              <ol
                className={
                  "relative dark:border-gray-700 border-s border-gray-200"
                }
              >
                <Timeline
                  data={result}
                  timelineKey="timeline"
                  fallbacks={timelineFallbacks}
                >
                  {(item, metadata) => (
                    <TimelineItem
                      key={item.eventTitle}
                      {...item}
                      {...metadata}
                    />
                  )}
                </Timeline>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 w-full p-6 flex items-center justify-center gap-4"></footer>
    </div>
  );
};

export default Main;
