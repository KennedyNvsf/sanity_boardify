"use server";

import { v4 as uuidv4 } from 'uuid';

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import sanityClient from "@/lib/sanityClient";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateCardListOrder } from "./schema";
import { InputType, ReturnType } from "./types";
import { List } from "@/models/typings";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { item, boardId, destListId } = data;
  let updatedListCards;

  try {


    const card = await sanityClient.patch(item._id).set({
      order: item.order,
      listId: destListId,
      updatedAt: new Date().toISOString() 
    }).commit()

    const listToUpdate = await sanityClient.getDocument<List>(destListId);

    const updatedCards = [...(listToUpdate?.cards || []), {
      _type: 'reference',
      _key: uuidv4(),
      _ref: card._id
    }]

    updatedListCards = await sanityClient.createOrReplace<List>({
      ...listToUpdate,
      // @ts-ignore
      cards: updatedCards,
      updatedAt: new Date().toISOString(),
    });


    const remCardList = await sanityClient.getDocument<List>(item.listId);

    const updatedListRemoval = (remCardList?.cards || []).filter(
      filteredCard => filteredCard._ref !== card._id
    )

    // @ts-ignore
    await sanityClient.createOrReplace<List>({
      ...remCardList,
      cards: updatedListRemoval,
      updatedAt: new Date().toISOString(),
    });


  } catch (error) {
    return {
      error: "Failed to reorder."
    }
  }

  revalidatePath(`/board/${boardId}`);
  // @ts-ignore
  return { data: updatedListCards };
};

export const updateCardListOrder = createSafeAction(UpdateCardListOrder, handler);