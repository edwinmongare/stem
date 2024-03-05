"use client";
import React from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Results } from "./results";
import { Separator } from "@/components/ui/separator";
import { GlowingStarsBackgroundCardPreview } from "./pageInfo";
import ImageUpload from "./ImageCapture";
import CameraCapture from "./livecapture";

export function Bento() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="flex h-screen items-center justify-between">
          <div className="flex-1">
            <GlowingStarsBackgroundCardPreview />
            <ImageUpload />
            <Separator />
            <h5 className=" text-pretty font-semibold text-white text-2xl justify-center text-center">
              Or
            </h5>
            <CameraCapture />
          </div>
          <div className="w-5"></div>
          {/* <Separator />
          <div className="flex-1">
            <Results />
          </div> */}
        </div>
      </MaxWidthWrapper>
    </>
  );
}
