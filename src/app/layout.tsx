// layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/app/context/AuthContext";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import RouteLoader from "@/components/layout/RouteLoader";
import SessionExpiredDialog from "@/components/ui/SessionExpiredDialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Efortech Education",
  description: "Efortech’s Innovative Education Solutions",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SessionExpiredDialog />
      <html lang="en" className="h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
          <RouteLoader />
          <Toaster position="bottom-right" reverseOrder={false} />
          <NavbarWrapper />
          <main className="flex-grow">{children}</main>
          <FooterWrapper />
        </body>
      </html>
    </AuthProvider>
  );
}
