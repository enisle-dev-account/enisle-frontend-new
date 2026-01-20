"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface SuccessStepProps {
  count: number
}

export function SuccessStep({ count }: SuccessStepProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.1,
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 0.3 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-6"
    >
      {/* Checkmark Animation */}
      <motion.div
        variants={checkmarkVariants}
        className="flex justify-center"
      >
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        variants={textVariants}
        className="space-y-3"
      >
        <h2 className="text-2xl font-bold">Successful!</h2>
        <p className="text-muted-foreground">
          Import complete {count} products was imported. {" "}
          <a href="/store/products" className="text-primary hover:underline">
            View import log
          </a>{" "}
          File uploaded
        </p>
      </motion.div>

      {/* File Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="bg-muted/30 rounded-lg p-4 text-sm space-y-2"
      >
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total imported:</span>
          <span className="font-semibold text-success">{count} products</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
