import * as z from "zod";
import {
  ArrayItemMetadata,
  getCompletedPathsForItem,
  isPathCompletedOrActive,
  StreamingSchema,
} from "@/lib/stream-utils/utils";
import { createProxyWrapper } from "@/lib/stream-utils";
import { TimelineItemSchema } from "@/components/timeline-item";

interface TokenStreamProps<T extends z.ZodRawShape, K extends keyof T> {
  // streaming data represented as partial schema
  data: StreamingSchema;
  // full schema
  schema: z.ZodObject<T>;
  // schema key that represents the current component
  schemaKey: K;
  //
  children: (
    item: z.infer<z.ZodObject<T>>[K],
    metadata: ArrayItemMetadata
  ) => React.ReactNode;
}

export function StreamableSchemaFragment<
  T extends z.ZodRawShape,
  K extends string
>({ data, schemaKey, children, schema }: TokenStreamProps<T, K>) {
  const _data = data[schemaKey] as z.infer<z.ZodObject<T>>[] | undefined;

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
      TimelineItemSchema,
      completedPaths
    );

    const metadata: ArrayItemMetadata = {
      index,
      isCompleted,
      isActive,
      loadingUntilCompleted: false,
    };

    return children(proxyItem, metadata);
  });

  return <>{comp}</>;
}
