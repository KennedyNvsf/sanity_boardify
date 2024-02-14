import { z } from "zod";

export const UpdateListOrder = z.object({
  items: z.array(
    z.object({
      _id: z.string(),
      title: z.string(),
      order: z.number(),
    }),
  ),
  boardId: z.string(),
});