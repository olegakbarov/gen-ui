"use server";

import { createStreamableUI } from "ai/rsc";
import ZodStream, { OAIStream, withResponseModel } from "zod-stream";
import { newText } from "@/prompts";
import { z } from "zod";
import {
  TimelineItem,
  TimelineItemSchema,
  TimelineSchema,
  timelineFallbacks,
} from "@/components/timeline-item";
import OpenAI from "openai";
import { StreamableSchemaFragment } from "@/components/streamable-schema-fragment";

const schema = z.object({
  timeline: z.array(TimelineItemSchema),
});

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
  organization: process.env["OPENAI_ORG_ID"] ?? undefined,
});

export async function getTimeline() {
  const timelineUI = createStreamableUI();

  timelineUI.update(<div style={{ color: "gray" }}>Loading...</div>);

  const params = withResponseModel({
    response_model: { schema, name: "Extract" },
    params: {
      messages: [
        {
          content: newText,
          role: "user",
        },
      ],
      model: "gpt-3.5-turbo",
      stream: true,
    },
    mode: "TOOLS",
  });

  const extractionStream = await oai.chat.completions.create(params);

  const client = new ZodStream({});

  const extractionStreamClient = await client.create({
    completionPromise: async () => {
      return OAIStream({
        res: extractionStream,
      });
    },
    response_model: { schema, name: "Extractor" },
  });

  const render = async (stream) => {
    for await (const data of stream) {
      timelineUI.update(
        <StreamableSchemaFragment<(typeof TimelineSchema)["shape"]>
          data={data}
          schemaKey="timeline"
          schema={schema}
        >
          {(item, metadata) => {
            return <TimelineItem {...item} {...metadata} />;
          }}
        </StreamableSchemaFragment>
      );
    }
  };

  render(extractionStreamClient);

  // timelineUI.done();

  return timelineUI.value;
}
