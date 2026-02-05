"use client";

import { Dispatch, SetStateAction, useState } from "react";
import type { HospitalLabTest } from "@/types/hospital-configuations.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import ConfirmDeleteDialog from "../../hospital-setup/components/confirm-delete-dialog";

interface LabTestsTabProps {
  labTestsData: HospitalLabTest[];
  onAddLabTest: (testName: string) => Promise<void>;
  onDeleteLabTest: (id: number) => Promise<void>;
  isAddingLabTest: boolean;
  isDeletingLabTest: boolean;
  setdeleteDialogueOpen: Dispatch<SetStateAction<boolean>>;
  deleteDialogueOpen: boolean;
}

export default function LabTestsTab({
  labTestsData,
  onAddLabTest,
  onDeleteLabTest,
  isAddingLabTest,
  isDeletingLabTest,
  setdeleteDialogueOpen,
  deleteDialogueOpen,
}: LabTestsTabProps) {
  const [newTestName, setNewTestName] = useState("");
  const [deleteId, setdeleteId] = useState<number | null>(null);

  const handleAddLabTest = async () => {
    if (!newTestName.trim()) return;

    await onAddLabTest(newTestName);
    setNewTestName("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Lab Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Lab test name"
              value={newTestName}
              onChange={(e) => setNewTestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLabTest()}
            />
            <Button
              onClick={handleAddLabTest}
              disabled={isAddingLabTest}
              className="whitespace-nowrap"
            >
              {isAddingLabTest ? "Adding..." : "Add Lab Test"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lab Test Options</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Total Tests: {labTestsData.length}
          </p>
        </CardHeader>
        <CardContent>
          {labTestsData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No lab tests added yet
            </p>
          ) : (
            <div className="space-y-2">
              {labTestsData.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{test.test_name}</h4>
                    {test.parameters && test.parameters.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {test.parameters.length} parameter(s)
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setdeleteId(test.id);
                      setdeleteDialogueOpen(true);
                    }}
                    disabled={isDeletingLabTest}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {deleteId && (
        <ConfirmDeleteDialog
          open={deleteDialogueOpen}
          onOpenChange={setdeleteDialogueOpen}
          title={"Delete Lab Test?"}
          description={"Are you sure you want to delete this Lab Test?"}
          onConfirm={() => {
            onDeleteLabTest(deleteId);
          }}
          isLoading={isDeletingLabTest}
        />
      )}
    </div>
  );
}
