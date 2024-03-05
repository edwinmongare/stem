import { Express } from "express";
import { Files } from "express-fileupload";

declare module "express" {
  interface Request {
    files: Files;
  }
}
