"use client";

import axios, { AxiosProgressEvent, CancelTokenSource } from "axios";
import {
  AudioWaveform,
  File,
  FileImage,
  FolderArchive,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemoryStick, PercentDiamond, Ruler } from "lucide-react";
import { Button } from "./ui/button";

const notifications = [
  {
    title: "Number of Stems",
    description: "23",
    icon: <MemoryStick />,
  },
  {
    title: "Average Length (cm)",
    description: "4.5",
    icon: <Ruler />,
  },
  {
    title: "Average Width (cm)",
    description: "0.5",
    icon: <Ruler />,
  },
  {
    title: "% Stems above 4.5cm",
    description: "3%",
    icon: <PercentDiamond />,
  },
];

type CardProps = React.ComponentProps<typeof Card>;

interface FileUploadProgress {
  progress: number;
  File: File;
  source: CancelTokenSource | null;
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}

const ImageColor = {
  bgColor: "bg-purple-600",
  fillColor: "fill-purple-600",
};

const PdfColor = {
  bgColor: "bg-blue-400",
  fillColor: "fill-blue-400",
};

const AudioColor = {
  bgColor: "bg-yellow-400",
  fillColor: "fill-yellow-400",
};

const VideoColor = {
  bgColor: "bg-green-400",
  fillColor: "fill-green-400",
};

const OtherColor = {
  bgColor: "bg-gray-400",
  fillColor: "fill-gray-400",
};

