"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Activity } from "lucide-react";
import {
  DetailedConsultationResponsePatientEncounterLabs,
} from "@/types/laboratory";
import { getParameterHistory } from "./lab-utils";
import { ParameterSlider } from "./parameter-slider";
import { HistoricalChart } from "./lab-charts";
import InsightsPanel from "./lab-insights";

// Color mapping
const COLOR_MAP: Record<string, string> = {
  blue: "#3B82F6",
  purple: "#A855F7",
  green: "#10B981",
  orange: "#F59E0B",
  pink: "#EC4899",
  cyan: "#06B6D4",
  red: "#EF4444",
};

interface LabDetailedViewProps {
  labTest: DetailedConsultationResponsePatientEncounterLabs;
  allLabs: DetailedConsultationResponsePatientEncounterLabs[];
  selectedParameterName: string;
  onBack: () => void;
  showInsights?: boolean;
}

export function LabDetailedView({
  labTest,
  allLabs,
  selectedParameterName,
  onBack,
  showInsights = true,
}: LabDetailedViewProps) {
  const [activeParameterName, setActiveParameterName] = useState(selectedParameterName);

  const config = labTest.investigation_request.test_config;
  const activeParameter = labTest.result.find((r) => r.parameter_name === activeParameterName);
  const activeConfig = config.parameters.find((p) => p.name === activeParameterName);

  if (!activeParameter || !activeConfig) return null;

  const history = getParameterHistory(allLabs, labTest.test, activeParameterName);
  const themeColor = COLOR_MAP[config.color_theme] || COLOR_MAP.blue;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{config.test_name}</h2>
          <p className="text-sm text-muted-foreground">
            Detailed analysis and historical trends
          </p>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Panel 1: Parameter List */}
        <Card className="col-span-3 overflow-auto max-h-150">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {labTest.result.map((param) => {
              const isActive = param.parameter_name === activeParameterName;
              return (
                <button
                  key={param.parameter_name}
                  onClick={() => setActiveParameterName(param.parameter_name)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted"
                  }`}
                >
                  <p className="font-medium text-xs">{param.parameter_name}</p>
                  <p className="text-sm font-bold mt-1">{param.value}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Panel 2: Main Parameter Details */}
        <Card className="col-span-6 overflow-auto max-h-150">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{activeParameterName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Current Test Result</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {activeParameter.value}
                {activeConfig.unit && (
                  <span className="ml-1 text-sm text-muted-foreground">
                    {activeConfig.unit}
                  </span>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Status */}
            <ParameterSlider
              parameter={activeParameter}
              config={activeConfig}
              themeColor={themeColor}
            />

            <Separator />

            {/* Historical Chart */}
            {history.length > 1 && (
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Patient's Progress
                </h3>
                <HistoricalChart history={history} config={activeConfig} />
              </div>
            )}

            {history.length === 1 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No historical data available</p>
                <p className="text-xs mt-1">This is the first test of this parameter</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel 3: Insights */}
        {showInsights && (
          <InsightsPanel
            parameter={activeParameter}
            config={activeConfig}
            history={history}
            testName={labTest.test}
          />
        )}
        
        {!showInsights && (
          <div className="col-span-3"></div>
        )}
      </div>
    </motion.div>
  );
}