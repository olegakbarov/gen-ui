"use client";

import { useState } from "react";
import ZodStream from "zod-stream";

import { jsonToZod } from "@/lib/json-to-zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { newSchema, newText } from "@/prompts";
import { validIndexesFromSchema } from "@/lib/valid-indexes";

const Main = () => {
  const [prompt] = useState("go");

  const [result, setResult] = useState({});
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

  const timeline = result?.timeline || [];
  const validIndexes = validIndexesFromSchema(result);

  console.log(validIndexes);

  return (
    <div className="container">
      <div className="flex items-start w-full">
        <div className="w-full h-full flex-1 min-h-[400px]">
          <h3 className="text-lg font-bold">Raw text</h3>
          <Textarea
            className="w-full h-full flex-1 min-h-[400px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="w-full h-full flex-1 min-h-[400px]">
          <h3 className="text-lg font-bold">Schema</h3>
          <Textarea
            className="w-full h-full flex-1 min-h-[400px]"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
          />
        </div>
        <div className="w-full h-full flex-1 min-h-[400px]">
          <h3 className="text-lg font-bold">Intermediate representation</h3>
          <Textarea
            className="w-full h-full flex-1 min-h-[400px]"
            value={JSON.stringify(result)}
            readOnly
          />
        </div>
      </div>
      <div className="flex-1 min-h-[200px]">
        <h3 className="text-lg font-bold">Components</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            {(result?.venue || result?.venue) && (
              <Card key="venue">
                <CardHeader>
                  <CardTitle>Venue & Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{result?.venue}</p>
                  <p>{result?.date}</p>
                </CardContent>
              </Card>
            )}
          </div>
          <div>
            {timeline.map((user, i) =>
              validIndexes.has(i) ? (
                <Card key={user.actor}>
                  <CardHeader>
                    <CardTitle>{user.actor}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{user.eventName}</p>
                  </CardContent>
                </Card>
              ) : null
            )}
          </div>
        </div>
      </div>
      <div></div>
      <footer className="fixed bottom-0 left-0 w-full p-6 flex items-center justify-center gap-4">
        <Button onClick={submitMessage}>
          {loading ? (
            <div className="flex items-center gap-2">Loading...</div>
          ) : (
            "start stream"
          )}
        </Button>
      </footer>
    </div>
  );
};

export default Main;
