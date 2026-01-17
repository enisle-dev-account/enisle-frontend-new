"use client"

import type { ReceptionConsultationData } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, XCircle, LogIn } from "lucide-react"

interface PatientsTableProps {
  patients: ReceptionConsultationData[]
  activeTab: string | null
}

export function PatientsTable({ patients, activeTab }: PatientsTableProps) {
  const isInQueue = activeTab === "in_queue"
  const isFinishedOrCanceled = activeTab === "finished" || activeTab === "canceled"
  const isAllPatients = activeTab === null

  const getBillingBadge = (billingStatus: string | null) => {
    if (!billingStatus) return <span className="text-muted-foreground">N/A</span>
    const colors: Record<string, string> = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      unpaid: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={`${colors[billingStatus] || "bg-gray-100 text-gray-800"} border-0 capitalize`}>
        {billingStatus}
      </Badge>
    )
  }

  const getVitalsBadge = (vitalTaken: boolean) => {
    return (
      <Badge className={vitalTaken ? "bg-green-100 text-green-800 border-0" : "bg-yellow-100 text-yellow-800 border-0"}>
        {vitalTaken ? "Taken" : "Pending"}
      </Badge>
    )
  }

  const handleAction = (action: string, patientId: string) => {
    console.log(`[v0] ${action} for patient ${patientId}`)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            {isInQueue && <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Queue No</th>}
            {!isAllPatients && <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>}
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Name</th>
            {!isAllPatients && <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Vitals</th>}
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Gender</th>
            {!isAllPatients && (
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Billing Status</th>
            )}
            {isAllPatients && <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Phone</th>}
            {isAllPatients && <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Email</th>}
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-b hover:bg-muted/50 transition-colors">
              {isInQueue && (
                <td className="px-4 py-3 font-mono text-xs font-semibold">{patient.queue_number || "N/A"}</td>
              )}
              {!isAllPatients && (
                <td className="px-4 py-3">
                  <Badge className="bg-blue-100 text-blue-800 border-0 capitalize">{patient.status || "N/A"}</Badge>
                </td>
              )}
              <td className="px-4 py-3 font-medium">
                {patient.first_name} {patient.middle_name || ""} {patient.surname}
              </td>
              {!isAllPatients && <td className="px-4 py-3">{getVitalsBadge(patient.vital_taken)}</td>}
              <td className="px-4 py-3 capitalize">{patient.gender || "N/A"}</td>
              {!isAllPatients && <td className="px-4 py-3">{getBillingBadge(patient.billing_status)}</td>}
              {isAllPatients && <td className="px-4 py-3 text-xs">{patient.phone || "N/A"}</td>}
              {isAllPatients && <td className="px-4 py-3 text-xs truncate">{patient.email || "N/A"}</td>}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {isAllPatients && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 bg-transparent"
                      onClick={() => handleAction("Check In", patient.id)}
                    >
                      <LogIn className="w-4 h-4" />
                      Check In
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 bg-transparent border-primary text-primary"
                    onClick={() => handleAction("View", patient.id)}
                  >
                    View
                  </Button>
                  {isInQueue && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-600 hover:text-red-700 bg-transparent border-red-700"
                      onClick={() => handleAction("Cancel", patient.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
