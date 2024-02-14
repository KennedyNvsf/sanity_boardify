"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteCard } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE, List } from "@/models/typings";
import sanityClient from "@/lib/sanityClient";
import { Card } from "@/models/typings";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { _id, boardId } = data;
  let card: Card;

  try {

    const cardToDel = await sanityClient.getDocument<Card>(_id);

    const currentList = await sanityClient.getDocument<List>(cardToDel?.listId!);

    // Filter out the list to be deleted
    const updatedCards= (currentList?.cards || []).filter(
      card => card._ref !== _id
    );


    // @ts-ignore
    await sanityClient.createOrReplace<List>({
      ...currentList,
      cards: updatedCards,
      updatedAt: new Date().toISOString(),
    });

    card = await sanityClient.delete(_id)

    await createAuditLog({
      entityTitle: card.title,
      entityId: card._id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.DELETE,
    })
  } catch (error) {
    console.log(error)
    return {
      error: "Failed to delete."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);