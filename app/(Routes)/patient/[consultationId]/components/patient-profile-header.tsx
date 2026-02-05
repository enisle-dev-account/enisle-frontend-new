"use client";

import { Button } from "@/components/ui/button";
import { Phone, MapPin, Mail, SquareArrowOutUpRight } from "lucide-react";
import type { DetailedConsultationResponsePatient, UserRole } from "@/types";
import { useRouter } from "next/navigation";
import countryCodes from "@/lib/country-codes";
import { Icon } from "@/components/icon";
import { Separator } from "@/components/ui/separator";
import { capitalizeNames } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

interface PatientProfileHeaderProps {
  patientData: DetailedConsultationResponsePatient;
  userRole: UserRole;
}

export function PatientProfileHeader({
  patientData,
  userRole,
}: PatientProfileHeaderProps) {
  const router = useRouter();
  const mrn = `#${String(patientData.mrn)}`;
  const {user} =useAuth()
  const handleStartVitals = () => {
    console.log("[v0] Start Vitals clicked for patient:", patientData.id);
  };

  const getCountryCode = (code: string) => {
    return (
      countryCodes.find((country) => country.iso2.toLocaleLowerCase() === code)
        ?.label || code
    );
  };

  const showStartVitalsButton =
    userRole === "nurse" || userRole === "doctor" || userRole === "surgery";

  return (
    <div className="bg-background rounded-xl border-b border-border p-6">
      <div className="flex justify-between items-start mb-6">
        {/* Left: Patient Info */}
        <div className="flex gap-4 w-1/2">
          {/* Profile Picture */}
          <div className="relative">
            {patientData.profile_picture_location ? (
              <img
                src={patientData.profile_picture_location || "/placeholder.svg"}
                alt={`${patientData.first_name} ${patientData.surname}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-border overflow-hidden"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-white">
                {patientData.first_name.charAt(0)}
                {patientData.surname.charAt(0)}
              </div>
            )}
          </div>

          {/* Patient Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold">
              {capitalizeNames(
                patientData.first_name,
                patientData.middle_name,
                patientData.surname,
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {patientData.gender} {"  "} {patientData.age} years old
            </p>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {mrn}
            </p>
          </div>
        </div>

        <Separator orientation="vertical" />

        <div className=" flex justify-between  items-center  min-w-1/3">
          {/* Contact Information */}
          <div className="flex flex-col space-y-3">
            <div className="text-[#8D95A5] text-sm">Contacts:</div>
            <div className="flex items-center gap-2">
              <Icon name="call" className="w-5 h-5 fill-none" />
              <div>
                <p className="text-sm font-medium">
                  {getCountryCode(patientData.country_code)} {patientData.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="location" className="w-5 h-5 fill-none" />
              <div>
                <p className="text-sm font-medium">{patientData.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="sms" className="w-5 h-5 fill-none" />
              <div>
                <p className="text-sm font-medium">{patientData.email}</p>
              </div>
            </div>
          </div>

          {/* Right: Start Vitals Button */}

          {
            <Button
              className="bg-[#C4C5C7] hover:bg-[#C4C5C790] text-white rounded-full w-11  h-11 text-sm font-semibold"
            >
              <SquareArrowOutUpRight className="h-5! w-5!" size={20} />
            </Button>
          }

          {showStartVitalsButton && user?.role==="nurse" && (
            <Button
              onClick={() => {
                handleStartVitals();
                const url = new URL(window.location.href);
                url.searchParams.set("new-vitals", "true");
                router.push(`${url.pathname}${url.search}`);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-7.75 py-4.25 h-11 text-sm font-semibold"
            >
              Start Vitals
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
