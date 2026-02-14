"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LabParameter, ParameterResult } from "@/types/laboratory";

interface ParameterSliderProps {
  parameter: ParameterResult;
  config: LabParameter;
  themeColor: string;
}

export function ParameterSlider({ parameter, config, themeColor }: ParameterSliderProps) {
  if (config.type === "numeric" || config.type === "ratio") {
    return <NumericSlider parameter={parameter} config={config} themeColor={themeColor} />;
  } else if (config.type === "categorical") {
    return <CategoricalSlider parameter={parameter} config={config} />;
  }
  return null;
}

// ==================== NUMERIC SLIDER ====================
function NumericSlider({
  parameter,
  config,
  themeColor,
}: {
  parameter: ParameterResult;
  config: LabParameter;
  themeColor: string;
}) {
  const min = config.min || 0;
  const max = config.max || 100;
  
  // Handle ratio values like "1:320"
  let value: number;
  if (config.type === "ratio" && parameter.value.includes(":")) {
    value = parseFloat(parameter.value.split(":")[1]) || 0;
  } else {
    value = parseFloat(parameter.value) || 0;
  }

  // Calculate position percentage
  const position = ((value - min) / (max - min)) * 100;
  const clampedPosition = Math.max(0, Math.min(100, position));

  return (
    <div className="relative mt-4">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>{min}</span>
        <span className="font-medium">
          {min}-{max}
        </span>
        <span>{max}</span>
      </div>

      {/* Slider Track */}
      <div className="relative h-2 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 rounded-full">
        {/* Reference Range Highlight */}
        <div
          className="absolute h-full bg-green-200 opacity-50 rounded-full"
          style={{
            left: "0%",
            right: "0%",
          }}
        />

        {/* Value Marker */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
          style={{
            left: `${clampedPosition}%`,
            backgroundColor: themeColor,
            transform: `translate(-50%, -50%)`,
          }}
        />
      </div>
    </div>
  );
}

// ==================== CATEGORICAL SLIDER ====================
function CategoricalSlider({
  parameter,
  config,
}: {
  parameter: ParameterResult;
  config: LabParameter;
}) {
  const isNormal =
    config.normal_values?.includes(parameter.value) ||
    parameter.value.toLowerCase().includes("negative") ||
    parameter.value.toLowerCase().includes("non");

  const normalCount =
    config.normal_values?.length || 
    config.options?.filter((o) => o.toLowerCase().includes("negative") || o.toLowerCase().includes("non")).length || 
    1;
  const abnormalCount = (config.options?.length || 2) - normalCount;
  const totalCount = normalCount + abnormalCount;

  const normalPercentage = (normalCount / totalCount) * 100;
  const abnormalPercentage = (abnormalCount / totalCount) * 100;

  return (
    <div className="relative mt-4">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-red-500 font-medium">Abnormal</span>
        <span className="text-green-500 font-medium">Normal</span>
      </div>

      {/* Categorical Slider */}
      <div className="relative h-2 rounded-full overflow-hidden flex">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${abnormalPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-red-200"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${normalPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="h-full bg-green-200"
        />

        {/* Value Marker */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
          className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
          style={{
            left: isNormal 
              ? `${abnormalPercentage + normalPercentage / 2}%` 
              : `${abnormalPercentage / 2}%`,
            backgroundColor: isNormal ? "#10B981" : "#EF4444",
            transform: `translate(-50%, -50%)`,
          }}
        />
      </div>

      <div className="flex justify-center mt-2">
        <Badge variant={isNormal ? "default" : "destructive"} className="text-xs">
          {parameter.value}
        </Badge>
      </div>
    </div>
  );
}