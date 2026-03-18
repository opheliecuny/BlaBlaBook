import 'dotenv/config';
import { addBookToLibrary } from "../controllers/library.controller";

// mock req
const mockReq = {
  user: { id: "a48b1d67-bc22-4285-92c7-1a5bdbd95bff" },
  body: {
    isbn: "123456789",
    title: "Test Book",
    author: "Moi",
    status: "READ"
  }
} as any;

// mock res
const mockRes = {
  json: (data: any) => {
    console.log("RESPONSE :", data);
  }
} as any;

// appel
await addBookToLibrary(mockReq, mockRes);