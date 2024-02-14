"use server";

import { v4 as uuidv4 } from 'uuid';

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, Card, ENTITY_TYPE, List } from "@/models/typings";

import sanityClient from "@/lib/sanityClient";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { CopyCard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { _id, boardId } = data;
  let card;

  try {

    // Execute the query with the specified parameters
    const cardToCopy = await sanityClient.getDocument<Card>(_id);

    if (!cardToCopy) {
      return { error: "Card not found" }
    }

    const lastList = await sanityClient.fetch(`*[_type == 'card' && listId == '${cardToCopy.listId}'] | order(order desc) [0]`, {listId: cardToCopy.listId});

    const newOrder = lastList ? lastList.order + 1 : 1;

    card = await sanityClient.create({
      _type: 'card',
      title: `${cardToCopy.title} - Copy`,
      description: cardToCopy.description,
      order: newOrder,
      listId: cardToCopy.listId,
      createdAt: new Date().toISOString()
    });

    const currentList = await sanityClient.getDocument<List>(cardToCopy.listId);

    const updatedCards = [...(currentList?.cards || []), {
      _type: 'reference',
      _key: uuidv4(),
      _ref: card._id
    }]

    await sanityClient.createOrReplace<List>({
      ...currentList,
      // @ts-ignore
      cards: updatedCards,
      updatedAt: new Date().toISOString(),
    })

    await createAuditLog({
      entityTitle: card.title,
      entityId: card._id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
    })
  } catch (error) {
    return {
      error: "Failed to copy."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);