"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import {
  DetailedConsultationResponsePatientEncounterLabs,
  LabParameter,
  ParameterResult,
} from "@/types/laboratory";
import { getParameterHistory, calculateChangePercentage } from "./lab-utils";
import { ParameterSlider } from "./parameter-slider";

interface LabParameterCardProps {
  parameter: ParameterResult;
  config: LabParameter;
  allLabs: DetailedConsultationResponsePatientEncounterLabs[];
  testName: string;
  themeColor: string;
  onViewDetails: () => void;
}

export function LabParameterCard({
  parameter,
  config,
  allLabs,
  testName,
  themeColor,
  onViewDetails,
}: LabParameterCardProps) {
  // Calculate history for change percentage
  const history = getParameterHistory(allLabs, testName, parameter.parameter_name);
  const changePercentage = calculateChangePercentage(history);

  return (
    <div className="group relative border rounded-lg p-4 hover:border-primary/50 transition-all bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{parameter.parameter_name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold">{parameter.value}</span>
            {config.unit && (
              <span className="text-sm text-muted-foreground">{config.unit}</span>
            )}
            {changePercentage !== null && (
              <Badge
                variant={changePercentage >= 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {changePercentage >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(changePercentage)}%
              </Badge>
            )}
          </div>
          {history.length > 1 && (
            <p className="text-xs text-muted-foreground mt-1">SINCE LAST TEST</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewDetails}
          className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Details <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>

      {/* Slider Visualization */}
      <ParameterSlider parameter={parameter} config={config} themeColor={themeColor} />
    </div>
  );
}