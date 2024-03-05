// Update MessageResponse interface
export default interface MessageResponse {
  message: string;
  status?: string;
  analysis?: string; // Add status property
}
