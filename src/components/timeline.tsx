import { createProxyWrapper } from "@/lib/ergo";
import { useMemo } from "react";
import * as z from "zod";
import {
  getCompletedPathsForItem,
  isPathCompletedOrActive,
  StreamingSchema,
} from "@/lib/ergo/utils";

export const TimelineItemSchema = z.object({
  eventTitle: z.string().describe("Title of the timeline item"),
  date: z.string().describe("Date of the timeline item"),
  details: z.string().describe("Description of the timeline item"),
});

type TimelineItem = z.infer<typeof TimelineItemSchema>;

interface TimelineProps {
  data: StreamingSchema;
  timelineKey: string;
  fallbacks: { [K in keyof TimelineItem]: React.ReactNode };
  children: (
    item: TimelineItem,
    metadata: TimelineItemMetadata
  ) => React.ReactNode;
}

interface TimelineItemMetadata {
  index: number;
  isCompleted: boolean;
  isActive: boolean;
}

export function Timeline({
  data,
  timelineKey,
  fallbacks,
  children,
}: TimelineProps) {
  const timelineItems = useMemo(() => {
    const timelineData = data[timelineKey] as TimelineItem[] | undefined;

    if (!timelineData || !Array.isArray(timelineData)) {
      console.warn(
        `No array found at key "${timelineKey}" in the provided data.`
      );
      return [];
    }

    return timelineData.map((item, index) => {
      const basePath = [timelineKey, index];

      const isCompleted = Object.keys(TimelineItemSchema.shape).every((key) => {
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

      const metadata: TimelineItemMetadata = {
        index,
        isCompleted,
        isActive,
      };

      return children(proxyItem, metadata);
    });
  }, [data, timelineKey, fallbacks, children]);

  return <>{timelineItems}</>;
}
