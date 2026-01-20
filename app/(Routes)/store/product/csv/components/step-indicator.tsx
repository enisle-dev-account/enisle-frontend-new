"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
}

const STEPS = [
  { number: 1, label: "Import CSV file" },
  { number: 2, label: "Import" },
  { number: 3, label: "Done" },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8">
      {STEPS.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          {/* Step Circle */}
          <motion.div
            className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 font-semibold text-sm shrink-0 ${
              step.number < currentStep
                ? "bg-success border-success text-success-foreground"
                : step.number === currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background border-border text-muted-foreground"
            }`}
            initial={false}
            animate={{
              scale: step.number === currentStep ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {step.number < currentStep ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
            ) : (
              step.number
            )}
          </motion.div>

          {/* Label */}
          <motion.p
            className={`ml-3 text-sm font-medium ${
              step.number <= currentStep ? "text-foreground" : "text-muted-foreground"
            }`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: step.number <= currentStep ? 1 : 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {step.label}
          </motion.p>

          {/* Connector Line */}
          {index < STEPS.length - 1 && (
            <div className="flex-1 mx-2 h-0.5 bg-border relative">
              <motion.div
                className="h-full bg-primary"
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: step.number < currentStep ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
                style={{ originX: 0 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
