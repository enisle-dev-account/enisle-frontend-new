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
import type {  RadiologyStudy } from "@/types";

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    dispensed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};



// Radiology Card
interface RadiologyCardProps {
  radiology: RadiologyStudy;
}

export function RadiologyCard({ radiology }: RadiologyCardProps) {
  return (
    <Card className="border-b-2 border-b-pink-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={radiology.doctor.profile_picture || ""}
                alt={`${radiology.doctor.first_name} ${radiology.doctor.last_name}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(
                  radiology.doctor.first_name,
                  radiology.doctor.last_name
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-md">
                  Dr. {radiology.doctor.first_name} {radiology.doctor.last_name}
                </p>
                <span className="text-sm text-muted-foreground">requested</span>
                <span className="text-sm text-pink-600">Radiologist</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(radiology.status)}>
              {radiology.status}
            </Badge>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="border-r pr-3">
                {format(new Date(radiology.created_at), "MMM dd, yyyy")}
              </span>
              <span>{format(new Date(radiology.created_at), "hh:mm a")}</span>
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
        <h3 className="font-bold">Notes</h3>
        <Separator />

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">
              Study Type
            </p>
            <p className="text-sm font-medium">{radiology.study_type}</p>
          </div>

          {radiology.notes && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Notes
              </p>
              <p className="text-sm">{radiology.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeletons
export function MedicationCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
}

export function SurgeryCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
}

export function RadiologyCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
}