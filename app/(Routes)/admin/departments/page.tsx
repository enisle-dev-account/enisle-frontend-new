"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useApiQuery } from "@/hooks/api"
import type { DepartmentEmployeeResponseData, InvitationResponseData } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeTable } from "./components/employee-table"
import { EmployeePagination } from "./components/employee-pagination"
import { Search, Users } from "lucide-react"
import { InviteStaffModal } from "./components/invite-staff-modal"
import { InvitationsTable } from "./components/invitations-table"

const DEPARTMENTS = [
  { value: "all", label: "All Departments" },
  { value: "medical", label: "Medical" },
  { value: "nursing", label: "Nursing" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "laboratory", label: "Laboratory" },
  { value: "administration", label: "Administration" },
  { value: "it", label: "IT" },
  { value: "radiology", label: "Radiology" },
  { value: "billing_and_finance", label: "Billing and Finance" },
]

function DepartmentsContent() {
  const [currentDepartment, setCurrentDepartment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(15)
  const [viewMode, setViewMode] = useState<"staff" | "invitations">("staff")
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  const queryParams = new URLSearchParams()
  if (currentDepartment !== "all") {
    queryParams.append("department", currentDepartment)
  }
  if (searchQuery.trim()) {
    queryParams.append("name", searchQuery)
  }
  queryParams.append("page", currentPage.toString())
  queryParams.append("page_size", pageSize.toString())

  const url = `/admin/list-employees/?${queryParams.toString()}`
  const { data, isLoading, error } = useApiQuery<DepartmentEmployeeResponseData>(
    ["employees", currentDepartment, searchQuery, currentPage.toString()],
    url,
  )

  const invitationQueryParams = new URLSearchParams()
  if (currentDepartment !== "all") {
    invitationQueryParams.append("role", currentDepartment)
  }
  if (searchQuery.trim()) {
    invitationQueryParams.append("email", searchQuery)
  }
  invitationQueryParams.append("page", currentPage.toString())
  invitationQueryParams.append("page_size", pageSize.toString())

  const invitationUrl = `/admin/list-staff-invites/?${invitationQueryParams.toString()}`
  const {
    data: invitationsData,
    isLoading: invitationsLoading,
    error: invitationsError,
    refetch: refetchInvitations,
  } = useApiQuery<InvitationResponseData>(
    ["invitations", currentDepartment, searchQuery, currentPage.toString()],
    invitationUrl,
    // { enabled: viewMode === "invitations" },
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleDepartmentChange = (department: string) => {
    setCurrentDepartment(department)
    setCurrentPage(1)
  }

  const totalPages =
    viewMode === "staff"
      ? data
        ? Math.ceil(data.count / pageSize)
        : 1
      : invitationsData
        ? Math.ceil(invitationsData.count / pageSize)
        : 1

  return (
    <>
      {/* Tabs */}
      <Tabs value={currentDepartment} onValueChange={handleDepartmentChange} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 mt-2">
          {DEPARTMENTS.map((dept) => (
            <TabsTrigger
              key={dept.value}
              value={dept.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent px-3 py-4"
            >
              {dept.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Staff/Invitations Toggle and Search/Action Bar */}
        <div className="border-b bg-background">
          <div className="flex items-center gap-2 px-4 pt-4 border-b">
            <button
              onClick={() => {
                setViewMode("staff")
                setCurrentPage(1)
              }}
              className={`pb-3 px-2 font-medium text-sm border-b-2 transition-colors ${
                viewMode === "staff"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => {
                setViewMode("invitations")
                setCurrentPage(1)
              }}
              className={`pb-3 px-2 font-medium text-sm border-b-2 transition-colors ${
                viewMode === "invitations"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Invitations
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={
                    viewMode === "staff" ? "Search by last name, middle name or first name" : "Search by email"
                  }
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Invite Staff Button */}
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setInviteModalOpen(true)}>
              Create User
            </Button>
          </div>
        </div>

        {/* Total Employees/Invitations Card */}
        <div className="px-4 py-4 border-b">
          <Card className="p-4 border-0">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div className="flex items-center text-lg gap-x-3">
                <p className="font-medium text-muted-foreground">
                  {viewMode === "staff" ? "Total Employees" : "Total Invitations"}
                </p>
                <p className="font-semibold">{viewMode === "staff" ? data?.count || 0 : invitationsData?.count || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <TabsContent value={currentDepartment} className="m-0 border-0">
            {viewMode === "staff" ? (
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Loading employees...</p>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-destructive">Failed to load employees</p>
                  </div>
                ) : data?.results && data.results.length > 0 ? (
                  <EmployeeTable employees={data.results} />
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">No employees found</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {invitationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Loading invitations...</p>
                  </div>
                ) : invitationsError ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-destructive">Failed to load invitations</p>
                  </div>
                ) : invitationsData?.results && invitationsData.results.length > 0 ? (
                  <InvitationsTable invitations={invitationsData.results} />
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">No invitations found</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </div>

        {/* Pagination */}
        {((viewMode === "staff" && data && data.count > 0) ||
          (viewMode === "invitations" && invitationsData && invitationsData.count > 0)) && (
          <div className="border-t bg-background p-4">
            <EmployeePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </Tabs>

      {/* Invite Staff Modal */}
      <InviteStaffModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        onSuccess={() => refetchInvitations()}
        setViewMode={setViewMode}
      />
    </>
  )
}

export default function DepartmentsPage() {
  return (
    <main className="rounded-t-2xl bg-background overflow-hidden h-full flex flex-col">
      <Suspense fallback={<div className="flex items-center justify-center py-12">Loading...</div>}>
        <DepartmentsContent />
      </Suspense>
    </main>
  )
}
