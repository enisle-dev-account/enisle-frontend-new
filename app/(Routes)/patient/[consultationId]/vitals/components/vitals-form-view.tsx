"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCustomUrlApiMutation } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import VitalsPreviewModal from "./preview-modal";
import { useSuccessModal } from "@/providers/success-modal-provider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const optionalNumber = z
  .string()
  .optional()
  .refine((val) => !val || /^-?\d*\.?\d*$/.test(val), {
    message: "Must be a valid number",
  });

const vitalsSchema = z
  .object({
    weight: optionalNumber,
    height: optionalNumber,
    bmi: optionalNumber,
    temperature: optionalNumber,
    temperature_method: z.string().optional(),
    pulse: optionalNumber,
    pulse_rhythm: z.string().optional(),
    systolic_bp: optionalNumber,
    diastolic_bp: optionalNumber,
    patient_position: z.string().optional(),
    cuff_location: z.string().optional(),
    cuff_size: z.string().optional(),
    sp02: optionalNumber,
    fi02: optionalNumber,
    respiration: optionalNumber,
    respiratory_pattern: z.string().optional(),
    other_notes: z.string().optional(),
  })
  .catchall(z.string().optional());

export type VitalsFormData = z.infer<typeof vitalsSchema>;

const PULSE_RHYTHM_OPTIONS = [
  { value: "regular", label: "Regular" },
  { value: "irregular", label: "Irregular" },
  { value: "tachycardia", label: "Tachycardia" },
  { value: "bradycardia", label: "Bradycardia" },
];

const PATIENT_POSITION_OPTIONS = [
  { value: "supine", label: "Supine" },
  { value: "sitting", label: "Sitting" },
  { value: "standing", label: "Standing" },
];

const CUFF_LOCATION_OPTIONS = [
  { value: "left_arm", label: "Left Arm" },
  { value: "right_arm", label: "Right Arm" },
];

const CUFF_SIZE_OPTIONS = [
  { value: "small", label: "Small" },
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
];

const RESPIRATORY_PATTERN_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "tachypnea", label: "Tachypnea" },
  { value: "bradypnea", label: "Bradypnea" },
  { value: "dyspnea", label: "Dyspnea" },
];

interface VitalsFormViewProps {
  consultationId: string;
  onCancel: () => void;
}

