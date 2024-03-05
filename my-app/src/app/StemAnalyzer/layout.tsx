import type { Metadata } from "next";
import { Genos as FontSans } from "next/font/google";
import { cn } from "../../lib/utils";
import Navbar from "@/components/Navbar";
import { SparklesCore } from "@/components/ui/sparkles";
import { Toaster } from "@/components/ui/toaster";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Leaf Stem analyzer",
  description: "Kenya Leaf Stem analyzer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="max-h-screen overflow-clip">
      <body
        className={cn(
          "relative h-full font-sans antialiased",
          fontSans.className
        )}
      >
        {/* bg-gradient-to-r from-slate-900 to-slate-800 */}
        {/*         <main className="relative bg-[linear-gradient(110deg,#333_0.6%,#222)] flex flex-col min-h-screen"> */}
        <main className="relative bg-[linear-gradient(110deg,#333_0.6%,#222)]  flex flex-col min-h-screen">
          {/* <Navbar /> */}
          {/* <div className="w-full absolute inset-0 h-screen">
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div> */}
          <div className="flex-grow flex-1">{children}</div>
          <Toaster />
        </main>
      </body>
    </html>
  );
}
