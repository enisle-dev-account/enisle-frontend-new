"use client";

import { Button } from "@/components/ui/button";
import { Share2, MessageSquare, Download, Calendar } from "lucide-react";
import { format } from "date-fns";
import { SingleLaboratoryRequestData } from "@/types/laboratory";

interface TestResultsListProps {
  data: SingleLaboratoryRequestData;
  onShare: () => void;
  onNote: () => void;
}

export function TestResultsList({ data, onShare, onNote }: TestResultsListProps) {
  return (
    <div className="space-y-4">
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {data.investigation_request.request_type}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(data.investigation_request.created_at), "PPP")}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-widest">Request ID</span>
            <span className="font-mono font-medium">#LR-{data.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {data.result.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
                  {item.parameter_name.replace(/_/g, " ")}
                </p>
                <p className="text-lg font-bold text-primary">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="rounded-full gap-2 px-4 border-slate-200"
          >
            <Share2 className="h-4 w-4" />
            Share Result
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNote}
            className="rounded-full gap-2 px-4 border-slate-200"
          >
            <MessageSquare className="h-4 w-4" />
            Add Note
          </Button>
          <Button variant="secondary" size="sm" className="rounded-full gap-2 px-4 ml-auto">
            <Download className="h-4 w-4" />
            Print PDF
          </Button>
        </div>
      </div>
    </div>
  );
}