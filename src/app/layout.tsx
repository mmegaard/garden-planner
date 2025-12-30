import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ConvexClientProvider } from "../components/ConvexClientProvider";
import ObjectProvider from "../components/ObjectProvider";
import ViewportProvider from "../components/ViewportProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Garden",
  description: "Plan your garden!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <ViewportProvider>
          <ObjectProvider>
          <Theme>{children}</Theme> 
          </ObjectProvider>
          </ViewportProvider>
          
        </ConvexClientProvider>
        
      </body>
    </html>
  );
}
