import { TimelineSchema } from "@/components/timeline-item";
import * as z from "zod";

export const AllSchemasMapping = {
  timeline: TimelineSchema,
} as const;

const AvailableSchemas = z.object(AllSchemasMapping);

type Schemas = z.infer<typeof AvailableSchemas>;

// validates schema with given name exists
export const SchemaNameSchema = z.enum(
  Object.keys(AvailableSchemas.shape) as [
    keyof Schemas,
    ...Array<keyof Schemas>
  ]
);

export type AvailableSchemas = z.infer<typeof AvailableSchemas>;
export type SchemaName = keyof AvailableSchemas;