export function VitalsFormView({
  consultationId,
  onCancel,
}: VitalsFormViewProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const params = useParams();
  const patientId = params.consultationId as string;
  const [PreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const { showSuccess } = useSuccessModal();
  const [customFields, setCustomFields] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");

  const form = useForm<VitalsFormData>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      weight: "",
      height: "",
      bmi: "",
      temperature: "",
      temperature_method: "",
      pulse: "",
      pulse_rhythm: "",
      systolic_bp: "",
      diastolic_bp: "",
      patient_position: "",
      cuff_location: "",
      cuff_size: "",
      sp02: "",
      fi02: "",
      respiration: "",
      respiratory_pattern: "",
      other_notes: "",
    },
  });

  const addField = (name: string) => {
    if (!name || customFields.includes(name)) return;
    setCustomFields((prev) => [...prev, name]);
    form.setValue(name, ""); // Initialize in form state
    setNewFieldName("");
    setIsModalOpen(false);
  };

  const removeField = (name: string) => {
    setCustomFields((prev) => prev.filter((f) => f !== name));
    form.unregister(name); // Clean up form state
  };

  const handleSelectAdd = (value: string) => {
    if (value === "new_field") {
      setIsModalOpen(true);
    } else if (value === "emergency") {
      addField("Emergency/Immediate Needs");
    }
  };

  const submitVitalsMutation = useCustomUrlApiMutation<{
    consultation: string;
    vital_info: Record<string, any>;
    status: string;
    is_draft: boolean;
  }>("POST", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vitals", consultationId] });
      showSuccess("Vitals added successfully");
      onCancel();
    },
    onError: (error: any) => {
      console.log("[v0] Vitals submission error:", error);
      form.setError("root", {
        message: error?.message || "Failed to save vitals",
      });
    },
  });

  const onSubmit = async (data: VitalsFormData) => {
    // Separate standard vitals from custom fields
    const standardKeys = [
      "weight",
      "height",
      "bmi",
      "temperature",
      "temperature_method",
      "pulse",
      "pulse_rhythm",
      "systolic_bp",
      "diastolic_bp",
      "patient_position",
      "cuff_location",
      "cuff_size",
      "sp02",
      "fi02",
      "respiration",
      "respiratory_pattern",
    ];

    const vital_info: any = {};
    const additional_info: any = {};

    Object.entries(data).forEach(([key, value]) => {
      if (standardKeys.includes(key)) {
        vital_info[key] = value;
      } else if (key !== "other_notes") {
        additional_info[key] = value;
      }
    });

    const payload = {
      consultation: consultationId,
      vital_info: { ...vital_info, ...additional_info },
      status: "completed",
      is_draft: false,
      other_notes: data.other_notes || "",
    };

    await submitVitalsMutation.mutateAsync({
      url: `/nurse/consultations/${consultationId}/vitals/add/`,
      data: payload,
    });
  };

  const userInitials = user
    ? `${user.firstName?.[0]}${user.lastName?.[0]}`.toUpperCase()
    : "U";

  const handlePreviewDialogOpen = () => {
    setPreviewDialogOpen(true);
  };

  const handleSubmitFromPreview = () => {
    // Call the submit function with the current form data
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      {/* Header with user info */}
      <div className="flex justify-between items-center border-b pb-3.75 px-6">
        <div className="flex items-center gap-3 ">
          <Avatar>
            <AvatarImage src={user?.profilePicture || "/placeholder.svg"} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </span>{" "}
              is submitting{" "}
              <span className="text-blue-500 font-semibold">Vitals</span>
            </p>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground">
            {format(new Date(), "MMM dd, yyyy")} | {format(new Date(), "HH:mm")}
          </p>
        </div>
      </div>

      {/* Form Header */}

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-10"
        >
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-lg font-bold">Vitals</h2>
            <div className="flex gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={handlePreviewDialogOpen}
              >
                Compile & Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitVitalsMutation.isPending}
              >
                Cancel
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="rounded-full bg-primary text-white w-fit"
                    variant="outline"
                    type="button"
                  >
                    Add Field
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      className="text-left px-3 py-2 hover:bg-muted rounded"
                      onClick={() => handleSelectAdd("new_field")}
                    >
                      New Field
                    </button>
                    <button
                      type="button"
                      className="text-left px-3 py-2 hover:bg-muted rounded mt-1"
                      onClick={() => handleSelectAdd("emergency")}
                    >
                      Emergency/Immediate Needs
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-18.25">
            {/* Section 1: Weight, Height, BMI */}
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Weight (kg)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Enter patient's weight"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Height (cm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Enter patient's height"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        BMI (kg/m)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Enter patient's BMI"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sections 2 & 3: Temperature and Pulse */}
            <div className="grid grid-cols-2 gap-8">
              {/* Temperature */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-2xl ">Temperature</h3>
                  <p className="text-sm text-muted-foreground">
                    Please fill in patient's temperature details
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Temperature (°C)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="decimal"
                            placeholder="Enter temperature"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="temperature_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Method</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter temperature method"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pulse */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-2xl ">Pulse</h3>
                  <p className="text-sm text-muted-foreground">
                    Please fill in patient's pulse details
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pulse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Pulse (bpm)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="decimal"
                            placeholder="Enter pulse count"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pulse_rhythm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Rhythm</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select rhythm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PULSE_RHYTHM_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Blood Pressure */}
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-2xl ">Blood Pressure</h3>
                <p className="text-sm text-muted-foreground">
                  Please fill in patient's blood pressure details
                </p>
              </div>
              <div className="grid grid-cols-5 gap-4">
                <FormField
                  control={form.control}
                  name="systolic_bp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Systolic BP (mmHg)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Systolic"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="diastolic_bp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Diastolic BP (mmHg)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Diastolic"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="patient_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Position</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PATIENT_POSITION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                  name="cuff_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Cuff Location
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CUFF_LOCATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                  name="cuff_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Cuff Size</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CUFF_SIZE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sections 5 & 6: Oxygenation and Respiration */}
            <div className="grid grid-cols-2 gap-8">
              {/* Oxygenation */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-2xl ">Oxygenation</h3>
                  <p className="text-sm text-muted-foreground">
                    Please fill in patient's oxygenation details
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sp02"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">SpO2</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SpO2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fi02"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">FiO2</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter FiO2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Respiration */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-2xl ">Respiration</h3>
                  <p className="text-sm text-muted-foreground">
                    Please fill in patient's respiration details
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="respiration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Respiration
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="decimal"
                            placeholder="Enter respiration count"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="respiratory_pattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Pattern</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RESPIRATORY_PATTERN_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {customFields.length > 0 && (
              <div className="space-y-8">
                <h3 className="font-semibold text-2xl">Additional Fields</h3>
                <div className="grid grid-cols-2 gap-6">
                  {customFields.map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem className="relative">
                          <div className="flex justify-between items-center">
                            <FormLabel className="font-semibold">
                              {fieldName}
                            </FormLabel>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => removeField(fieldName)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormControl>
                            <Input
                              placeholder={`Enter ${fieldName}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Notes */}
            <div className="space-y-8">
              <h3 className="font-semibold text-2xl ">
                Additional Information
              </h3>
              <FormField
                control={form.control}
                name="other_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Other Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes..."
                        {...field}
                        className="min-h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {form.formState.errors.root && (
            <div className="text-sm text-red-600">
              {form.formState.errors.root.message}
            </div>
          )}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Field</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <FormLabel>Field Name</FormLabel>
                <Input
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g. Blood Sugar"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => addField(newFieldName)}>
                  Add Field
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <VitalsPreviewModal
            open={PreviewDialogOpen}
            onOpenChange={setPreviewDialogOpen}
            vitalsData={form.getValues() as VitalsFormData}
            submitVitalsMutation={submitVitalsMutation}
            handleSubmitFromPreview={handleSubmitFromPreview}
          />
        </form>
      </Form>
    </div>
  );
}
