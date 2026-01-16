"use client"

import { usePatientForm } from "../context/form-context"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ConsultationAssignmentFormProps {
  onSubmit: () => void
  isLoading: boolean
}

export default function ConsultationAssignmentForm({ onSubmit, isLoading }: ConsultationAssignmentFormProps) {
  const { form } = usePatientForm()

  const nurses = [
    { id: "nurse1", name: "Mary Johnson" },
    { id: "nurse2", name: "Sarah Williams" },
  ]

  const specialties = [
    { id: "cardiology", name: "Cardiology" },
    { id: "pediatrics", name: "Pediatrics" },
    { id: "neurology", name: "Neurology" },
  ]

  const doctors = [
    { id: "doc1", name: "Dr. James Smith" },
    { id: "doc2", name: "Dr. Emily Brown" },
    { id: "doc3", name: "Dr. Michael Davis" },
  ]

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
                    <SelectTrigger>
                      <SelectValue placeholder="Please select nurse" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {nurses.map((n) => (
                      <SelectItem key={n.id} value={n.id}>
                        {n.name}
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
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctors Specialty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select specialty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specialties.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
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
                    <SelectTrigger>
                      <SelectValue placeholder="Please select doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
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
