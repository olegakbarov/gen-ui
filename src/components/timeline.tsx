import { createProxyWrapper } from "@/lib/ergo";
import { useMemo } from "react";
import * as z from "zod";
import {
  getCompletedPathsForItem,
  isPathCompletedOrActive,
  StreamingSchema,
} from "@/lib/ergo/utils";

interface TokenStreamProps<T extends z.ZodRawShape> {
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

export function TokenStreamArray<T extends z.ZodRawShape>({
  data,
  schemaKey,
  fallbacks,
  children,
  schema,
}: TokenStreamProps<T>) {
  const comp = useMemo(() => {
    const _data = data[schemaKey] as (typeof schema)[] | undefined;

    return (_data ?? []).map((item, index) => {
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
        schema,
        completedPaths
      );

      const metadata: ArrayItemMetadata = {
        index,
        isCompleted,
        isActive,
      };

      return children(proxyItem, metadata);
    });
  }, [data, schemaKey, fallbacks, children]);

  return <>{comp}</>;
}
