"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useApiQuery } from "@/hooks/api"
import type { DepartmentEmployeeResponseData } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeTable } from "./components/employee-table"
import { EmployeePagination } from "./components/employee-pagination"
import { Search, Plus, Users } from "lucide-react"

const DEPARTMENTS = [
  { value: "all", label: "All Departments" },
  { value: "Medical", label: "Medical" },
  { value: "Nursing", label: "Nursing" },
  { value: "Pharmacy", label: "Pharmacy" },
  { value: "Laboratory", label: "Laboratory" },
  { value: "Administration", label: "Administration" },
  { value: "IT", label: "IT" },
  { value: "Radiology", label: "Radiology" },
  { value: "Billing and Finance", label: "Billing and Finance" },
]

function DepartmentsContent() {
  const [currentDepartment, setCurrentDepartment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(15)

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleDepartmentChange = (department: string) => {
    setCurrentDepartment(department)
    setCurrentPage(1)
  }

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1

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

        {/* Search and Action Bar */}
        <div className="flex items-center justify-between gap-4 border-b bg-background p-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by last name, middle name or first name"
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>


          <Button className="bg-primary hover:bg-primary/90">
            Add Staff
          </Button>
        </div>

        {/* Total Employees Card */}
        <div className="px-4 py-4 border-b">
          <Card className="p-4 border-0">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div className="flex items-center text-lg gap-x-3">
                <p className=" font-medium text-muted-foreground">Total Employees</p>
                <p className=" font-semibold">{data?.count || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <TabsContent value={currentDepartment} className="m-0 border-0">
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
          </TabsContent>
        </div>

        {/* Pagination */}
        {data && data.count > 0 && (
          <div className="border-t bg-background p-4">
            <EmployeePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </Tabs>
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
