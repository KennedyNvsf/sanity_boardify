import { z } from "zod";

export const CopyCard = z.object({
  _id: z.string(),
  boardId: z.string(),
});