import { LabParameter, ParameterHistory, ParameterResult } from "@/types/laboratory";
import { useState } from "react";
import { generateTemplateInsights } from "./lab-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {motion} from "framer-motion"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
export  default function InsightsPanel({
  parameter,
  config,
  history,
  testName,
}: {
  parameter: ParameterResult;
  config: LabParameter;
  history: ParameterHistory[];
  testName: string;
}) {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const templateInsights = generateTemplateInsights(parameter, config, history, testName);

  const fetchAIInsight = async () => {
    setLoadingAI(true);
    try {
      // Using Hugging Face's free inference API
      const prompt = `Provide a brief, non-diagnostic educational insight about the ${parameter.parameter_name} test result of ${parameter.value}. Focus on general health information only. Keep it under 100 words.`;
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_length: 100, temperature: 0.7 },
          }),
        }
      );

      const data = await response.json();
      setAiInsight(data[0]?.generated_text || "AI insight generation unavailable at the moment.");
    } catch (error) {
      setAiInsight("Unable to generate AI insight. Please try again later.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <Card className="col-span-3 overflow-auto">
      <CardHeader>
        <CardTitle className="text-sm">Insights</CardTitle>
        <p className="text-xs text-muted-foreground">
          Risk and recommendations for patients
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {templateInsights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-3 rounded-lg border bg-card"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold">{insight.date}</span>
              <Badge
                variant={
                  insight.risk_level === "low"
                    ? "default"
                    : insight.risk_level === "medium"
                    ? "secondary"
                    : "destructive"
                }
                className="text-xs"
              >
                {insight.risk_level === "low" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {insight.risk_level}
              </Badge>
            </div>
            <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
            <p className="text-xs text-muted-foreground">{insight.description}</p>
            {insight.impact && (
              <Badge variant="outline" className="mt-2 text-xs">
                {insight.impact}
              </Badge>
            )}
          </motion.div>
        ))}

        <Separator />

        {/* AI Insight Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold">AI Analysis</h4>
            {!aiInsight && (
              <Button size="sm" variant="outline" onClick={fetchAIInsight} disabled={loadingAI}>
                {loadingAI ? "Generating..." : "Generate"}
              </Button>
            )}
          </div>
          {aiInsight && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900">{aiInsight}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}