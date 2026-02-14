"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, Droplet, Heart, Activity } from "lucide-react";
import {
  DetailedConsultationResponsePatientEncounterLabs,
} from "@/types/laboratory";
import { LabParameterCard } from "./lab-parameter";
import { LabDetailedView } from "./lab-detail";

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  beaker: Beaker,
  droplet: Droplet,
  heart: Heart,
  activity: Activity,
};

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

interface LabTestCardProps {
  labTest: DetailedConsultationResponsePatientEncounterLabs;
  patientHistory?: DetailedConsultationResponsePatientEncounterLabs[]; // Can be empty array
  showInsights?: boolean;
}

export default function LabTestCard({
  labTest,
  patientHistory = [],
  showInsights = true,
}: LabTestCardProps) {
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);

  const config = labTest.investigation_request?.test_config;
  const IconComponent = config ? ICON_MAP[config.icon] || Beaker : Beaker;
  const themeColor = config ? COLOR_MAP[config.color_theme] || COLOR_MAP.blue : COLOR_MAP.blue;

  // Combine current lab with history for calculations
  const allLabs = [labTest, ...patientHistory];

  if (!config) {
    return (
      <Card className="border-2">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Test configuration not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!selectedParameter ? (
        <motion.div
          key="card-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${themeColor}20` }}
                  >
                    <IconComponent className="h-5 w-5" style={{ color: themeColor }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{config.test_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {labTest.doctor.first_name} {labTest.doctor.last_name} submitted{" "}
                      <Badge variant="secondary" className="ml-1">
                        Lab Result
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{new Date(labTest.test_date).toLocaleDateString()}</span>
                  <span>
                    {new Date(labTest.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {labTest.result.map((result) => {
                const paramConfig = config.parameters.find((p) => p.name === result.parameter_name);
                if (!paramConfig) return null;

                return (
                  <LabParameterCard
                    key={result.parameter_name}
                    parameter={result}
                    config={paramConfig}
                    allLabs={allLabs}
                    testName={labTest.test}
                    themeColor={themeColor}
                    onViewDetails={() => setSelectedParameter(result.parameter_name)}
                  />
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <LabDetailedView
          key="detailed-view"
          labTest={labTest}
          allLabs={allLabs}
          selectedParameterName={selectedParameter}
          onBack={() => setSelectedParameter(null)}
          showInsights={showInsights}
        />
      )}
    </AnimatePresence>
  );
}