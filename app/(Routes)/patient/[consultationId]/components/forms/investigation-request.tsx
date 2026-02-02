"use client";

import { UseFormReturn } from "react-hook-form";
import { Search } from "lucide-react";
import { useState } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvestigationRequestFormValues } from "../../encounter-notes/schemas/encounters.schema";

interface InvestigationRequestFormProps {
  form: UseFormReturn<InvestigationRequestFormValues>;
  labTests: { label: string; value: string }[];
}

export function InvestigationRequestForm({
  form,
  labTests,
}: InvestigationRequestFormProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = labTests.filter((test) =>
    test.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for test types to request"
            className="pl-10 bg-white border-[#E8ECF0]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-57.5 px-4">
        <FormField
          control={form.control}
          name="investigation_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-2"
                >
                  {filteredTests.map((test) => (
                    <div
                      key={test.value}
                      className="flex items-center space-x-3 border-b pb-3 cursor-pointer hover:bg-muted/50 rounded px-2 py-1"
                      onClick={() => field.onChange(test.value)}
                    >
                      <RadioGroupItem
                        value={test.value}
                        id={test.value}
                        className="border-[#A7AEC1]"
                      />
                      <Label
                        htmlFor={test.value}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {test.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ScrollArea>
    </div>
  );
}
