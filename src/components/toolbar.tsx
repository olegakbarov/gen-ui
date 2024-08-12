"use client";

import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalState } from "@/providers/global-state";
import { AllSchemasMapping } from "@/schemas";

const availableSchemas = ["TimelineSchema"];

export const Toolbar = () => {
  const {
    state: { schemaName, text },
    dispatch,
  } = useGlobalState();

  return (
    <div className="flex flex-col lg:col-span-1">
      <div className="relative hidden md:flex flex-col flex-grow">
        <div className="grid grid-rows-[auto_1fr_1fr] gap-4 h-full">
          <div className="grid gap-3">
            <Label htmlFor="schemaName">Schema name</Label>
            <Select>
              <SelectTrigger
                id="schemaName"
                className="items-start [&_[data-description]]:hidden"
              >
                <SelectValue placeholder="Select a schema" />
              </SelectTrigger>
              <SelectContent>
                {availableSchemas.map((schemaItem) => (
                  <SelectItem key={schemaItem} value={schemaItem}>
                    <span className="font-medium text-foreground">
                      {schemaItem}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-2">Schema</h3>
            <Textarea
              className="w-full flex-grow resize-none"
              value={JSON.stringify(
                AllSchemasMapping[schemaName].shape,
                null,
                2
              )}
              readOnly
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-2">
              Text to be used to extract data according to schema
            </h3>
            <Textarea
              className="w-full flex-grow resize-none"
              value={text}
              onChange={(e) =>
                dispatch({ type: "SET_TEXT_DATA", payload: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
