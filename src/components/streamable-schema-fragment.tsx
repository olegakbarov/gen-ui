import * as z from "zod";
import {
  getCompletedPathsForItem,
  isPathCompletedOrActive,
  StreamingSchema,
} from "@/lib/stream-utils/utils";
import { createProxyWrapper } from "@/lib/stream-utils";
import { TimelineItemSchema } from "@/components/timeline-item";

interface TokenStreamProps {
  data: StreamingSchema;
  schemaKey: keyof z.ZodRawShape;
  fallbacks: { [K in keyof T]: React.ReactNode };
  children: (item: T, metadata: T) => React.ReactNode;
  schema: z.ZodObject<T>;
}

interface ArrayItemMetadata {
  index: number;
  isCompleted: boolean;
  isActive: boolean;
}

export function StreamableSchemaFragment({
  data,
  schemaKey,
  fallbacks,
  children,
  schema,
}: TokenStreamProps) {
  const _data = data[schemaKey] as (typeof schema)[] | undefined;

  const comp = (_data ?? []).map((item, index) => {
    const basePath = [schemaKey, index];

    const isCompleted = Object.keys(schema.shape).every((key) => {
      const { isCompleted } = isPathCompletedOrActive(
        [...basePath, key],
        data._meta
      );
      return isCompleted;
    });

    const completedPaths = getCompletedPathsForItem(basePath, data._meta);
    const { isActive } = isPathCompletedOrActive(basePath, data._meta);

    const proxyItem = createProxyWrapper(
      item,
      fallbacks,
      TimelineItemSchema,
      completedPaths
    );

    const metadata: ArrayItemMetadata = {
      index,
      isCompleted,
      isActive,
    };

    return children(proxyItem, metadata);
  });

  return <>{comp}</>;
}
