"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface ImportProgressStepProps {
  progress: number
  fileName: string
  isLoading: boolean
}

export function ImportProgressStep({
  progress,
  fileName,
  isLoading,
}: ImportProgressStepProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Importing</h2>
        <p className="text-muted-foreground">Your product are now being imported.</p>
      </div>

      {/* File Card */}
      <Card className="p-6 border-0 bg-muted/30 space-y-4">
        <div className="flex items-center gap-4">
          <motion.div
            variants={pulseVariants}
            animate={isLoading ? "animate" : undefined}
            className="shrink-0"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </motion.div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">295kbt</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Progress</p>
            <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </Card>

      {/* Status Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground">
          {progress < 100
            ? "Please do not close this page during import"
            : "Import completed successfully"}
        </p>
      </motion.div>
    </motion.div>
  )
}
