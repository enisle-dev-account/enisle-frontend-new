"use client";

import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { request } from "@/hooks/api";
import { AssignPatientFormValues } from "../schemas/encounters.schema";

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
}

const departments = [
  {
    name: "Laboratory",
    userType: ["laboratory"],
  },
  {
    name: "Imaging Suite",
    userType: ["radiology"],
  },
  {
    name: "Speciality Clinic",
    userType: ["radiology", "laboratory", "doctor", "surgery"],
  },
  {
    name: "Surgical Department",
    userType: ["surgery"],
  },
  {
    name: "Physiotherapy",
    userType: ["surgery", "doctor", "laboratory", "radiology"],
  },
  {
    name: "Pharmacy",
    userType: ["pharmacy"],
  },
];

export function AssignPatientForm({ form }: AssignPatientFormProps) {
  const [expandedDepartment, setExpandedDepartment] = useState<string | null>(
    null
  );

  const { data: allUsers, isLoading } = useQuery<UserInfo[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await request("/authentication/users/list/", {
        method: "GET",
      });
      return response;
    },
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const selectedDepartment = form.watch("department");

  useEffect(() => {
    if (selectedDepartment) {
      setExpandedDepartment(selectedDepartment);
    }
  }, [selectedDepartment]);

  const getTeamForDepartment = (userTypes: string[]) => {
    if (!allUsers) return [];
    return allUsers.filter((user) => userTypes.includes(user.user_type));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleDepartmentSelect = (departmentName: string) => {
    form.setValue("department", departmentName);
    form.setValue("doctor", ""); // Reset doctor selection
    setExpandedDepartment(departmentName);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-4 pt-2">
        <p className="text-xs text-muted-foreground">Send Patient to</p>
      </div>

      <ScrollArea className="h-62.5 px-4">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="space-y-2">
                  {departments.map((department) => {
                    const isExpanded =
                      expandedDepartment === department.name;
                    const isSelected = selectedDepartment === department.name;
                    const team = getTeamForDepartment(department.userType);

                    return (
                      <div key={department.name} className="border-b">
                        {/* Department Header */}
                        <div
                          className={cn(
                            "flex items-center gap-2 py-3 cursor-pointer hover:bg-muted/50 rounded transition-colors",
                            isSelected && "bg-[#E3EDFF]"
                          )}
                          onClick={() =>
                            handleDepartmentSelect(department.name)
                          }
                        >
                          <RadioGroup
                            value={field.value}
                            className="flex items-center"
                          >
                            <RadioGroupItem
                              value={department.name}
                              id={department.name}
                              className="border-[#A7AEC1]"
                            />
                          </RadioGroup>
                          <Label
                            htmlFor={department.name}
                            className={cn(
                              "text-sm font-normal cursor-pointer flex-1",
                              isSelected && "text-primary font-medium"
                            )}
                          >
                            {department.name}
                          </Label>
                          {team.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-muted"
                            >
                              {team.length}
                            </Badge>
                          )}
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>

                        {/* Department Team Members */}
                        {isExpanded && (
                          <FormField
                            control={form.control}
                            name="doctor"
                            render={({ field: doctorField }) => (
                              <FormItem className="pl-6 pb-3 space-y-2">
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={doctorField.onChange}
                                    value={doctorField.value}
                                    className="space-y-2"
                                  >
                                    {team.map((member) => (
                                      <div
                                        key={member.id}
                                        className="flex items-center justify-between p-2 bg-[#F3F5F8] rounded hover:bg-[#E3EDFF] transition-colors cursor-pointer"
                                        onClick={() =>
                                          doctorField.onChange(member.id)
                                        }
                                      >
                                        <div className="flex items-center gap-3">
                                          <RadioGroupItem
                                            value={member.id}
                                            id={member.id}
                                            className="border-[#A7AEC1]"
                                          />
                                          <Avatar className="h-8 w-8">
                                            <AvatarImage
                                              src={
                                                member.profile_picture || ""
                                              }
                                              alt={`${member.first_name} ${member.last_name}`}
                                            />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                              {getInitials(
                                                member.first_name,
                                                member.last_name
                                              )}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <Label
                                              htmlFor={member.id}
                                              className="text-sm font-medium cursor-pointer"
                                            >
                                              {member.first_name}{" "}
                                              {member.last_name}
                                            </Label>
                                            {member.is_on_duty &&
                                              !member.is_on_leave && (
                                                <p className="text-xs text-[#00D261]">
                                                  On Duty
                                                </p>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ScrollArea>
    </div>
  );
}