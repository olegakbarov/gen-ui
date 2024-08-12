import { SchemaNameSchema, AllSchemasMapping, SchemaName } from "@/schemas";
import OpenAI from "openai";
import { OAIStream, withResponseModel } from "zod-stream";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
  organization: process.env["OPENAI_ORG_ID"] ?? undefined,
});

export const runtime = "edge";

interface IRequest {
  messages: OpenAI.ChatCompletionMessageParam[];
  schemaName: SchemaName;
}

export async function POST(request: Request) {
  const { messages, schemaName: schemaNameInput } =
    (await request.json()) as IRequest;

  if (!schemaNameInput) throw new Error("Schema is required");

  const schemaName = SchemaNameSchema.safeParse(schemaNameInput);

  if (!schemaName.success) {
    throw new Error("Schema is required");
  }

  const key = schemaName.data;

  const params = withResponseModel({
    response_model: { schema: AllSchemasMapping[key], name: "Extract" },
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
