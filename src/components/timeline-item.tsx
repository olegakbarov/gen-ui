import { TimelineItemMetadata } from "@/lib/ergo/utils";
import * as z from "zod";

// SCHEMA AND TYPE
export const TimelineItemSchema = z.object({
  eventTitle: z.string().describe("Title of the timeline item"),
  date: z.string().describe("Date of the timeline item"),
  details: z.string().describe("Description of the timeline item"),
});

type TimelineItemProps = z.infer<typeof TimelineItemSchema>;

export const TimelineSchema = z.object({
  timeline: z.array(TimelineItemSchema).describe("Timeline items"),
});

// COMPONENT
export const TimelineItem = (
  data: TimelineItemProps & TimelineItemMetadata
) => {
  console.log({ data });
  // if (!data.isCompleted) {
  //   return (
  //     <>
  //       {Array.from({ length: 3 }).map((_, index) => (
  //         <div
  //           key={index}
  //           className="h-6 bg-gray-300 rounded w-3/4 mb-4 relative overflow-hidden animate-pulse"
  //         >
  //           <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
  //         </div>
  //       ))}
  //     </>
  //   );
  // }
  return (
    <li className="grid grid-cols-[auto,1fr] gap-x-4 list-none">
      <div className="relative">
        <div className="absolute h-full w-0.5 bg-gray-200 left-1/2 transform -translate-x-1/2"></div>
        <div className="relative flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
          <svg
            className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
      </div>
      <div>
        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {data.eventTitle}
        </h3>
        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
          {data.date}
        </time>
        <div className="text-base font-normal text-gray-500 dark:text-gray-400 pb-4">
          {data.details}
        </div>
      </div>
    </li>
  );
};

// STREAMING FALLBACKS
export const timelineFallbacks = {
  eventTitle: (
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4 relative overflow-hidden animate-pulse">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
    </div>
  ),
  date: (
    <div className="h-2 bg-gray-300 rounded w-1/4 mb-4 relative overflow-hidden animate-pulse">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
    </div>
  ),
  details: (
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4 relative overflow-hidden animate-pulse">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
    </div>
  ),
};
