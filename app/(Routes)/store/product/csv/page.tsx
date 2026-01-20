"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useMutation } from "@tanstack/react-query"
import { request } from "@/hooks/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { StepIndicator } from "./components/step-indicator"
import { FileUploadStep } from "./components/file-upload-step"
import { ImportProgressStep } from "./components/import-progress-step"
import { SuccessStep } from "./components/success-step"

export default function CSVImportPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [importedCount, setImportedCount] = useState(0)

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)

      // Simulate progress
      setUploadProgress(0)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 30
        })
      }, 300)

      try {
        const response = await request("/store/product/create/csv/", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)
        setImportedCount(response.count || 0)
        return response
      } catch (error) {
        clearInterval(progressInterval)
        throw error
      }
    },
    onSuccess: () => {
      setTimeout(() => {
        setCurrentStep(3)
      }, 1000)
    },
    onError: (error) => {
      console.error("Import failed:", error)
      setCurrentStep(1)
      setUploadProgress(0)
      setSelectedFile(null)
    },
  })

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleContinue = () => {
    if (selectedFile) {
      setCurrentStep(2)
      importMutation.mutate(selectedFile)
    }
  }

  const handleViewProducts = () => {
    router.push("/store/products")
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setUploadProgress(0)
      setSelectedFile(null)
    } else {
      router.back()
    }
  }

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  }

  return (
    <main className="rounded-t-2xl bg-background overflow-hidden h-full flex flex-col pt-6 px-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Import Product</h1>
          <p className="text-sm text-muted-foreground">
            The tools allows you to import (or merge) product data to your store from a CSV or TXT file.
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-2xl"
            >
              <FileUploadStep onFileSelect={handleFileSelect} selectedFile={selectedFile} />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-2xl"
            >
              <ImportProgressStep
                progress={uploadProgress}
                fileName={selectedFile?.name || ""}
                isLoading={importMutation.isPending}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-2xl"
            >
              <SuccessStep count={importedCount} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2 py-6 border-t">
        <AnimatePresence>
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl flex gap-2"
            >
              <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleContinue}
                disabled={!selectedFile}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl flex gap-2"
            >
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 bg-transparent"
              >
                Import Another File
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleViewProducts}
              >
                View Products
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
