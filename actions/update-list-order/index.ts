"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import sanityClient from "@/lib/sanityClient";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateListOrder } from "./schema";
import { InputType, ReturnType } from "./types";
import { List } from "@/models/typings";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items, boardId } = data;
  let lists;

  try {

    for (let item of items) {
      lists = await sanityClient
       .patch(item._id)
       .set({ 
          order: item.order,
          updatedAt: new Date().toISOString() 
       })
      .commit();
   }
    
  } catch (error) {
    return {
      error: "Failed to reorder."
    }
  }

  revalidatePath(`/board/${boardId}`);
  // @ts-ignore
  return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);