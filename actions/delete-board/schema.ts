import { z } from "zod";

export const DeleteBoard = z.object({
  _id: z.string(),
});