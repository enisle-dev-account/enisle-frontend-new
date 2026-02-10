"use client";

import { Button } from "@/components/ui/button";
import { Share2, MessageSquare, Download } from "lucide-react";

interface TestResultsListProps {
  results: Record<string, any>[];
  onShare: () => void;
  onNote: () => void;
}

export function TestResultsList({
  results,
  onShare,
  onNote,
}: TestResultsListProps) {
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div key={result.id} className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{result.test_name}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(result.test_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            {result.parameters.map((param:any, idx:string) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-muted-foreground">{param.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{param.value}</span>
                  {param.reference_range && (
                    <span className="text-xs text-muted-foreground">
                      ({param.reference_range})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="rounded-full gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNote}
              className="rounded-full gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Note
            </Button>
            <Button variant="outline" size="sm" className="rounded-full gap-2">
              <Download className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}