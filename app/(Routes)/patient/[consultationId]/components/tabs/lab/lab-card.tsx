"use client";

import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { LabTest } from "@/types";

interface LabCardProps {
  lab: LabTest;
  currentUserId?: string;
    isConsultationView?: boolean;

}

export function LabCard({ lab, currentUserId }: LabCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="border-b-2 border-b-cyan-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={lab.doctor.profile_picture || ""}
                alt={`${lab.doctor.first_name} ${lab.doctor.last_name}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(lab.doctor.first_name, lab.doctor.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-md">
                  Dr. {lab.doctor.first_name} {lab.doctor.last_name}
                </p>
                <span className="text-sm text-muted-foreground">requested</span>
                <span className="text-sm text-cyan-600">Lab Scientist</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(lab.status)}>{lab.status}</Badge>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="border-r pr-3">
                {format(new Date(lab.created_at), "MMM dd, yyyy")}
              </span>
              <span>{format(new Date(lab.created_at), "hh:mm a")}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Add Field</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Notes</h3>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">
              {lab.investigation_request.request_type}
            </p>
          </div>

          {lab.investigation_request.notes && (
            <div>
              <p className="text-sm">{lab.investigation_request.notes}</p>
            </div>
          )}

          {lab.result && lab.result.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Test Results
              </p>
              <div className="space-y-2">
                {lab.result.map((result, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    {Object.entries(result).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="font-medium capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function LabCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Separator />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}