"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, CheckCircle2 } from "lucide-react";
import { Icon } from "./icon";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string;
}

export function SuccessModal({
  open,
  onOpenChange,
  message,
}: SuccessModalProps) {
  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.3,
      },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm flex flex-col items-center justify-center py-12">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{" "}</DialogTitle>

        </DialogHeader>
        <motion.div
          variants={checkmarkVariants}
          initial="hidden"
          animate={open ? "visible" : "hidden"}
        >
          <Icon name="success" className="w-43 h-43 fill-none" />
        </motion.div>

        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate={open ? "visible" : "hidden"}
          className="text-center space-y-2 mt-6"
        >
          <h2 className="text-2xl font-bold">Successful!</h2>
          <p className="text-muted-foreground">
            {message || "Your action has been completed successfully"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={open ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full flex items-center justify-center mt-6"
        >
          <Button
            className="w-fit px-12 h-12 text-lg font-bold mx-auto bg-primary hover:bg-primary/90"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
