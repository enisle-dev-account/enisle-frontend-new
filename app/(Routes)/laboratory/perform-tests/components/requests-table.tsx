"use client";

import type { LaboratoryRequestData } from "@/types/laboratory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBillingStatusColor } from "@/lib/utils";
import { useMemo } from "react";

interface TestRequestsTableProps {
  data: LaboratoryRequestData[];
  onTestClick: (consultationId: string) => void;
}

export function TestRequestsTable({
  data,
  onTestClick,
}: TestRequestsTableProps) {
  const groupedData = useMemo(() => {
    const groups = new Map<string, LaboratoryRequestData>();
    
    data.forEach((request) => {
      const consultationId = request.consultation?.consultation_id;
      if (consultationId && !groups.has(consultationId)) {
        groups.set(consultationId, request);
      }
    });
    
    return Array.from(groups.values());
  }, [data]);

  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-background">
          <tr className="text-sm font-medium text-muted-foreground border-b">
            <th className="px-6 py-4 text-left">Queue No.</th>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Tests</th>
            <th className="px-6 py-4 text-left">Doctor</th>
            <th className="px-6 py-4 text-left">Billing Status</th>
            <th className="px-6 py-4 text-left">Gender</th>
            <th className="px-6 py-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((request) => {
            const metadata = request.grouping_metadata;
            const hasMultipleTests = metadata && metadata.total_tests > 1;
            
            return (
              <tr
                key={request.consultation?.consultation_id || request.id}
                className="transition-colors hover:bg-muted/50"
              >
                <td className="px-6 py-4">
                  <p className="font-medium">
                    {metadata?.first_queue_number || request.queue_number}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">
                    {request.patient.first_name} {request.patient.surname}
                  </p>
                </td>
                <td className="px-6 py-4">
                  {hasMultipleTests ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {metadata.total_tests} Tests
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground max-w-xs truncate">
                        {metadata.test_names?.join(", ")}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm">
                      {request.investigation_request?.request_type || "N/A"}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-muted-foreground">
                    Dr. {request.doctor.first_name} {request.doctor.last_name}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    className={`${getBillingStatusColor(
                      metadata?.all_billing_status || request.billing_status
                    )} rounded-full px-5 h-7 capitalize`}
                  >
                    {metadata?.all_billing_status || request.billing_status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <p className="capitalize">{request.patient.gender}</p>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant={"outline"}
                    onClick={() => onTestClick(request.consultation?.consultation_id || request.id.toString())}
                    className="bg-white border border-primary text-primary hover:bg-white/90 rounded-full px-6 h-9"
                  >
                    {hasMultipleTests ? "Perform All" : "Test"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}