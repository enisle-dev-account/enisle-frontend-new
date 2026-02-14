"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trash2,
  Plus,
  X,
  Beaker,
  Droplet,
  Heart,
  Activity,
  ListTree,
  Settings2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ConfirmDeleteDialog from "../../hospital-setup/components/confirm-delete-dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  EditingTest,
  HospitalLabTest,
  Parameter,
} from "@/types/hospital-configuations.type";

interface LabTestManagerTabProps {
  labTestsData: HospitalLabTest[];
  handleUpdateLabTest: (id: number, data: EditingTest) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
  handleDeleteLabTest: (id: number) => Promise<void>;
  setdeleteDialogueOpen: Dispatch<SetStateAction<boolean>>;
  deleteDialogueOpen: boolean;
}

const COLOR_THEMES = [
  { value: "blue", label: "Blue", color: "#3B82F6" },
  { value: "purple", label: "Purple", color: "#A855F7" },
  { value: "green", label: "Green", color: "#10B981" },
  { value: "orange", label: "Orange", color: "#F59E0B" },
  { value: "pink", label: "Pink", color: "#EC4899" },
  { value: "cyan", label: "Cyan", color: "#06B6D4" },
  { value: "red", label: "Red", color: "#EF4444" },
];

const ICONS = [
  { value: "beaker", label: "Beaker", icon: Beaker },
  { value: "droplet", label: "Droplet", icon: Droplet },
  { value: "heart", label: "Heart", icon: Heart },
  { value: "activity", label: "Activity", icon: Activity },
];

const PARAMETER_TYPES = [
  { value: "numeric", label: "Numeric (with range)" },
  { value: "categorical", label: "Categorical (Positive/Negative)" },
  { value: "text", label: "Text (free form)" },
  { value: "ratio", label: "Ratio (e.g., 1:140)" },
];

