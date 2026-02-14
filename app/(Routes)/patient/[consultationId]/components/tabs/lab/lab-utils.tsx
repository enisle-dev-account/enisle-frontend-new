import { DetailedConsultationResponsePatientEncounterLabs, LabParameter, ParameterHistory, ParameterResult, RiskInsight } from "@/types/laboratory";

export function getParameterHistory(
  labs: DetailedConsultationResponsePatientEncounterLabs[],
  testName: string,
  parameterName: string
): ParameterHistory[] {
  return labs
    .filter((lab) => lab.test === testName && lab.test_date)
    .map((lab) => {
      const result = lab.result.find((r) => r.parameter_name === parameterName);
      const config = lab.investigation_request.test_config.parameters.find(
        (p) => p.name === parameterName
      );

      if (!result) return null;

      let status: "normal" | "abnormal" = "normal";
      if (config?.type === "numeric") {
        const value = parseFloat(result.value);
        const min = config.min || 0;
        const max = config.max || 100;
        status = value >= min && value <= max ? "normal" : "abnormal";
      } else if (config?.type === "categorical") {
        status = config.normal_values?.includes(result.value) ? "normal" : "abnormal";
      }

      return {
        date: lab.test_date,
        value: result.value,
        status,
      };
    })
    .filter((h) => h !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as ParameterHistory[];
}

export function calculateChangePercentage(history: ParameterHistory[]): number | null {
  if (history.length < 2) return null;

  const current = history[history.length - 1];
  const previous = history[history.length - 2];

  const currentValue =
    typeof current.value === "number" ? current.value : parseFloat(current.value as string);
  const previousValue =
    typeof previous.value === "number" ? previous.value : parseFloat(previous.value as string);

  if (isNaN(currentValue) || isNaN(previousValue) || previousValue === 0) return null;

  const change = ((currentValue - previousValue) / previousValue) * 100;
  return Math.round(change);
}

export function generateTemplateInsights(
  parameter: ParameterResult,
  config: LabParameter,
  history: ParameterHistory[],
  testName: string
): RiskInsight[] {
  const insights: RiskInsight[] = [];
  const currentDate = new Date().toLocaleDateString();

  // Check if value is abnormal
  let isAbnormal = false;
  if (config.type === "numeric") {
    const value = parseFloat(parameter.value);
    const min = config.min || 0;
    const max = config.max || 100;
    isAbnormal = value < min || value > max;
  } else if (config.type === "categorical") {
    isAbnormal = !config.normal_values?.includes(parameter.value);
  }

  if (isAbnormal) {
    insights.push({
      date: currentDate,
      risk_level: "high",
      title: `Abnormal ${parameter.parameter_name}`,
      description: `Current result (${parameter.value}) is outside the normal range. Regular monitoring and follow-up with healthcare provider is recommended.`,
      impact: "Strong Impact",
    });
  } else {
    insights.push({
      date: currentDate,
      risk_level: "low",
      title: `Normal ${parameter.parameter_name}`,
      description: `Current result (${parameter.value}) is within normal range. Continue regular health monitoring.`,
      impact: "Low Impact",
    });
  }

  // Trending analysis
  if (history.length >= 3) {
    const recentValues = history.slice(-3).map((h) =>
      typeof h.value === "number" ? h.value : parseFloat(h.value as string)
    );
    const isIncreasing = recentValues.every((val, idx) => idx === 0 || val > recentValues[idx - 1]);
    const isDecreasing = recentValues.every((val, idx) => idx === 0 || val < recentValues[idx - 1]);

    if (isIncreasing || isDecreasing) {
      insights.push({
        date: currentDate,
        risk_level: "medium",
        title: `Trending ${isIncreasing ? "Upward" : "Downward"}`,
        description: `${parameter.parameter_name} shows a consistent ${
          isIncreasing ? "increase" : "decrease"
        } over recent tests. Consider discussing this trend with your healthcare provider.`,
        impact: "Medium Impact",
      });
    }
  }

  // Regular monitoring recommendation
  insights.push({
    date: currentDate,
    risk_level: "low",
    title: "Regular Monitoring",
    description: `Continue regular monitoring of ${parameter.parameter_name} levels to track health status and identify any changes early.`,
    percentage: 95,
  });

  return insights;
}