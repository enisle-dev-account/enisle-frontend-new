"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { request, useApiQuery } from "@/hooks/api"
import PatientDetailsForm from "./components/patient-details-form"
import ConsultationAssignmentForm from "./components/consultation-assignment-form"
import StepIndicator from "./components/step-indicator"
import { PatientFormProvider, usePatientForm } from "./context/form-context"
import { UsersListResponseItem } from "@/types"
import { PATIENT_CONSULTATION_PRIORITY_CHOICES } from "@/lib/constants"

function PatientRegistrationContent() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const { form } = usePatientForm()


    const {
      data: userListData,
      isLoading: userListLoading,
      error: userListError,
      refetch: refetchUserList,
    } = useApiQuery<UsersListResponseItem[]>(
      ["receptionist", 'users', "doctor,nurse"],
      "/receptionist/users/doctor,nurse",
    )

  const registerPatientMutation = useMutation({
    mutationFn: (data: any) =>
      request("/receptionist/patient/register-and-post/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      router.push("/reception/check-in")
    },
    onError: (error) => {
      console.error("Registration failed:", error)
    },
  })

  const handleStep1Submit = async () => {
    const isValid = await form.trigger([
      "title",
      "gender",
      "first_name",
      "surname",
      "dob",
      "phone",
      "country_code",
      "address",
      "next_of_kin_first_name",
      "next_of_kin_surname",
      "next_of_kin_relationship",
      "next_of_kin_country_code",
      "next_of_kin_phone",
      "next_of_kin_address",
    ])

    if (isValid) {
      setCurrentStep(2)
    }
  }

  const handleStep2Submit = async () => {
    const isValid = await form.trigger(["nurse", "specialty", "doctor"])

    if (isValid) {
      const formData = form.getValues()
      const today = new Date().toISOString().split("T")[0]

      const payload = {
        patient: {
          is_active: true,
          title: formData.title,
          gender: formData.gender,
          first_name: formData.first_name,
          middle_name: formData.middle_name || "",
          surname: formData.surname,
          dob: formData.dob,
          marital_status: formData.marital_status || "",
          occupation: formData.occupation || "",
          religion: formData.religion || "",
          phone: formData.phone,
          country_code: formData.country_code,
          email: formData.email || "",
          address: formData.address,
          date_joined: today,
          next_of_kin_first_name: formData.next_of_kin_first_name,
          next_of_kin_surname: formData.next_of_kin_surname,
          next_of_kin_relationship: formData.next_of_kin_relationship,
          next_of_kin_country_code: formData.next_of_kin_country_code,
          next_of_kin_phone: formData.next_of_kin_phone,
          next_of_kin_address: formData.next_of_kin_address,
          insurance_hmo: formData.insurance_hmo || "",
          policy_holder: formData.policy_holder || "",
          is_admitted: false,
          is_vip: formData.is_vip,
        },
        consultation: {
          is_active: true,
          consultation_date_time: new Date().toISOString(),
          billing_status: "pending",
          status: "in_queue",
          admission_date: new Date().toISOString(),
          is_admitted: true,
          priority: "medium",
          is_payable: true,
          status_history: {},
          doctor: formData.doctor,
          nurse: formData.nurse,
          parent_consultation: "",
        },
      }

      registerPatientMutation.mutate(payload)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to clear the form?")) {
      form.reset()
      setCurrentStep(1)
    }
  }

  return (
    <main className="rounded-t-2xl bg-background overflow-hidden h-full flex flex-col pt-6 px-10">
      <StepIndicator currentStep={currentStep} />

      <div className="flex-1 overflow-y-auto py-8">
        {currentStep === 1 ? (
          <PatientDetailsForm onProceed={handleStep1Submit} />
        ) : (
          <ConsultationAssignmentForm onSubmit={handleStep2Submit} isLoading={registerPatientMutation.isPending} userListData={userListData} userListLoading={userListLoading} />
        )}
      </div>

      {currentStep === 2 && (
        <div className="flex items-center justify-start gap-4 py-6 border-t border-border">
          <Button variant="outline" size="lg" onClick={handleBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" onClick={handleClearForm}>
            Clear Form
          </Button>
          <Button
            size="lg"
            onClick={handleStep2Submit}
            disabled={registerPatientMutation.isPending}
            className="ml-auto"
          >
            {registerPatientMutation.isPending ? "Registering..." : "Register and Post"}
          </Button>
        </div>
      )}
    </main>
  )
}

export default function PatientRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <PatientFormProvider currentStep={currentStep}>
      <PatientRegistrationContent />
    </PatientFormProvider>
  )
}
