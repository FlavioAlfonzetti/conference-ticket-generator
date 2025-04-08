import React from "react";
import Image from "next/image";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conference ticket generator",
  icons: {
    icon: "/assets/images/favicon-32x32.png",
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="flex justify-center pt-10 mb-8">
          <Image
            src="/assets/images/logo-full.svg"
            alt="Logo"
            width={200}
            height={50}
            priority
          />
        </div>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
