"use client"

import { usePatientForm } from "../context/form-context"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SPECIALTIES } from "@/lib/constants"
import { UsersListResponseItem } from "@/types"

interface ConsultationAssignmentFormProps {
  onSubmit: () => void
  isLoading: boolean
  userListData: UsersListResponseItem[] | undefined
  userListLoading: boolean
}

export default function ConsultationAssignmentForm({ onSubmit, isLoading, userListData, userListLoading }: ConsultationAssignmentFormProps) {
  const { form } = usePatientForm()


  const nurses = userListData?.filter((user: UsersListResponseItem) => user.user_type === "nurse").map((user: UsersListResponseItem) => {
        return ({
            label: `${user.first_name} ${user.last_name} (${user.email})`,
            value: user.id
        })
    });
    const doctors = userListData?.filter((user: UsersListResponseItem) => {
        return form.watch("specialty").trim() ? (
            (user.user_type === "doctor") && (user.speciality.toLowerCase() === form.watch("specialty").toLowerCase())
        ) : user.user_type === "doctor";
    }).map((user: UsersListResponseItem) => ({
            label: `${user.first_name} ${user.last_name} (${user.email})`,
            value: user.id
        })
    );



  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="space-y-8 max-w-5xl"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Assign Patient</h2>
          <p className="text-sm text-muted-foreground">Please assign patient to a doctor/nurse</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FormField
            control={form.control}
            name="nurse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to a Nurse</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Please select nurse" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(!isLoading && nurses) ? (<>
                    {nurses.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.label}
                      </SelectItem>
                    ))}
                    </>): (
                        <div>Loading...</div>
                    )}
                    {(!nurses || nurses?.length === 0) && <div>No nurses available</div>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctors Specialty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Please select specialty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SPECIALTIES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consulting Doctor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Please select doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!isLoading && doctors ? (
                      <>
                        {doctors.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </>
                    ) : (
                      <div>Loading...</div>
                    )}
                    { (!doctors || doctors?.length === 0) && <div>No doctors available</div>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
