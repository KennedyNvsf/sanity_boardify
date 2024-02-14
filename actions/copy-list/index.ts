"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/typings";

import sanityClient from "@/lib/sanityClient";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { CopyList } from "./schema";
import { InputType, ReturnType } from "./types";

import { v4 as uuidv4 } from 'uuid';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { _id, boardId } = data;
  let list;

  try {

    const query = `*[_type == 'list' && _id == '${_id}' && boardId == '${boardId}'] | order(order asc) [0] {
      _id,
      title,
      boardId,
      order,
      cards,
      createdAt
    }`;

    // Execute the query with the specified parameters
    const listToCopy = await sanityClient.fetch(query, { 
      _id: _id,
      boardId: boardId
    });

    if (!listToCopy) {
      return { error: "List not found" };
    }

    const lastList = await sanityClient.fetch(`*[_type == 'list' && boardId == '${boardId}'] | order(order desc) [0]`, {boardId: boardId});

    const newOrder = lastList ? lastList.order + 1 : 1;

    const copiedCards = [...(listToCopy?.cards || [])];

    list = await sanityClient.create({
      _type: 'list',
      boardId: listToCopy.boardId,
      title: `${listToCopy.title} - Copy`,
      order: newOrder,
      cards: copiedCards,
      createdAt: new Date().toISOString()
    });

    await createAuditLog({
      entityTitle: list.title,
      entityId: list._id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });

  } catch (error) {
    console.log(error);
    return {
      error: "Failed to copy."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);