"use client";

import React, { Dispatch, SetStateAction } from "react";

import { useState } from "react";
import type {
  EditingTest,
  HospitalLabTest,
} from "@/types/hospital-configuations.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, X } from "lucide-react";
import ConfirmDeleteDialog from "../../hospital-setup/components/confirm-delete-dialog";

interface LabTestManagerTabProps {
  labTestsData: HospitalLabTest[];
  handleUpdateLabTest: (id: number, data: EditingTest) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
  handleDeleteLabTest: (id: number) => Promise<void>;
  setdeleteDialogueOpen: Dispatch<SetStateAction<boolean>>;
  deleteDialogueOpen: boolean;
}

export default function LabTestManagerTab({
  labTestsData,
  handleUpdateLabTest,
  isDeleting,
  isUpdating,
  handleDeleteLabTest,
  setdeleteDialogueOpen,
  deleteDialogueOpen,
}: LabTestManagerTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setdeleteId] = useState<number | null>(null);

  const [editingTest, setEditingTest] = useState<EditingTest>({
    id: null,
    test_name: "",
    parameters: [{ name: "", range: "" }],
  });

  const filteredTests = labTestsData.filter((test) =>
    test.test_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (test: HospitalLabTest) => {
    setEditingTest({
      id: test.id,
      test_name: test.test_name,
      parameters: [...test.parameters],
    });
  };

  const handleCancel = () => {
    setEditingTest({
      id: null,
      test_name: "",
      parameters: [{ name: "", range: "" }],
    });
  };

  const handleAddParameter = () => {
    setEditingTest({
      ...editingTest,
      parameters: [...editingTest.parameters, { name: "", range: "" }],
    });
  };

  const handleParameterChange = (
    index: number,
    field: "name" | "range",
    value: string,
  ) => {
    const updatedParameters = [...editingTest.parameters];
    updatedParameters[index] = { ...updatedParameters[index], [field]: value };
    setEditingTest({ ...editingTest, parameters: updatedParameters });
  };

  const handleRemoveParameter = (index: number) => {
    if (editingTest.parameters.length > 1) {
      const updatedParameters = editingTest.parameters.filter(
        (_, i) => i !== index,
      );
      setEditingTest({ ...editingTest, parameters: updatedParameters });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest.id) return;
    handleUpdateLabTest(editingTest.id, editingTest);
  };

  const handleDelete = (id: number) => {
    handleDeleteLabTest(id);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Lab Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by test name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Tests ({filteredTests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTests.length === 0 ? (
                <p className="text-muted-foreground text-sm">No tests found</p>
              ) : (
                <div className="space-y-2">
                  {filteredTests.map((test) => (
                    <div
                      key={test.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        editingTest.id === test.id
                          ? "bg-blue-50 border-blue-300"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => handleEdit(test)}
                    >
                      <h4 className="font-medium text-sm">{test.test_name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {test.parameters.length} parameters
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          disabled={isDeleting}
                          onClick={() => {
                            setdeleteId(test.id);
                            setdeleteDialogueOpen(true);
                            handleCancel();
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          {editingTest.id ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Edit Test</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Test Name</label>
                    <Input
                      type="text"
                      value={editingTest.test_name}
                      onChange={(e) =>
                        setEditingTest({
                          ...editingTest,
                          test_name: e.target.value,
                        })
                      }
                      placeholder="Test name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-3">
                      Parameters
                    </label>
                    <div className="space-y-2">
                      {editingTest.parameters.map((param, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Parameter name"
                            value={param.name}
                            onChange={(e) =>
                              handleParameterChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            type="text"
                            placeholder="Normal range"
                            value={param.range}
                            onChange={(e) =>
                              handleParameterChange(
                                index,
                                "range",
                                e.target.value,
                              )
                            }
                          />
                          {editingTest.parameters.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveParameter(index)}
                              className="px-2"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddParameter}
                      className="mt-2 gap-2 bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                      Add Parameter
                    </Button>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Test"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground text-center">
                  Select a test to edit its parameters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {deleteId && (
        <ConfirmDeleteDialog
          open={deleteDialogueOpen}
          onOpenChange={setdeleteDialogueOpen}
          title={"Delete Lab Test?"}
          description={"Are you sure you want to delete this Lab Test?"}
          onConfirm={() => {
            handleDelete(deleteId);
            handleCancel()
          }}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
