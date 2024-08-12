import { Badge } from "@/components/ui/badge";

export default function Output({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl border border-gray-500/2 p-4 lg:col-span-1">
      {children}

      <div className="flex-1" />

      <Badge variant="outline" className="absolute right-3 bottom-3">
        Output
      </Badge>
    </div>
  );
}
