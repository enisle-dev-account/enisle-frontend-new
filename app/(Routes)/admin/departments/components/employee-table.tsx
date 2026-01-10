"use client"

import type { DepartmentData } from "@/types"
import { Badge } from "@/components/ui/badge"

interface EmployeeTableProps {
  employees: DepartmentData[]
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const getStatusColor = (isOnLeave: boolean) => {
    return isOnLeave ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
  }

  const getStatusText = (isOnLeave: boolean) => {
    return isOnLeave ? "On Leave" : "Available"
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Employee ID</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Position</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Department</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Contact</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Specialty</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Certification</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.id} className="border-b hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs">{String(employee.employee_id).padStart(3, "0")}</td>
              <td className="px-4 py-3 font-medium">
                {employee.first_name} {employee.last_name}
              </td>
              <td className="px-4 py-3">{employee.position}</td>
              <td className="px-4 py-3">{employee.department}</td>
              <td className="px-4 py-3 text-xs truncate">{employee.mobile || employee.email}</td>
              <td className="px-4 py-3">{employee.speciality || "-"}</td>
              <td className="px-4 py-3">{employee.license_number || "-"}</td>
              <td className="px-4 py-3">
                <Badge className={`${getStatusColor(employee.is_on_leave)} border-0`}>
                  {getStatusText(employee.is_on_leave)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
