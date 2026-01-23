"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import StaffsContent from "./components/staff-content";
import StoreItemsContent from "./components/store-content";
import { Button } from "@/components/ui/button";
import { Grid2X2, ListCheck } from "lucide-react";

export default function StorePage() {
  const [activeTab, setActiveTab] = useState("store");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Load preferred view from localStorage
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
    <div className=" ">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className=" overflow-hidden">
          <div className="rounded-2xl bg-background   px-6">
            <TabsList className="w-full justify-between bg-transparent  py-7  border-b-0   ">
              <div className="flex items-center gap-14">
                <TabsTrigger
                  value="store"
                  className="relative rounded-none border-0 border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold  data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4.5"
                >
                  Store
                </TabsTrigger>
                <TabsTrigger
                  value="staffs"
                  className="relative rounded-none border-0 border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-bold  data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4.5"
                >
                  Staffs
                </TabsTrigger>
              </div>

              <div className="flex items-center gap-1   p-1 ">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0 rounded-sm"
                  onClick={() => handleViewModeChange("list")}
                >
                  <ListCheck className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0 rounded-sm"
                  onClick={() => handleViewModeChange("grid")}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent key={"store"} value="store" className="mt-0 pt-6">
              <motion.div
                key="store"
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
                  <StoreItemsContent viewMode={viewMode} />
                </Suspense>
              </motion.div>
            </TabsContent>

            <TabsContent key={"staffs"} value="staffs" className="mt-0 pt-6">
              <motion.div
                key="staffs"
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
                  <StaffsContent viewMode={viewMode} />
                </Suspense>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
