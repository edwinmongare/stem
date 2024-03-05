import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import path from "path";
import { spawn } from "child_process";
import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.post<{}, MessageResponse>("/imageUpload", (req, res) => {
  console.log(req.files);

  const uploadedFiles = req.files as fileUpload.FileArray;

  if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const uploadedFile = uploadedFiles.image as fileUpload.UploadedFile;

  const destinationPath = path.join(__dirname, "./images", uploadedFile.name);

  uploadedFile.mv(destinationPath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving the file." });
    }

    const pythonScriptPath = path.join(__dirname, "./script.py");

    const pythonProcess = spawn("python", [pythonScriptPath, destinationPath]);

    let pythonOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);

      if (code === 0) {
        // If Python script executed successfully, include the output in the response
        const response = {
          status: "success",
          message: "File uploaded, saved, and analyzed successfully!",
          analysis: pythonOutput,
        };
        console.log("Response sent to client:", response); // Log the response
        res.status(200).json(response);
      } else {
        // If Python script failed, return an error response
        res.status(500).json({
          status: "error",
          message: "Error analyzing the image with Python script.",
        });
      }
    });
  });
});

router.use("/emojis", emojis);

export default router;
