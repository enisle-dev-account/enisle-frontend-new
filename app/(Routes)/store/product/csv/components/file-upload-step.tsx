"use client"

import React from "react"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FileUp, Download, FileText } from "lucide-react"

interface FileUploadStepProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
}

export function FileUploadStep({ onFileSelect, selectedFile }: FileUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && (file.type === "text/csv" || file.type === "text/plain")) {
      onFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Import products from a CSV file</h2>
        <p className="text-muted-foreground">
          The tools allows you to import (or merge) product data to your store from a CSV or TXT file.
        </p>
      </div>

      {/* File Upload Area */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        animate={{
          backgroundColor: isDragActive ? "hsl(var(--muted))" : "transparent",
          borderColor: isDragActive ? "hsl(var(--primary))" : "hsl(var(--border))",
        }}
        transition={{ duration: 0.2 }}
        className="relative border-2 border-dashed border-border rounded-lg p-12 cursor-pointer transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <motion.div
            animate={{ y: isDragActive ? -5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FileUp className="h-12 w-12 text-primary" />
          </motion.div>
          <div className="text-center">
            <p className="font-semibold">Choose a CSV file from your computer</p>
            <p className="text-sm text-muted-foreground">Maximum size 260 MB</p>
          </div>
        </div>
      </motion.div>

      {/* Selected File */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-center gap-3"
        >
          <FileText className="h-5 w-5 text-success shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </motion.div>
      )}

      {/* Options */}
      <Card className="p-6 border-0 bg-muted/30 space-y-4">
        <div className="space-y-3">
          <Label className="text-base font-semibold">Update existing products</Label>
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="update-yes"
              name="update"
              defaultChecked
              className="h-4 w-4"
            />
            <label htmlFor="update-yes" className="text-sm cursor-pointer">
              Existing products that match by ID will be updated. Products that do not exist
              will be skipped
            </label>
          </div>
        </div>
      </Card>

      {/* Download Template */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Need a template?</p>
            <p className="text-xs text-muted-foreground">Download our CSV template</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Download Template
        </Button>
      </div>
    </motion.div>
  )
}
