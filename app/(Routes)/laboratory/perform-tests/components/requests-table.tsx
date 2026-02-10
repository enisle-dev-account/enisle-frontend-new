"use client";

import type { LaboratoryRequestData } from "@/types/laboratory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBillingStatusColor } from "@/lib/utils";

interface TestRequestsTableProps {
  data: LaboratoryRequestData[];
  onTestClick: (testId: number) => void;
}

export function TestRequestsTable({
  data,
  onTestClick,
}: TestRequestsTableProps) {
  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-background">
          <tr className="text-sm font-medium text-muted-foreground border-b">
            <th className="px-6 py-4 text-left">Queue No.</th>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Doctor</th>
            <th className="px-6 py-4 text-left">Billing Status</th>
            <th className="px-6 py-4 text-left">Gender</th>
            <th className="px-6 py-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((request) => (
            <tr
              key={request.id}
              className="border-b transition-colors hover:bg-muted/50"
            >
              <td className="px-6 py-4">
                <p className="font-medium">{request.queue_number}</p>
              </td>
              <td className="px-6 py-4">
                <p className="font-medium">
                  {request.patient.first_name} {request.patient.surname}
                </p>
              </td>
              <td className="px-6 py-4">
                <p className="text-muted-foreground">{request.doctor.first_name} {request.doctor.last_name}</p>
              </td>
              <td className="px-6 py-4">
                <Badge
                  className={`${getBillingStatusColor(request.billing_status)} rounded-full capitalize`}
                >
                  {request.billing_status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <p className="capitalize">{request.patient.gender}</p>
              </td>
              <td className="px-6 py-4">
                <Button
                  onClick={() => onTestClick(request.id)}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 h-9"
                >
                  Test
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}