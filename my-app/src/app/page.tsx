"use client";
import { LampDemo } from "@/components/Lamp";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to the "/StemAnalyzer" route immediately after the animation is complete
    const handleAnimationComplete = () => {
      router.push("/StemAnalyzer");
    };

    return handleAnimationComplete();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
      <LampDemo />
    </main>
  );
}
