import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import fileUpload, { UploadedFile, Files } from "express-fileupload";

// Import the custom type definition
import "./typings/express";

const app: express.Application = express();
const port = 3001;

// Middleware for JSON parsing
app.use(express.json());

// Middleware for handling errors
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
};

app.use(errorHandler);

// Middleware for file uploads
app.use(fileUpload());

// Home route
app.get("/home", (req: Request, res: Response) => {
  res.send("Hello");
});

// Image upload route
app.post("/imageUpload", (req: Request, res: Response) => {
  // Check if files are present in the request
  const uploadedFiles = req.files as Files;

  if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // Access the uploaded file
  const uploadedFile = uploadedFiles.image as UploadedFile; // Assuming the field name is 'image'

  // Check file type
  const allowedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (!allowedFileTypes.includes(uploadedFile.mimetype)) {
    return res
      .status(415)
      .send(
        "Unsupported Media Type. Only PNG, JPG, and JPEG files are allowed."
      );
  }

  // Process the uploaded file (you can save it, manipulate it, etc.)
  // For now, just send a success message
  res.send("File uploaded successfully!");
});

// Serve uploaded images from the /images folder
app.use("/images", express.static(__dirname + "/images"));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
