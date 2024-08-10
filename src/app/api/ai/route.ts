import OpenAI from "openai";
import { OAIStream, withResponseModel } from "zod-stream";

import { TimelineSchema } from "@/components/timeline-item";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
  organization: process.env["OPENAI_ORG_ID"] ?? undefined,
});

export const runtime = "edge";

interface IRequest {
  messages: OpenAI.ChatCompletionMessageParam[];
  schema?: string;
}

const schemas = {
  timeline: TimelineSchema,
};

export async function POST(request: Request) {
  const { messages, schema } = (await request.json()) as IRequest;

  if (!schema || !schemas[schema]) {
    throw new Error("Schema is required");
  }

  const params = withResponseModel({
    response_model: { schema: schemas[schema], name: "Extract" },
    params: {
      messages,
      model: "gpt-3.5-turbo",
      stream: true,
    },
    mode: "TOOLS",
  });

  const extractionStream = await oai.chat.completions.create(params);

  return new Response(
    OAIStream({
      res: extractionStream,
    })
  );
}
