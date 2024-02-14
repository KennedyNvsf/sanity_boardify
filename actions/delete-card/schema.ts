import { z } from "zod";

export const DeleteCard = z.object({
  _id: z.string(),
  boardId: z.string(),
});