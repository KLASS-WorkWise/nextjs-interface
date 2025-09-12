"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { ApplicantTimeline, ApplicantHistory } from "../services/applicant.service";

type Props = { steps: ApplicantTimeline[] };

export function Timeline({ steps }: Props) {
  const [highlightStep, setHighlightStep] = useState<number | null>(null);

  // Khi steps thay đổi, highlight step mới
  useEffect(() => {
    const currentStepIndex = steps.findIndex(step => step.currentStep);
    if (currentStepIndex !== -1) {
      setHighlightStep(currentStepIndex);
      const timer = setTimeout(() => setHighlightStep(null), 2000); // nháy 2s
      return () => clearTimeout(timer);
    }
  }, [steps]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Application process TIMELINE</h3>
      <ol className="relative border-l border-gray-200 ml-3">
        {steps.map((step, idx) => (
          <li key={idx} className="mb-6 ml-4 transition-colors duration-500">
            <span
              className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-500 
                ${step.completed 
                  ? "bg-green-500 text-white" 
                  : step.currentStep 
                    ? highlightStep === idx 
                      ? "bg-blue-400 text-white animate-pulse" 
                      : "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.completed ? <CheckCircle size={14} /> : <Clock size={14} />}
            </span>

            <h4 className={`font-medium ${highlightStep === idx ? "text-blue-600" : ""}`}>
              {step.status}
            </h4>

            {step.events?.map((ev: ApplicantHistory, i: number) => (
              <p key={i} className="text-xs text-gray-500">
                {new Date(ev.changedAt).toLocaleString()} - {ev.note} ({ev.changedBy})
              </p>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
