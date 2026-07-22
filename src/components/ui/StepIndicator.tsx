"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full mb-10 select-none">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                idx < currentStep
                  ? "bg-brand-500 text-white"
                  : idx === currentStep
                  ? "bg-brand-500/10 text-brand-500 border-2 border-brand-500"
                  : "bg-white border border-navy-100 text-navy-500/30"
              }`}
            >
              {idx < currentStep ? <Check size={18} /> : idx + 1}
            </motion.div>
            <span
              className={`mt-2 text-[10px] uppercase tracking-wider hidden sm:block max-w-[80px] text-center ${
                idx <= currentStep ? "text-brand-500 font-bold" : "text-navy-500/30 font-bold"
              }`}
            >
              {step}
            </span>
          </div>

          {/* Connector line */}
          {idx < steps.length - 1 && (
            <div className="w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 mb-4">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  idx < currentStep ? "bg-brand-500" : "bg-navy-500/10"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
