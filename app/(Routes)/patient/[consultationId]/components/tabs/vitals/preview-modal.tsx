import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { useParams } from "next/navigation";
import { DetailedConsultationResponsePatient } from "@/types";
import { useApiQuery } from "@/hooks/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { capitalizeNames } from "@/lib/utils";
import { UseMutationResult } from "@tanstack/react-query";
import { VitalsFormData } from "./vitals-form-view";

export default function VitalsPreviewModal({
  open,
  onOpenChange,
  vitalsData,
  submitVitalsMutation,
  handleSubmitFromPreview
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vitalsData: VitalsFormData;
  submitVitalsMutation: UseMutationResult<{
    consultation: string;
    vital_info: Record<string, any>;
    status: string;
    is_draft: boolean;
}, Error, any, unknown>;
handleSubmitFromPreview: () => void;
}) {
  const { consultationId } = useParams();

  const { data: patientData, isLoading } =
    useApiQuery<DetailedConsultationResponsePatient>(
      ["patient", String(consultationId)],
      `/patient/consultation/${consultationId}`,
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-172.5 w-full">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl text-center">
            Vitals Result
          </DialogTitle>
          {patientData && (
            <div className="mt-5.75">
              <div className="p-5">
                <div className="flex justify-between items-center mb-5.25">
                  <div className="flex gap-x-3.75 items-start">
                    {/* avatar name mrn */}
                    <Avatar className="w-15 h-15">
                      <AvatarImage
                        src={
                          // patientData?.profile_picture_location || TODO: uncomment later

                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {`${patientData?.first_name?.[0]}${patientData?.surname?.[0]}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col ">
                      <div className="font-semibold text-lg text-black">
                        {capitalizeNames(
                          patientData.first_name,
                          patientData.middle_name,
                          patientData.surname,
                        )}
                      </div>
                      <div className="text-sm text-[#8D95A5]">
                        {`#${patientData?.mrn}`}
                      </div>
                    </div>
                  </div>
                  <div className=" flex items-center gap-x-6">
                    {/* vitals gender billing status */}
                    <div className="flex flex-col gap-y-2 items-center">
                      <div className="text-[#8D95A5] text-xs">Vitals</div>
                      <div className="text-black font-semibold">-</div>
                    </div>
                    <div className="flex flex-col gap-y-2 items-center">
                      <div className="text-[#8D95A5] text-xs">Gender</div>
                      <div className="text-black font-semibold">
                        {patientData?.gender || "-"}
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-2 items-center">
                      <div className="text-[#8D95A5] text-xs">Billing Status</div>
                      <div className="text-black font-semibold">
                        {patientData?.billing_status || "-"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-y-7.5 pt-6 border-t border-[#F1F1F2]">
                  <div className="flex flex-col gap-y-2 items-start">
                    <div className="text-[#8D95A5] text-xs font-semibold">Weight</div>
                    <div className="text-black font-semibold">
                      {vitalsData?.weight ? `${vitalsData?.weight}kg` : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-center">
                    <div className="text-[#8D95A5] text-xs font-semibold">Height</div>
                    <div className="text-black font-semibold">
                      {vitalsData?.height ? `${vitalsData?.height}cm` : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-end">
                    <div className="text-[#8D95A5] text-xs font-semibold">BMI</div>
                    <div className="text-black font-semibold">{vitalsData?.bmi ? `${vitalsData?.bmi}kg/m²` : "-"}</div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-start">
                    <div className="text-[#8D95A5] text-xs font-semibold">Temperature</div>
                    <div className="text-black font-semibold">
                      {vitalsData?.temperature ? `${vitalsData?.temperature}°C` : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-center">
                    <div className="text-[#8D95A5] text-xs font-semibold">Method</div>
                    <div className="text-black font-semibold">
                      {vitalsData?.temperature_method || "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-end">
                    <div className="text-[#8D95A5] text-xs font-semibold">Pulse</div>
                    <div className="text-black font-semibold">{vitalsData?.pulse ? `${vitalsData?.pulse}bpm` : "-"}</div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-start">
                    <div className="text-[#8D95A5] text-xs font-semibold">Pulse Rhythm</div>
                    <div className="text-black font-semibold">
                      {vitalsData?.pulse_rhythm || "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-center">
                    <div className="text-[#8D95A5] text-xs font-semibold">Systolic BP</div>
                    <div className="text-black font-semibold">
                      {vitalsData?.systolic_bp ? `${vitalsData?.systolic_bp}mmHg` : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-end">
                    <div className="text-[#8D95A5] text-xs font-semibold">Diastolic BP</div>
                    <div className="text-black font-semibold">{vitalsData?.diastolic_bp ? `${vitalsData?.diastolic_bp}mmHg` : "-"}</div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-start">
                    <div className="text-[#8D95A5] text-xs font-semibold">Patient Position</div>
                    <div className="text-black font-semibold">
                      {vitalsData?.patient_position || "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-center">
                    <div className="text-[#8D95A5] text-xs font-semibold">Cuff Location</div>
                    <div className="text-black font-semibold">
                      {vitalsData?.cuff_location || "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-end">
                    <div className="text-[#8D95A5] text-xs font-semibold">Cuff Size</div>
                    <div className="text-black font-semibold">{vitalsData?.cuff_size || "-"}</div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-start">
                    <div className="text-[#8D95A5] text-xs font-semibold">SP02</div>
                    <div className="text-black font-semibold">
                      {vitalsData?.sp02 || "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-center">
                    <div className="text-[#8D95A5] text-xs font-semibold">FI02</div>
                    <div className="text-black font-semibold">
                      {vitalsData?.fi02 || "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 items-end">
                    <div className="text-[#8D95A5] text-xs font-semibold">Respiration Pattern</div>
                    <div className="text-black font-semibold">{vitalsData?.respiratory_pattern || "-"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogHeader>
        <DialogFooter className="flex flex-row items-center sm:justify-center w-ful">
          <Button onClick={handleSubmitFromPreview} type="submit" disabled={submitVitalsMutation.isPending} className=" px-10">{submitVitalsMutation.isPending? 'Adding Vitals...': 'Proceed'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
