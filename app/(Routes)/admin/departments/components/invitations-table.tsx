"use client"

import type { InvitationData } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface InvitationsTableProps {
  invitations: InvitationData[]
}

const statusConfig = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  accepted: { label: "Accepted", className: "bg-green-100 text-green-800" },
  expired: { label: "Expired", className: "bg-red-100 text-red-800" },
}

export function InvitationsTable({ invitations }: InvitationsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Email</TableHead>
            <TableHead className="min-w-[120px]">Role</TableHead>
            <TableHead className="min-w-[120px]">Position</TableHead>
            <TableHead className="min-w-[120px]">Specialty</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[130px]">Sent</TableHead>
            <TableHead className="min-w-[130px]">Expires</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => {
            const statusConfig_ = statusConfig[invitation.status as keyof typeof statusConfig]
            return (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">{invitation.email}</TableCell>
                <TableCell className="capitalize">{invitation.role}</TableCell>
                <TableCell>{invitation.position || "-"}</TableCell>
                <TableCell>{invitation.speciality || "-"}</TableCell>
                <TableCell>
                  <Badge className={statusConfig_?.className}>{statusConfig_?.label}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(invitation.expires_at), { addSuffix: true })}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
