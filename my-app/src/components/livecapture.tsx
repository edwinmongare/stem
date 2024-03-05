import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const CameraCapture: React.FC = () => {
  const { toast } = useToast();

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCapture = async () => {
    // Check if the video stream and reference are available
    if (videoRef.current && mediaStream) {
      // Create a canvas element
      const canvas = document.createElement("canvas");

      // Set canvas dimensions to match video dimensions
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Get the 2D context of the canvas
      const context = canvas.getContext("2d");

      // Draw the current video frame onto the canvas
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a data URL (base64-encoded image)
        const dataUrl = canvas.toDataURL("image/png");

        // Make a POST request to upload the image
        try {
          const formData = new FormData();
          formData.append("image", dataUrl);

          const response = await fetch(
            "http://localhost:5000/api/v1/imageUpload",
            {
              method: "POST",
              body: formData,
            }
          );

          // Handle the response from the API
          if (response.status === 200) {
            console.log("Image uploaded successfully!");
            toast({
              title: "Image Uploaded Successfully",
              description: "Your image has been uploaded.",
              action: <ToastAction altText="Undo">Thanks🎊🎉🎉</ToastAction>,
            });
          } else {
            console.error("Failed to upload image. Status:", response.status);
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
          }
        } catch (error) {
          console.error("Error during image upload:", error);
          toast({
            variant: "destructive",
            title: "Server Error",
            description: "There was a problem with your request.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      // console.error("Error message:", error.message);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  return (
    <div>
      {mediaStream ? (
        <>
          <video
            className="bg-orange-700"
            ref={videoRef}
            autoPlay
            playsInline
          />
          <Button
            className="text-black w-full mt-3"
            variant="secondary"
            onClick={handleCapture}
          >
            Capture Image
          </Button>

          <Button
            className="text-black w-full mt-3"
            variant="secondary"
            onClick={stopCamera}
          >
            Stop Camera
          </Button>
        </>
      ) : (
        <Button
          className="text-black w-full mt-3"
          variant="secondary"
          onClick={startCamera}
        >
          Start Camera
        </Button>
      )}
    </div>
  );
};

export default CameraCapture;
