// src/features/applicants/components/ApplicantTimeline.tsx
"use client";

import { ApplicantTimeline } from "../services/applicant.service";

type Props = {
  timeline: ApplicantTimeline[];
};

export default function ApplicantTimelineView({ timeline }: Props) {
  return (
    <div className="timeline-container">
      <h4 className="mb-3">Application Timeline</h4>
      <ul className="timeline">
        {timeline.map((step) => (
          <li
            key={step.stepOrder}
            className={`timeline-step ${
              step.currentStep ? "current" : step.completed ? "completed" : ""
            }`}
          >
            <div className="step-header">
              <span className="status">{step.status}</span>
              {step.completed && <span className="check">✅</span>}
              {step.currentStep && <span className="now">🔵 Current</span>}
            </div>

            {step.events.length > 0 ? (
              <ul className="event-list">
                {step.events.map((ev) => (
                  <li key={ev.id} className="event-item">
                    <span className="event-date">
                      {new Date(ev.changedAt).toLocaleString()}
                    </span>
                    <span className="event-note">{ev.note}</span>
                    {/* <span className="event-by">({ev.changedBy})</span> */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-events">No events</p>
            )}
          </li>
        ))}
      </ul>

      <style jsx>{`
        .timeline-container {
          margin-top: 20px;
        }
        .timeline {
          list-style: none;
          padding-left: 0;
        }
        .timeline-step {
          margin-bottom: 15px;
          padding: 10px;
          border-left: 3px solid #ddd;
        }
        .timeline-step.current {
          border-color: blue;
          background: #f0f6ff;
        }
        .timeline-step.completed {
          border-color: green;
          background: #f6fff6;
        }
        .step-header {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .event-list {
          margin-left: 20px;
          list-style: circle;
        }
        .event-item {
          margin-bottom: 4px;
        }
        .event-date {
          color: gray;
          font-size: 0.85rem;
          margin-right: 5px;
        }
        .event-note {
          margin-right: 5px;
        }
      `}</style>
    </div>
  );
}
