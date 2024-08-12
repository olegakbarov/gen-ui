"use client";

import Output from "@/components/output";
import { Button } from "@/components/ui/button";
import { StreamableSchemaFragment } from "@/components/streamable-schema-fragment";
import { TimelineItem, TimelineSchema } from "@/components/timeline-item";
import { useZodStream } from "@/hooks/useZodStream";

// FIXME
const schema = TimelineSchema;

export default function Main() {
  const { result, submitMessage } = useZodStream();

  return (
    <>
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl border border-gray-500/2 p-4 lg:col-span-1">
        Zod Schema streaming
      </div>
      <Output>
        <Button onClick={submitMessage}>Start</Button>

        <div className="mt-5">
          <StreamableSchemaFragment<
            (typeof TimelineSchema)["shape"],
            "timeline"
          >
            schema={schema}
            schemaKey="timeline"
            data={result}
          >
            {(item, metadata) => {
              // this type is correct, fix StreamableSchemaFragment
              return <TimelineItem {...item} {...metadata} />;
            }}
          </StreamableSchemaFragment>
        </div>
      </Output>
    </>
  );
}
