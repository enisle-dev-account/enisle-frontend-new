"use client";

import { useState, useEffect } from "react";
import { useApiQuery, useCustomUrlApiMutation } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  EditingTest,
  HospitalLabTest,
  HospitalPricing,
} from "@/types/hospital-configuations.type";
import ServicePricingTab from "./components/service-pricing-tab";
import LabTestsTab from "./components/lab-tests-tab";
import LabTestManagerTab from "./components/lab-test-manager-tab";
import { useSuccessModal } from "@/providers/success-modal-provider";

export default function ConfigurationsPage() {
  const [deleteDialogueOpen, setdeleteDialogueOpen] = useState(false);
  const { showSuccess } = useSuccessModal();
  const queryClient = useQueryClient();

  // Fetch lab tests
  const { data: labTestsData = [] } = useApiQuery<HospitalLabTest[]>(
    ["hospital", "lab-tests"],
    "/hospital/lab-tests/",
  );

  // Fetch pricing
  const { data: pricingData = [] } = useApiQuery<HospitalPricing[]>(
    ["hospital", "pricing"],
    "/hospital/pricing/",
  );

  // Lab test mutations
  const addLabTestMutation = useCustomUrlApiMutation<{
    test_name: string;
  }>("POST", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "lab-tests"] });
      showSuccess("Lab Test Added successfully!");
    },
  });

  const updateLabTestMutation = useCustomUrlApiMutation("PATCH", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "lab-tests"] });
      showSuccess("Lab Test Updated successfully!");
    },
  });

  const deleteLabTestMutation = useCustomUrlApiMutation("DELETE", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "lab-tests"] });
      showSuccess("Lab Test Deleted successfully!");
      setdeleteDialogueOpen(false);
    },
  });

  // Pricing mutations
  const addPricingMutation = useCustomUrlApiMutation<Partial<HospitalPricing>>(
    "POST",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["hospital", "pricing"] });
        showSuccess("Service Pricing Added successfully!");
      },
    },
  );

  const updatePricingMutation = useCustomUrlApiMutation<
    Partial<HospitalPricing>
  >("PATCH", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "pricing"] });
      showSuccess("Service Pricing Updated successfully!");
    },
  });

  const deletePricingMutation = useCustomUrlApiMutation("DELETE", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital", "pricing"] });
      showSuccess("Service Pricing Deleted successfully!");
      setdeleteDialogueOpen(false);
    },
  });

  const handleAddLabTest = async (testName: string) => {
    if (!testName.trim()) return;

    await addLabTestMutation.mutateAsync({
      url: "/hospital/lab-tests/",
      method: "POST",
      data: { test_name: testName },
    });
  };

  const handleDeleteLabTest = async (id: number) => {
    await deleteLabTestMutation.mutateAsync({
      url: `/hospital/lab-tests/${id}/`,
      method: "DELETE",
    });
  };

  const handleAddPricing = async (pricing: Partial<HospitalPricing>) => {
    await addPricingMutation.mutateAsync({
      url: "/hospital/pricing/",
      method: "POST",
      data: pricing,
    });
  };

  const handleUpdatePricing = async (
    id: number,
    data: Partial<HospitalPricing>,
  ) => {
    await updatePricingMutation.mutateAsync({
      url: `/hospital/pricing/${id}/`,
      method: "PATCH",
      data,
    });
  };

  const handleDeletePricing = async (id: number) => {
    await deletePricingMutation.mutateAsync({
      url: `/hospital/pricing/${id}/`,
      method: "DELETE",
    });
  };

  const handleUpdateLabTest = async (id: number, data: EditingTest) => {
    await updateLabTestMutation.mutateAsync({
      url: `/hospital/lab-tests/${id}/`,
      method: "PATCH",
      data,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurations</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage hospital pricing, lab tests, and lab test parameters.
        </p>
      </div>

      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pricing">Service Pricing</TabsTrigger>
          <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
          <TabsTrigger value="lab-parameters">Lab Test Parameters</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="mt-6">
          <ServicePricingTab
            pricingData={pricingData}
            onAddPricing={handleAddPricing}
            onUpdatePricing={handleUpdatePricing}
            onDeletePricing={handleDeletePricing}
            isAddingPricing={addPricingMutation.isPending}
            isUpdatingPricing={updatePricingMutation.isPending}
            isDeletingPricing={deletePricingMutation.isPending}
            setdeleteDialogueOpen={setdeleteDialogueOpen}
            deleteDialogueOpen={deleteDialogueOpen}
          />
        </TabsContent>

        <TabsContent value="lab-tests" className="mt-6">
          <LabTestsTab
            labTestsData={labTestsData}
            onAddLabTest={handleAddLabTest}
            onDeleteLabTest={handleDeleteLabTest}
            isAddingLabTest={addLabTestMutation.isPending}
            isDeletingLabTest={deleteLabTestMutation.isPending}
            setdeleteDialogueOpen={setdeleteDialogueOpen}
            deleteDialogueOpen={deleteDialogueOpen}
          />
        </TabsContent>

        <TabsContent value="lab-parameters" className="mt-6">
          <LabTestManagerTab
            handleDeleteLabTest={handleDeleteLabTest}
            isDeleting={deleteLabTestMutation.isPending}
            isUpdating={updateLabTestMutation.isPending}
            handleUpdateLabTest={handleUpdateLabTest}
            labTestsData={labTestsData}
            setdeleteDialogueOpen={setdeleteDialogueOpen}
            deleteDialogueOpen={deleteDialogueOpen}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
