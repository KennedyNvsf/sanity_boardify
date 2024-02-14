import { z } from "zod";

export const DeleteList = z.object({
  _id: z.string(),
  boardId: z.string(),
});