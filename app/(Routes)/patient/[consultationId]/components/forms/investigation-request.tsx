"use client";

import { UseFormReturn } from "react-hook-form";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvestigationRequestFormValues } from "../tabs/encounter-notes/schemas/encounters.schema";
import { LabTestRequest } from "@/types/laboratory";

interface InvestigationRequestFormProps {
  form: UseFormReturn<InvestigationRequestFormValues>;
  labTests: LabTestRequest[];
}

export function InvestigationRequestForm({
  form,
  labTests,
}: InvestigationRequestFormProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = labTests.filter(
    (test) =>
      test.test_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false,
  );

  const selectedTests = form.watch("investigation_type") || [];

  const toggleTest = (testId: string) => {
    const currentTests = [...selectedTests];
    const index = currentTests.indexOf(testId);

    if (index > -1) {
      currentTests.splice(index, 1);
    } else {
      currentTests.push(testId);
    }

    form.setValue("investigation_type", currentTests);
  };

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

      {/* Selected count indicator */}
      {selectedTests.length > 0 && (
        <div className="px-4">
          <div className="bg-primary/10 text-primary px-3 py-2 rounded-md text-sm font-medium">
            {selectedTests.length} test{selectedTests.length > 1 ? "s" : ""}{" "}
            selected
          </div>
        </div>
      )}

      <ScrollArea className="h-96 px-4">
        <FormField
          control={form.control}
          name="investigation_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <div className="space-y-2">
                  {filteredTests.map((test) => {
                    const testId = test.id.toString();
                    const checkboxId = `investigation-${testId}`;

                    return (
                      <div
                        key={test.id}
                        className="flex items-center space-x-3 border-b rounded px-2"
                      >
                        <Checkbox
                          id={checkboxId}
                          checked={selectedTests.includes(testId)}
                          onCheckedChange={() => toggleTest(testId)}
                          className="border-[#A7AEC1]"
                        />

                        <Label
                          htmlFor={checkboxId}
                          className="text-sm font-normal cursor-pointer flex-1 w-full py-4"
                        >
                          {test.test_name}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ScrollArea>
    </div>
  );
}
