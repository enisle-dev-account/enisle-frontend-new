"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Eye, Edit2, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConfirm } from "@/providers/confirm-box-provider";
import { useSuccessModal } from "@/providers/success-modal-provider";
import { request } from "@/hooks/api";
import  { Encounter } from "@/types";

interface EncountersTableProps {
  encounters: Encounter[];
  onViewEncounter: (id: string) => void;
  onEditEncounter: (id: string) => void;
  onRefetch: () => void;
  currentUserId?: string;
}

export function EncountersTable({
  encounters,
  onViewEncounter,
  onEditEncounter,
  onRefetch,
  currentUserId,
}: EncountersTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showSuccess } = useSuccessModal();
  const { confirm } = useConfirm();

  const deleteMutation = useMutation({
    mutationFn: (encounterId: string) =>
      request(`/doctor/encounter/${encounterId}/delete/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      showSuccess("Encounter deleted successfully");
      setDeletingId(null);
      onRefetch();
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      setDeletingId(null);
    },
  });

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete Encounter?",
      message:
        "This action cannot be undone. This will permanently delete the encounter from our servers.",
      variant: "destructive",
    });
    if (confirmed) {
      setDeletingId(id);
      deleteMutation.mutate(id);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const formatComplaints = (complaints: string) => {
    const complaintsArray = complaints.split(",").map((c) => c.trim());
    if (complaintsArray.length <= 2) {
      return complaints;
    }
    return `${complaintsArray.slice(0, 2).join(", ")}... (+${complaintsArray.length - 2} more)`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const isOwnEncounter = (encounter: Encounter) => {
    return currentUserId && encounter.consultation.doctor.id === currentUserId;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow className="text-sm font-medium text-muted-foreground hover:bg-transparent">
            <TableHead>Doctor</TableHead>
            <TableHead>Main Complaints</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {encounters.map((encounter) => (
            <motion.tr
              key={encounter.id}
              variants={rowVariants}
              className="transition-colors hover:bg-muted/50"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={encounter.consultation.doctor.profile_picture || ""}
                      alt={`${encounter.consultation.doctor.first_name} ${encounter.consultation.doctor.last_name}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(
                        encounter.consultation.doctor.first_name,
                        encounter.consultation.doctor.last_name
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      Dr. {encounter.consultation.doctor.first_name}{" "}
                      {encounter.consultation.doctor.last_name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        submitted
                      </span>
                      <span className="text-xs text-[#E58116]">
                        Encounter Notes
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm max-w-xs truncate">
                  {formatComplaints(encounter.main_complaints)}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(encounter.created_at), "MMM dd, yyyy")}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(encounter.created_at), "hh:mm a")}
                </p>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-600 hover:bg-green-50"
                >
                  {encounter.status || "Completed"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 h-8 text-xs font-bold"
                    onClick={() => onViewEncounter(encounter.id)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Button>
                  {isOwnEncounter(encounter) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          {deletingId === encounter.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEncounter(encounter.id);
                          }}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(encounter.id);
                          }}
                          className="text-destructive focus:text-destructive"
                          disabled={deletingId === encounter.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deletingId === encounter.id
                            ? "Deleting..."
                            : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}