const TEST_CATEGORIES = [
  "Hematology",
  "Serology",
  "Microbiology",
  "Clinical Chemistry",
  "Immunology",
  "Endocrinology",
  "Other",
];

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
    test_category: "",
    color_theme: "blue",
    icon: "beaker",
    parameters: [
      {
        name: "",
        type: "numeric",
        unit: "",
        min: 0,
        max: 100,
        display_decimals: 1,
      },
    ],
  });

  const filteredTests = labTestsData.filter((test) =>
    test.test_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (test: HospitalLabTest) => {
    setEditingTest({
      id: test.id,
      test_name: test.test_name,
      test_category: test.test_category || "",
      color_theme: test.color_theme || "blue",
      icon: test.icon || "beaker",
      parameters: test.parameters.map((p) => ({
        ...p,
        display_decimals: p.display_decimals ?? 1,
      })),
    });
  };

  const handleCancel = () => {
    setEditingTest({
      id: null,
      test_name: "",
      test_category: "",
      color_theme: "blue",
      icon: "beaker",
      parameters: [
        {
          name: "",
          type: "numeric",
          unit: "",
          min: 0,
          max: 100,
          display_decimals: 1,
        },
      ],
    });
  };

  const handleAddParameter = () => {
    setEditingTest({
      ...editingTest,
      parameters: [
        ...editingTest.parameters,
        {
          name: "",
          type: "numeric",
          unit: "",
          min: 0,
          max: 100,
          display_decimals: 1,
        },
      ],
    });
  };

  const handleParameterChange = (
    index: number,
    updates: Partial<Parameter>,
  ) => {
    const updatedParameters = [...editingTest.parameters];
    updatedParameters[index] = { ...updatedParameters[index], ...updates };
    setEditingTest({ ...editingTest, parameters: updatedParameters });
  };

  const handleParameterTypeChange = (
    index: number,
    type: Parameter["type"],
  ) => {
    const updatedParameters = [...editingTest.parameters];
    const baseParam = { name: updatedParameters[index].name, type };

    if (type === "numeric" || type === "ratio") {
      updatedParameters[index] = {
        ...baseParam,
        unit: "",
        min: 0,
        max: 100,
        display_decimals: 1,
      };
    } else if (type === "categorical") {
      updatedParameters[index] = {
        ...baseParam,
        options: ["Negative", "Positive"],
        normal_values: ["Negative"],
      };
    } else {
      updatedParameters[index] = baseParam;
    }

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

  const addCategoricalOption = (paramIndex: number) => {
    const param = editingTest.parameters[paramIndex];
    const newOptions = [...(param.options || []), ""];
    handleParameterChange(paramIndex, { options: newOptions });
  };

  const updateCategoricalOption = (
    paramIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const param = editingTest.parameters[paramIndex];
    const newOptions = [...(param.options || [])];
    newOptions[optionIndex] = value;
    handleParameterChange(paramIndex, { options: newOptions });
  };

  const removeCategoricalOption = (paramIndex: number, optionIndex: number) => {
    const param = editingTest.parameters[paramIndex];
    const newOptions = (param.options || []).filter(
      (_, i) => i !== optionIndex,
    );
    handleParameterChange(paramIndex, { options: newOptions });
  };

  const toggleNormalValue = (paramIndex: number, value: string) => {
    const param = editingTest.parameters[paramIndex];
    const normalValues = param.normal_values || [];
    const newNormalValues = normalValues.includes(value)
      ? normalValues.filter((v) => v !== value)
      : [...normalValues, value];
    handleParameterChange(paramIndex, { normal_values: newNormalValues });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-300px)] no-scrollbar overflow-y-auto sticky top-0 p-1  ">
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

      <div className="flex self-start  gap-6">
        {/* Test List */}
        <div className="w-70 sticky top-0 h-fit">
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
                  {filteredTests.map((test) => {
                    const colorTheme = COLOR_THEMES.find(
                      (c) => c.value === test.color_theme,
                    );
                    const isActive = editingTest.id === test.id;
                    return (
                      <div
                        key={test.id}
                        className={`group relative p-3 rounded-md border cursor-pointer transition-all ${
                          isActive
                            ? "bg-blue-50 border-blue-400 shadow-sm"
                            : "bg-card hover:bg-muted/50 border-border"
                        }`}
                        onClick={() => handleEdit(test)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{
                                backgroundColor: colorTheme?.color || "#3B82F6",
                              }}
                            />
                            <h4 className="font-semibold text-xs truncate uppercase">
                              {test.test_name}
                            </h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={isDeleting}
                            onClick={(e) => {
                              e.stopPropagation();
                              setdeleteId(test.id);
                              setdeleteDialogueOpen(true);
                              handleCancel();
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-muted-foreground">
                            {test.parameters.length} params
                          </span>
                          {test.test_category && (
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1 h-4 font-normal"
                            >
                              {test.test_category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="flex-1">
          {editingTest.id ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <Card className=" shadow-sm">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-primary" />
                        Configure {editingTest.test_name}
                      </CardTitle>
                      <CardDescription>
                        Define how results are captured and validated.
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isUpdating}
                        className="px-8"
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className=" space-y-8">
                  {/* Basic Config Section */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-muted/20 border border-muted">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Test Display Name
                      </Label>
                      <Input
                        value={editingTest.test_name}
                        onChange={(e) =>
                          setEditingTest({
                            ...editingTest,
                            test_name: e.target.value,
                          })
                        }
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Laboratory Category
                      </Label>
                      <Select
                        value={editingTest.test_category}
                        onValueChange={(v) =>
                          setEditingTest({ ...editingTest, test_category: v })
                        }
                      >
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEST_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Theme Color
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {COLOR_THEMES.map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() =>
                              setEditingTest({
                                ...editingTest,
                                color_theme: t.value,
                              })
                            }
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              editingTest.color_theme === t.value
                                ? "border-primary scale-110 shadow-sm"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: t.color }}
                            title={t.label}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Icon</Label>
                      <Select
                        value={editingTest.icon}
                        onValueChange={(value) =>
                          setEditingTest({ ...editingTest, icon: value })
                        }
                      >
                        <SelectTrigger className="mt-1 w-full bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ICONS.map((icon) => {
                            const IconComponent = icon.icon;
                            return (
                              <SelectItem key={icon.value} value={icon.value}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4" />
                                  {icon.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </section>

                  <Separator />

                  {/* Parameters Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <ListTree className="h-5 w-5" />
                        Result Parameters
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddParameter}
                        className="rounded-full shadow-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Field
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      {editingTest.parameters.map((param, index) => (
                        <div
                          key={index}
                          className="group relative border rounded-xl p-5 bg-card hover:border-primary/30 transition-colors"
                        >
                          <div className="grid grid-cols-2  gap-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                                Parameter Name
                              </Label>
                              <Input
                                placeholder="e.g. Hemoglobin"
                                value={param.name}
                                onChange={(e) =>
                                  handleParameterChange(index, {
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>

                            {/* Type Indicator */}
                            <div className="flex flex-col">
                              <div className="flex flex-col gap-2 min-w-40">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                                  Data Type
                                </Label>
                                <Select
                                  value={param.type}
                                  onValueChange={(v: Parameter["type"]) =>
                                    handleParameterTypeChange(index, v)
                                  }
                                >
                                  <SelectTrigger className="h-9 w-full">
                                    <SelectValue placeholder="Select Parameter Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PARAMETER_TYPES.map((t) => (
                                      <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Name & Dynamic Fields */}
                            </div>
                            {/* Delete Param */}

                            <div className="flex-1 col-span-2 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Conditionally Render Numeric details */}
                                {(param.type === "numeric" ||
                                  param.type === "ratio") && (
                                  <div className="grid grid-cols-4 gap-2">
                                    <div className="space-y-2">
                                      <Label className="text-[10px] uppercase font-bold">
                                        Unit
                                      </Label>
                                      <Input
                                        value={param.unit}
                                        placeholder="g/dL"
                                        onChange={(e) =>
                                          handleParameterChange(index, {
                                            unit: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] uppercase font-bold">
                                        Min
                                      </Label>
                                      <Input
                                        type="number"
                                        value={param.min}
                                        onChange={(e) =>
                                          handleParameterChange(index, {
                                            min: parseFloat(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] uppercase font-bold">
                                        Max
                                      </Label>
                                      <Input
                                        type="number"
                                        value={param.max}
                                        onChange={(e) =>
                                          handleParameterChange(index, {
                                            max: parseFloat(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] uppercase font-bold ">
                                        Dec
                                      </Label>
                                      <Input
                                        type="number"
                                        value={param.display_decimals}
                                        onChange={(e) =>
                                          handleParameterChange(index, {
                                            display_decimals: parseInt(
                                              e.target.value,
                                            ),
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Categorical Logic */}
                              {param.type === "categorical" && (
                                <div className="bg-muted/30 p-3 rounded-lg space-y-3">
                                  <Label className="text-xs font-semibold">
                                    Defined Options & Normal Values <span className="italic text-muted-foreground">(Check Normal Values) </span>
                                  </Label>
                                  <div className="flex flex-wrap gap-2">
                                    {(param.options || []).map((opt, oIdx) => (
                                      <div
                                        key={oIdx}
                                        className="flex items-center bg-background border rounded-md px-2 py-1 gap-2"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={(
                                            param.normal_values || []
                                          ).includes(opt)}
                                          onChange={() =>
                                            toggleNormalValue(index, opt)
                                          }
                                          className="accent-primary"
                                        />
                                        <input
                                          className="text-sm bg-transparent border-none focus:ring-0 w-20"
                                          value={opt}
                                          onChange={(e) =>
                                            updateCategoricalOption(
                                              index,
                                              oIdx,
                                              e.target.value,
                                            )
                                          }
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeCategoricalOption(index, oIdx)
                                          }
                                        >
                                          <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                        </button>
                                      </div>
                                    ))}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        addCategoricalOption(index)
                                      }
                                      className="h-8 border-dashed border-2"
                                    >
                                      <Plus className="h-3 w-3 mr-1" /> Add
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className=" absolute text-red-500 p-1 h-5 w-5 -right-1 -top-9 bg-white rounded-full shadow-md hover:text-destructive self-start mt-6"
                            onClick={() => handleRemoveParameter(index)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          ) : (
            <Card className="border-dashed border-2 bg-muted/10 h-96 flex flex-col items-center justify-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Beaker className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No Test Selected</h3>
              <p className="text-muted-foreground">
                Select a test from the sidebar to begin editing its parameters.
              </p>
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
            handleCancel();
          }}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
