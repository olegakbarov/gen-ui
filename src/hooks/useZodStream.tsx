import { useState } from "react";
import { TimelineSchema } from "@/components/timeline-item";
import ZodStream, { CompletionMeta } from "zod-stream";
import { z } from "zod";
import { useGlobalState } from "@/providers/global-state";
import { AllSchemasMapping } from "@/schemas";

// FIXME
const emptyState = {
  timeline: [],
  _meta: { _activePath: [], _completedPaths: [] },
} as unknown as Partial<z.infer<typeof TimelineSchema>> & {
  _meta: CompletionMeta;
};

export const useZodStream = () => {
  const {
    state: { schemaName },
  } = useGlobalState();
  const [result, setResult] = useState(emptyState);
  const [loading, setLoading] = useState(false);
  const {
    state: { text },
  } = useGlobalState();

  const schema = AllSchemasMapping[schemaName];

  const startStream = async ({ url }: { url: string }) => {
    setLoading(true);

    try {
      const completion = async () => {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            schemaName: schemaName,
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

      if (!schema || schema instanceof Error)
        throw new Error("failed to parse schema");

      const client = new ZodStream({});

      const extractionStream = await client.create({
        completionPromise: completion,
        response_model: { schema: schema, name: "Extractor" },
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

  return {
    result,
    loading,
    submitMessage,
  };
};
