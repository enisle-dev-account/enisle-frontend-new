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
import type { Surgery } from "@/types";
import { getInitials, getStatusColor } from "@/lib/utils";



// Medication Card


// Surgery Card
interface SurgeryCardProps {
  surgery: Surgery;
}

export function SurgeryCard({ surgery }: SurgeryCardProps) {
  return (
    <Card className="border-b-2 border-b-orange-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={surgery.doctor.profile_picture || ""}
                alt={`${surgery.doctor.first_name} ${surgery.doctor.last_name}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(
                  surgery.doctor.first_name,
                  surgery.doctor.last_name
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-md">
                  Dr. {surgery.doctor.first_name} {surgery.doctor.last_name}
                </p>
                <span className="text-sm text-muted-foreground">requested</span>
                <span className="text-sm text-orange-600">Surgery</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(surgery.status)}>
              {surgery.status}
            </Badge>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="border-r pr-3">
                {format(new Date(surgery.created_at), "MMM dd, yyyy")}
              </span>
              <span>{format(new Date(surgery.created_at), "hh:mm a")}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-6">
        <h3 className="font-bold">Surgical Request</h3>
        <Separator />

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">
              Procedure
            </p>
            <p className="text-sm font-medium">{surgery.procedure}</p>
          </div>

          {surgery.description && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Description
              </p>
              <p className="text-sm">{surgery.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {surgery.operative_site && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Operative Site
                </p>
                <p className="text-sm">{surgery.operative_site}</p>
              </div>
            )}

            {surgery.anesthesia_type && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Anesthesia Type
                </p>
                <p className="text-sm">{surgery.anesthesia_type}</p>
              </div>
            )}

            {surgery.cpt_code && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  CPT Code
                </p>
                <p className="text-sm">{surgery.cpt_code}</p>
              </div>
            )}
          </div>

          {surgery.recovery_notes && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Recovery Notes
              </p>
              <p className="text-sm">{surgery.recovery_notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}