import type { Metadata } from "next";

import { DensityProvider } from "@/components/DensityProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Support Desk",
  description: "Internal ticket triage",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DensityProvider>
          <div className="shell">{children}</div>
        </DensityProvider>
      </body>
    </html>
  );
}
