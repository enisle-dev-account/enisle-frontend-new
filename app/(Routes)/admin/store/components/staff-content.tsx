import { Pagination } from "@/components/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/api";
import { Search } from "lucide-react";
import { useState } from "react";
import StaffTable from "./staff-table";
import { DepartmentEmployeeResponseData } from "@/types";
import StaffGrid from "./staff-grid";

export default function StaffsContent({
  viewMode,
}: {
  viewMode: "list" | "grid";
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>("on_duty");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const queryParams = new URLSearchParams();
  if (searchQuery.trim()) {
    queryParams.append("name", searchQuery);
  }
  queryParams.append("page", currentPage.toString());
  queryParams.append("page_size", pageSize.toString());

  const url = `/admin/list-employees/?user_type=store&${queryParams.toString()}`;
  const { data, isLoading, error, refetch } =
    useApiQuery<DepartmentEmployeeResponseData>(
      ["staff-members", searchQuery, currentPage.toString(), sortBy],
      url,
    );

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-background p-6 space-y-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span className="text-blue-600">👥</span>
              Staffs
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-fit  border-0 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on_duty">On Duty | Off Duty</SelectItem>
                <SelectItem value="on_duty_only">On Duty</SelectItem>
                <SelectItem value="off_duty_only">Off Duty</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search table"
                className="pl-10 w-70 bg-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-destructive">Failed to load staff</p>
          </div>
        ) : data?.results && data.results.length > 0 ? (
          <>
            <>
              {viewMode === "list" ? (
                <StaffTable
                  staff={data.results}
                  selectedIds={selectedIds}
                  onSelectIds={setSelectedIds}
                />
              ) : (
                <StaffGrid staff={data.results} />
              )}
            </>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No staff members found</p>
          </div>
        )}
      </div>

      {data && data.count > 0 && (
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
