import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Create professional resumes with ease",
  generator: "v0.app",
};

// export default function RootLayout({
export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="resume-layout">{children}</div>;
}
