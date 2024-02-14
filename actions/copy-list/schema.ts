import { z } from "zod";

export const CopyList = z.object({
  _id: z.string(),
  boardId: z.string(),
});