import { Path } from "@/lib/ergo/utils";
import React from "react";
import * as z from "zod";

/**
 *
 * @param target: object we want to extend with fallback functionality
 * @param fallbacks: object with fallback values for each key in target
 * @param isCompleted: boolean flag that indicates that the stream is completed for this target
 * @returns proxy object with fallback values for each key in target
 */

export function createProxyWrapper<T extends object>(
  target: T,
  fallbacks: { [K in keyof T]: React.ReactNode },
  schema: z.ZodObject<any>,
  completedPaths: Path[]
) {
  const handler: ProxyHandler<T> = {
    get(target, prop: string | symbol) {
      // Only handle string props (ignore symbols)
      if (typeof prop !== "string") {
        return Reflect.get(target, prop);
      }
      const descriptor = Object.getOwnPropertyDescriptor(target, prop);
      if (descriptor && !descriptor.configurable && !descriptor.writable) {
        return target[prop as keyof T];
      }

      const isCompleted = completedPaths.some((path) => path[0] === prop);

      // Check if the property is defined in the schema
      if (prop in schema.shape) {
        if (isCompleted && prop in target) {
          const value = target[prop as keyof T];
          if (typeof value === "object" && value !== null) {
            // If it's a nested object, create a new proxy for it
            const nestedSchema = schema.shape[prop] as z.ZodObject<any>;
            return createProxyWrapper(
              value,
              fallbacks[prop as keyof T] as any,
              nestedSchema,
              completedPaths
                .filter((path) => path[0] === prop)
                .map((path) => path.slice(1))
            );
          }
          return value;
        }
      }
      return fallbacks[prop as keyof T];
    },
    getOwnPropertyDescriptor(target, prop) {
      if (typeof prop === "string" && prop in schema.shape) {
        return {
          enumerable: true,
          configurable: true,
          value: this.get!(target, prop, target),
        };
      }
      return undefined;
    },
    ownKeys() {
      return Object.keys(schema.shape);
    },
    has(target, prop) {
      return prop in target || prop in fallbacks;
    },
  };

  return new Proxy(target, handler) as T;
}
