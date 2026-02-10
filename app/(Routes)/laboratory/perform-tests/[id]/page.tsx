"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApiQuery } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddTestForm } from "./components/add-test";
import { ShareResultModal } from "./components/share-result";
import { LeaveNoteModal } from "./components/leave-note";
import  {SingleLaboratoryRequestData } from "@/types/laboratory";
import EmptyList from "@/components/empty-list";
import { TestResultsList } from "./components/test-results-list";

export default function TestRequestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  const { data, isLoading, refetch } = useApiQuery<SingleLaboratoryRequestData>(
    ["lab-test-request", testId],
    `/laboratory/request/${testId}/`
  );

  

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <EmptyList 
          title="Request not found"
          description="The test request you're looking for doesn't exist"
        />
      
      </div>
    );
  }

  const testRequest = data;
  const hasresult = testRequest.result && testRequest.result.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Patient Info Card */}
      <div className="bg-background rounded-xl border p-6">
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            {testRequest.patient.profile_picture_location ? (
              <img
                src={testRequest.patient.profile_picture_location}
                alt={`${testRequest.patient.first_name} ${testRequest.patient.surname}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-white">
                {testRequest.patient.first_name.charAt(0)}
                {testRequest.patient.surname.charAt(0)}
              </div>
            )}
          </div>

          {/* Patient Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">
              {testRequest.patient.first_name} {testRequest.patient.surname}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              #{testRequest.patient.id}
            </p>

            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Lab Scientist</p>
                <p className="font-medium">{testRequest.doctor.first_name} {testRequest.doctor.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hospital</p>
                <p className="font-medium">{testRequest.hospital.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gender</p>
                <p className="font-medium capitalize">
                  {testRequest.patient.gender}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next date</p>
                <p className="font-medium">
                  {new Date(testRequest.investigation_request.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="bg-primary hover:bg-primary/90 rounded-full">
                Import Data
              </Button>
              <Button variant="outline" className="rounded-full">
                Test
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-background rounded-xl border overflow-hidden">
        <Tabs defaultValue="add-test" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="add-test"
              className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-8 py-4"
            >
              Add Test
            </TabsTrigger>
            <TabsTrigger
              value="result"
              className="data-[state=active]:border-b-2 data-[state=active]:text-primary font-bold data-[state=active]:border-primary rounded-none border-0 px-8 py-4"
            >
              result ({testRequest.result?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add-test" className="p-6">
            <AddTestForm requestId={testRequest.id} onSuccess={refetch} />
          </TabsContent>

          <TabsContent value="result" className="p-6">
            {!hasresult ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No result added yet</p>
              </div>
            ) : (
              <TestResultsList
                results={testRequest.result || []}
                onShare={() => setShareModalOpen(true)}
                onNote={() => setNoteModalOpen(true)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Buttons */}
      {hasresult && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setNoteModalOpen(true)}
            className="flex-1 rounded-full"
          >
            Leave a Note
          </Button>
          <Button
            onClick={() => setShareModalOpen(true)}
            className="flex-1 rounded-full bg-primary hover:bg-primary/90"
          >
            Share Result
          </Button>
        </div>
      )}

      {/* Modals */}
      <LeaveNoteModal
        open={noteModalOpen}
        onOpenChange={setNoteModalOpen}
        testId={testRequest.id}
        patientName={`${testRequest.patient.first_name} ${testRequest.patient.surname}`}
        onSuccess={refetch}
      />

      <ShareResultModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        testId={testRequest.id}
        patientName={`${testRequest.patient.first_name} ${testRequest.patient.surname}`}
        onSuccess={refetch}
      />
    </div>
  );
}