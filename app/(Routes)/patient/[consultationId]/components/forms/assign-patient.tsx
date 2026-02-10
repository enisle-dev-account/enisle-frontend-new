"use client";

import { UseFormReturn } from "react-hook-form";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search, UserCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { request } from "@/hooks/api";
import { AssignPatientFormValues } from "../tabs/encounter-notes/schemas/encounters.schema";

interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  is_on_duty: boolean;
  is_on_leave: boolean;
  profile_picture: string | null;
}

interface AssignPatientFormProps {
  form: UseFormReturn<AssignPatientFormValues>;
  allowedDepartments?: string[];
}

const DEPARTMENTS = [
  { name: "Laboratory", userTypes: ["laboratory"] },
  { name: "Imaging Suite", userTypes: ["radiology"] },
  { name: "Speciality Clinic", userTypes: ["doctor"] },
  { name: "Surgical Department", userTypes: ["surgery"] },
  { name: "Pharmacy", userTypes: ["pharmacy"] },
];

export function AssignPatientForm({
  form,
  allowedDepartments,
}: AssignPatientFormProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: allUsers = [],
    isLoading,
    isFetching,
  } = useQuery<UserInfo[]>({
    queryKey: ["users", searchTerm],
    queryFn: () =>
      request(`/admin/list-users/?search=${searchTerm}`, { method: "GET" }),
    staleTime: 2 * 60 * 1000,
  });

  const selectedDoctorId = form.watch("doctor");

  const groupedDepartments = useMemo(() => {
    const baseDepts =
      allowedDepartments && allowedDepartments.length > 0
        ? DEPARTMENTS.filter((dept) =>
            dept.userTypes.some((type) => allowedDepartments.includes(type)),
          )
        : DEPARTMENTS;

    return baseDepts.map((dept) => ({
      ...dept,
      team: allUsers.filter((user) =>
        dept.userTypes.includes(user.user_type?.toLowerCase() || ""),
      ),
    }));
  }, [allUsers, allowedDepartments]);

  const defaultAccordionValue =
    allowedDepartments?.length === 1
      ? DEPARTMENTS.find((dept) =>
          dept.userTypes.some((type) => allowedDepartments.includes(type)),
        )?.name
      : undefined;

  const handleSelectUser = (userId: string, deptName: string) => {
    const newValue = selectedDoctorId === userId ? "" : userId;
    form.setValue("doctor", newValue);
    form.setValue("department", newValue ? deptName : "");
  };

  return (
    <div className="space-y-4">
      <div className="px-4 relative">
        <Search
          className={cn(
            "absolute left-7 top-3 h-4 w-4 text-muted-foreground",
            isFetching && "animate-pulse", // Visual cue that search is working
          )}
        />
        <Input
          placeholder="Search staff by name..."
          className="pl-9 bg-muted/40"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-100 px-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <Accordion defaultValue={defaultAccordionValue}  type="single" collapsible className="w-full space-y-2">
            {groupedDepartments.map((dept) => (
              <AccordionItem
                key={dept.name}
                value={dept.name}
                className="border border-black/5 bg-transparent rounded-lg px-2 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline border-0 border-b border-black/5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{dept.name}</span>
                    <Badge variant="secondary" className="h-5 bg-primary">
                      {dept.team.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 space-y-1">
                  {dept.team.length > 0 ? (
                    dept.team.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user.id, dept.name)}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md transition-all cursor-pointer border border-transparent",
                          selectedDoctorId === user.id
                            ? "bg-primary/10 border-primary/20"
                            : "hover:bg-muted",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src={user.profile_picture || ""} />
                            <AvatarFallback  className="text-[10px] text-primary">
                              {user.first_name[0]}
                              {user.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                            {user.is_on_duty && (
                              <span className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">
                                • On Duty
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedDoctorId === user.id && (
                          <UserCheck className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-xs text-muted-foreground italic">
                        No available staff in this department
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </ScrollArea>
    </div>
  );
}
