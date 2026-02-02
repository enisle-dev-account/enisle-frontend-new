"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid2X2, ListCheck } from "lucide-react";
import PatientsContent from "./components/patients-content";

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState("in_queue");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    const savedView = localStorage.getItem("preferredTableView");
    if (savedView === "list" || savedView === "grid") {
      setViewMode(savedView);
    }
  }, []);

  const handleViewModeChange = (mode: "list" | "grid") => {
    setViewMode(mode);
    localStorage.setItem("preferredTableView", mode);
  };

  return (
    <div className="">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-hidden">
          <div className="rounded-2xl bg-background px-6">
            <TabsList className="w-full justify-between bg-transparent py-7 border-b-0">
              <div className="flex items-center gap-6">
                <TabsTrigger
                  value="in_queue"
                  className="relative rounded-none border-0 border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4.5"
                >
                  In Queue
                </TabsTrigger>
                <TabsTrigger
                  value="checkout"
                  className="relative rounded-none border-0 border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4.5"
                >
                  Checkout
                </TabsTrigger>
                <TabsTrigger
                  value="finished"
                  className="relative rounded-none border-0 border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4.5"
                >
                  Finished
                </TabsTrigger>
                <TabsTrigger
                  value="canceled"
                  className="relative rounded-none border-0 border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4.5"
                >
                  Canceled
                </TabsTrigger>
              </div>

         
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {["in_queue", "checkout", "finished", "canceled"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0 pt-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center py-12">
                        <p>Loading...</p>
                      </div>
                    }
                  >
                    <PatientsContent status={tab} viewMode={viewMode} />
                  </Suspense>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}