export default function ImageUpload() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  const [analysisData, setAnalysisData] = useState<{
    number_of_stems: string;
    average_length: string;
    average_width: string;
    percent_above_threshold: string;
  } | null>(null);
  const getFileIconAndColor = (file: File) => {
    if (file.type.includes(FileTypes.Image)) {
      return {
        icon: <FileImage size={40} className={ImageColor.fillColor} />,
        color: ImageColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Pdf)) {
      return {
        icon: <File size={40} className={PdfColor.fillColor} />,
        color: PdfColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Audio)) {
      return {
        icon: <AudioWaveform size={40} className={AudioColor.fillColor} />,
        color: AudioColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Video)) {
      return {
        icon: <Video size={40} className={VideoColor.fillColor} />,
        color: VideoColor.bgColor,
      };
    }

    return {
      icon: <FolderArchive size={40} className={OtherColor.fillColor} />,
      color: OtherColor.bgColor,
    };
  };

  useEffect(() => {
    console.log("Analysis Data:", analysisData); // Check if data is present

    // Check if analysisData is not null and the dialog is not open
    if (analysisData && !isDialogOpen) {
      // Open the dialog
      setIsDialogOpen(true);
    }
  }, [analysisData, isDialogOpen]);

  // feel free to mode all these functions to separate utils
  // here is just for simplicity
  const onUploadProgress = (
    progressEvent: AxiosProgressEvent,
    file: File,
    cancelSource: CancelTokenSource
  ) => {
    const progress = Math.round(
      (progressEvent.loaded / (progressEvent.total ?? 0)) * 100
    );

    if (progress === 100) {
      setUploadedFiles((prevUploadedFiles) => {
        return [...prevUploadedFiles, file];
      });

      setFilesToUpload((prevUploadProgress) => {
        return prevUploadProgress.filter((item) => item.File !== file);
      });

      return;
    }

    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.map((item) => {
        if (item.File.name === file.name) {
          return {
            ...item,
            progress,
            source: cancelSource,
          };
        } else {
          return item;
        }
      });
    });
  };

  const uploadImageToCloudinary = async (
    formData: FormData,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
    cancelSource: CancelTokenSource
  ) => {
    return axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
      formData,
      {
        onUploadProgress,
        cancelToken: cancelSource.token,
      }
    );
  };

  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item.File !== file);
    });

    setUploadedFiles((prevUploadedFiles) => {
      return prevUploadedFiles.filter((item) => item !== file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const fileUploadBatch = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);

          try {
            const response = await fetch(
              "http://localhost:5000/api/v1/imageUpload",
              {
                method: "POST",
                body: formData,
              }
            );

            if (response.status === 200) {
              const responseData = await response.json();
              console.log("Response from server:", responseData); // Log the response
              setAnalysisData(responseData); // Set the state here
              console.log(`${file.name} uploaded successfully!`);
              toast({
                title: "Image Uploaded Successfully",
                description: `${file.name} has been uploaded.`,
                action: <ToastAction altText="Undo">Thanks🎊🎉🎉</ToastAction>,
              });
            } else {
              console.error(
                `Failed to upload ${file.name}. Status:`,
                response.status
              );
              toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `There was a problem with uploading ${file.name}.`,
                action: (
                  <ToastAction altText="Try again">Try again</ToastAction>
                ),
              });
            }
          } catch (error) {
            console.error(`Error during ${file.name} upload:`, error);
            toast({
              variant: "destructive",
              title: "Server Error",
              description: `There was a problem with uploading ${file.name}.`,
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
          }
        });

        await Promise.all(fileUploadBatch);
      } catch (error) {
        console.error("Error uploading files: ", error);
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      {isDialogOpen && (
        <Dialog>
          <DialogTrigger>
            <Button className="mb-5" variant={"secondary"}>
              View Results
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Card className={`w-full bg-[#ECECEC]`}>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  Here are the results from your image
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <ScrollArea className="max-h-[400px] my-auto w-full overflow-y-hidden p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {analysisData && (
                      <>
                        <div className="mb-4 grid grid-cols-[0px_1fr] items-center pb-0">
                          <span className="flex h-0 w-0 translate-y-1 rounded-full bg-[#ECECEC]" />
                          <div className="space-y-1 rounded-md border border-white shadow-lg px-4 py-4">
                            <span>
                              {" "}
                              <MemoryStick />
                            </span>
                            <p className="text-sm font-medium leading-none">
                              Number of Stems
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {analysisData.number_of_stems}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4 grid grid-cols-[0px_1fr] items-center pb-0">
                          <span className="flex h-0 w-0 translate-y-1 rounded-full bg-[#ECECEC]" />
                          <div className="space-y-1 rounded-md border border-white shadow-lg px-4 py-4">
                            <span>
                              {" "}
                              <Ruler />
                            </span>
                            <p className="text-sm font-medium leading-none">
                              Average Length (cm)
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {analysisData && analysisData.average_length}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4 grid grid-cols-[0px_1fr] items-center pb-0">
                          <span className="flex h-0 w-0 translate-y-1 rounded-full bg-[#ECECEC]" />
                          <div className="space-y-1 rounded-md border border-white shadow-lg px-4 py-4">
                            <span>
                              {" "}
                              <Ruler />
                            </span>
                            <p className="text-sm font-medium leading-none">
                              Average Width (cm)
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {analysisData.average_width}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4 grid grid-cols-[0px_1fr] items-center pb-0">
                          <span className="flex h-0 w-0 translate-y-1 rounded-full bg-[#ECECEC]" />
                          <div className="space-y-1 rounded-md border border-white shadow-lg px-4 py-4">
                            <span>
                              {" "}
                              <PercentDiamond />
                            </span>
                            <p className="text-sm font-medium leading-none">
                              % Stems above 4.5cm
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {analysisData.percent_above_threshold}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
      <div>
        <label
          {...getRootProps()}
          className="relative flex bg-[#ECECEC] flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  hover:bg-gray-100 "
        >
          <div className="text-center">
            <div className=" border p-2 rounded-md max-w-min mx-auto">
              <UploadCloud size={20} />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Drag files</span>
            </p>
            <p className="text-xs text-gray-500">
              Click to upload files &#40;files should be under 10 MB &#41;
            </p>
          </div>
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
        />
      </div>

      {filesToUpload.length > 0 && (
        <div>
          <ScrollArea className="h-40">
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              Files to upload
            </p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((fileUploadProgress) => {
                return (
                  <div
                    key={fileUploadProgress.File.lastModified}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <div className="text-white">
                        {getFileIconAndColor(fileUploadProgress.File).icon}
                      </div>

                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground ">
                            {fileUploadProgress.File.name.slice(0, 25)}
                          </p>
                          <span className="text-xs">
                            {fileUploadProgress.progress}%
                          </span>
                        </div>
                        <Progress
                          //   onProgress={fileUploadProgress.progress}
                          className={
                            getFileIconAndColor(fileUploadProgress.File).color
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (fileUploadProgress.source)
                          fileUploadProgress.source.cancel("Upload cancelled");
                        removeFile(fileUploadProgress.File);
                      }}
                      className="bg-red-500 text-white transition-all items-center justify-center cursor-pointer px-2 hidden group-hover:flex"
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div>
          <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
            Uploaded Files
          </p>
          <div className="space-y-2 pr-3">
            {uploadedFiles.map((file) => {
              return (
                <div
                  key={file.lastModified}
                  className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center flex-1 p-2">
                    <div className="text-white">
                      {getFileIconAndColor(file).icon}
                    </div>
                    <div className="w-full ml-2 space-y-1">
                      <div className="text-sm flex justify-between">
                        <p className="text-muted-foreground ">
                          {file.name.slice(0, 25)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file)}
                    className="bg-red-500 text-white transition-all items-center justify-center px-2 hidden group-hover:flex"
                  >
                    <X size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
