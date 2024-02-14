"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import sanityClient from "@/lib/sanityClient";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateCardOrder } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items, boardId, } = data;
  let updatedCards;

  try {

    for (let item of items) {
       updatedCards = await sanityClient
        .patch(item._id)
        .set({ 
            order: item.order,
            listId: item.listId,
            updatedAt: new Date().toISOString() 
        })
        .commit();
    } 

  } catch (error) {
    console.log('UPDTCARDERROR:',error)
    return {
      error: "Failed to reorder."
    }
  }

  revalidatePath(`/board/${boardId}`);
  // @ts-ignore
  return { data: updatedCards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);