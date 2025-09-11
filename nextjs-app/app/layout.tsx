
import "@/public/assets/css/style.css";
import "@/styles/globals.css";
import { NextAuthProvider } from "@/components/providers/authProviders";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jobbox - Job Portal HTML Template",
  description: "Jobbox - Job Portal HTML Template",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className}`}>
        <NextAuthProvider>{children}</NextAuthProvider>
         <ToastContainer position="top-right" autoClose={4000} />
          <Toaster position="top-right" />
      </body>
    </html>
  );
}
