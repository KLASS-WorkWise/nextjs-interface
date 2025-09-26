"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import {
  ApplicantTimeline,
  TimelineEvent,
} from "../services/applicant.service";
import styles from "../../../styles/Timeline.module.css";
export type ApplicantHistory = {
  status: string;
  note?: string | null;
  changedAt: string;
  changedBy: string;
};
type Props = { steps: ApplicantTimeline[] };

export function Timeline({ steps }: Props) {
  const [highlightStep, setHighlightStep] = useState<number | null>(null);

  // Khi steps thay đổi, highlight step mới
  useEffect(() => {
    const currentStepIndex = steps.findIndex((step) => step.currentStep);
    if (currentStepIndex !== -1) {
      setHighlightStep(currentStepIndex);
      const timer = setTimeout(() => setHighlightStep(null), 2000); // nháy 2s
      return () => clearTimeout(timer);
    }
  }, [steps]);

  return (
    <div className={styles.timelineWrapper}>
      {/* <h3 className={styles.title}>Application Timeline</h3> */}
      <ol className={styles.timelineList}>
        {steps
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .map((step, idx) => (
            <li key={idx} className={styles.timelineStep}>
              {/* Dot */}
              <span
                className={`${styles.dot} ${
                  step.completed
                    ? styles.completed
                    : step.currentStep
                    ? highlightStep === idx
                      ? styles.currentPulse
                      : styles.current
                    : styles.pending
                }`}
              >
                {step.completed ? (
                  <CheckCircle size={14} />
                ) : (
                  <Clock size={14} />
                )}
              </span>

              {/* Line */}
              {idx < steps.length - 1 && <span className={styles.line}></span>}

              <div className={styles.content}>
                <h4
                  className={`${styles.stepTitle} ${
                    step.completed
                      ? styles.textCompleted
                      : step.currentStep
                      ? styles.textCurrent
                      : styles.textPending
                  }`}
                >
                  {step.status} {step.currentStep && "(Current)"}
                </h4>

                <div className={styles.events}>
                  {step.events.map((ev: TimelineEvent, i) => {
                    if ("changedAt" in ev) {
                      // ApplicantHistory
                      return (
                        <p key={i} className={styles.event}>
                          <span className={styles.eventTime}>
                            {new Date(ev.changedAt).toLocaleString()}
                          </span>{" "}
                          - {ev.note || "No note"}{" "}
                          <span className={styles.eventBy}>
                            ({ev.changedBy})
                          </span>
                        </p>
                      );
                    }
                    if ("scheduledAt" in ev) {
                      // InterviewSchedule
                      return (
                        <p key={i} className={styles.event}>
                          <span className={styles.eventTime}>
                            {new Date(ev.scheduledAt).toLocaleString()}
                          </span>{" "}
                          - Interview at {ev.location} with {ev.interviewer}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}
