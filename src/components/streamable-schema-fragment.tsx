import * as z from "zod";
import {
  getCompletedPathsForItem,
  isPathCompletedOrActive,
  StreamingSchema,
} from "@/lib/ergo/utils";
import { createProxyWrapper } from "@/lib/ergo";

interface TokenStreamProps<T extends StreamingSchema> {
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

export function StreamableSchemaFragment<T extends StreamingSchema>({
  data,
  schemaKey,
  fallbacks,
  children,
  schema,
}: TokenStreamProps<T>) {
  const _data = data[schemaKey] as (typeof schema)[] | undefined;

  console.log({ _data });

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
      schema,
      completedPaths
    );

    // console.log({ proxyItem, isCompleted, isActive });

    const metadata: ArrayItemMetadata = {
      index,
      isCompleted,
      isActive,
    };

    return children(proxyItem, metadata);
  });

  return <>{comp}</>;
}
