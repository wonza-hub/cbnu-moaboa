import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/applications/styles/globals.css";
import ReactQueryProvider from "@/applications/providers/react-query-provider";
import { BottomNavigation } from "@/widgets/bottom-navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "충북대학교 통합 공지사항",
  description: "충북대학교 통합 공지사항",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-20`}
      >
        <ReactQueryProvider>
          {children}
          <BottomNavigation />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
