"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, Card, ENTITY_TYPE, List } from "@/models/typings";

import sanityClient from "@/lib/sanityClient";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { CreateCard } from "./schema";
import { InputType, ReturnType } from "./types";

import { v4 as uuidv4 } from 'uuid';


const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId, listId } = data;
  let card;

  try {

    const list = await sanityClient.fetch(`*[_type == 'list' && _id == '${listId}' && boardId == '${boardId}'][0]`, {
        boardId: boardId,
        listId: listId
    });

    if (!list) {
      return {
        error: "List not found",
      };
    }

    const lastCard = await sanityClient.fetch(`*[_type == 'card' && listId == '${listId}'] | order(order desc) [0]`, {listId: listId});

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await sanityClient.create({
      _type: 'card',
      title,
      listId,
      order: newOrder,
      createdAt: new Date().toISOString()
    });

    const currentList = await sanityClient.getDocument<List>(listId);

    const updatedCards = [...(currentList?.cards || []), {
        _type: 'reference',
        _key: uuidv4(),
        _ref: card._id,
    }];
    
    await sanityClient.createOrReplace<List>({
        ...currentList,
        // @ts-ignore
        cards: updatedCards,
        updatedAt: new Date().toISOString(),
    });

    await createAuditLog({
      entityId: card._id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to create."
    }
  }

  revalidatePath(`/board/${boardId}`);
  // @ts-ignore
  return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);