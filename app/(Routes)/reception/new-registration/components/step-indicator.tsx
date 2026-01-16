import { Icon } from "@/components/icon"
import { Check, CheckCircle2, Users } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between pl-14.5 pr-36.25  gap-y-8 pb-6 max-w-5xl">
      {/* Step 1 */}
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center transition-all
            ${currentStep > 1 ? "bg-primary text-white" : ""}
            `}
        >
          {currentStep > 1 ? <Check className="w-6 h-6" /> : <Icon name="user-add" className=" scale-150" />}
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-muted-foreground">Step 1</p>
          <p className="text-sm font-semibold">Guest Details</p>
        </div>
      </div>

      {/* Connector Line */}
      <div className={`h-0.5 w-full bg-muted`} />

      {/* Step 2 */}
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            currentStep >= 2 ? "border-2 border-primary text-white" : "border-2 border-muted text-muted-foreground"
          }`}
        >
          <Icon name="people" color="#2372fe" className={`scale-150 ${currentStep >= 2 ? "fill-primary" : ""}`} />
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-muted-foreground">Step 2</p>
          <p className="text-sm font-semibold">Queue</p>
        </div>
      </div>
    </div>
  )
}
