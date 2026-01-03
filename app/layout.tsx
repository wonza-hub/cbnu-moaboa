import type { Metadata, Viewport } from "next";
import "@/applications/styles/globals.css";
import ReactQueryProvider from "@/applications/providers/react-query-provider";
import { PushNotificationManager } from "@/shared/components/push-notification-manager";
import { BottomNavigation } from "@/widgets/bottom-navigation";
import { NoticeDetailDrawer } from "@/widgets/notice-detail";
import { Toaster } from "@/shared/components/ui/sonner";
import { ThemeProvider } from "@/applications/providers/theme-provider";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
    <html lang="ko" suppressHydrationWarning>
      <body className={`${pretendard.variable} font-pretendard`}>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <PushNotificationManager />
            <Toaster />
            <main>{children}</main>
            <BottomNavigation />
            <NoticeDetailDrawer />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
