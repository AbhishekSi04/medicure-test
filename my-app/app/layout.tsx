
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediCure — Healthcare Made Simple",
  description: "Talk to certified doctors anytime, anywhere. Get expert advice, prescriptions, and care—right from home. Video consultations, secure messaging, and easy scheduling.",
};

// Inline script to prevent flash of wrong theme on page load.
// Runs before React hydration so the correct class is set immediately.
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('ui-theme') || 'dark';
      var root = document.documentElement;
      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    } catch (e) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
            <div
              data-scroll-container
              style={{ minHeight: "100vh" }}
            >
              <section className="border-b border-border ">
                <Header/>
              </section>
              <Toaster richColors/>
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
