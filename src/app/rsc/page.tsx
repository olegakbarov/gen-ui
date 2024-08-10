"use client";

import Output from "@/components/output";
import { StreamingContent } from "@/components/streaming-response";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const availableSchemas = ["TimelineSchema"];

export default function RscPage() {
  const [start, setStart] = useState(false);
  return (
    <>
      <div className="relative hidden flex-col items-start gap-8 md:flex">
        <form className="grid w-full items-start gap-6">
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>
            <div className="grid gap-3">
              <Label htmlFor="model">Model</Label>
              <Select>
                <SelectTrigger
                  id="model"
                  className="items-start [&_[data-description]]:hidden"
                >
                  <SelectValue placeholder="Select a schema" />
                </SelectTrigger>
                <SelectContent>
                  {availableSchemas.map((schemaItem) => {
                    return (
                      <SelectItem key={schemaItem} value={schemaItem}>
                        <span className="font-medium text-foreground">
                          {schemaItem}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="temperature">Temperature</Label>
              <Input id="temperature" type="number" placeholder="0.4" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="top-p">Top P</Label>
                <Input id="top-p" type="number" placeholder="0.7" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="top-k">Top K</Label>
                <Input id="top-k" type="number" placeholder="0.0" />
              </div>
            </div>
          </fieldset>
        </form>
      </div>

      <Output>
        <Button onClick={() => setStart(true)}>Start</Button>
        <StreamingContent start={start} />
      </Output>
    </>
  );
}
