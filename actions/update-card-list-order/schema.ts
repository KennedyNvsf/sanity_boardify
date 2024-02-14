import { z } from "zod";

export const UpdateCardListOrder = z.object({
  item: 
    z.object({
      _id: z.string(),
      title: z.string(),
      order: z.number(),
      listId: z.string(),
    }),
  
  boardId: z.string(),
  destListId: z.string(),
});