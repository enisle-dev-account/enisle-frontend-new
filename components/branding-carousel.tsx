"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@/components/icon"
import { SignupArt } from "@/lib/assets/icons-compiled"

const CAROUSEL_DATA = [
  {
    title: "Start your admin\njourney",
    subtext: "Let's streamline your workflow and enhance efficiency today.",
  },
  {
    title: "Explore our Admin\ndashboard",
    subtext: "Manage patient records, appointments, and staff seamlessly",
  },
  {
    title: "Utilize our\ncommunication tools",
    subtext: "Seamlessly collaborate and communicate with your hospital team",
  },
]

export function BrandingCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CAROUSEL_DATA.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hidden lg:flex items-center lg:w-1/2 bg-secondary text-white flex-col p-12 relative overflow-hidden">
      <Icon name="logo" size={78} className="mb-12 scale-180 ml-7 z-10" />

      <div className="h-48 z-10 mt-42.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-bold leading-tight whitespace-pre-line">
              {CAROUSEL_DATA[index].title}
            </h1>
            <p className="text-lg text-gray-300 max-w-md">
              {CAROUSEL_DATA[index].subtext}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 -right-46 w-120 h-120 pointer-events-none">
        <SignupArt className="w-full scale-170 h-full fill-none" />
      </div>

      <div className="flex gap-2 z-10 mt-50">
        {CAROUSEL_DATA.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
              i === index ? "w-12 bg-white" : "w-12 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}