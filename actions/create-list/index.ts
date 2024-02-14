"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import sanityClient from "@/lib/sanityClient";
import { createSafeAction } from "@/lib/create-safe-action";

import { CreateList } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, Board, ENTITY_TYPE } from "@/models/typings";

import { v4 as uuidv4 } from 'uuid';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId } = data;
  let list;

  try {
    const board = await sanityClient.fetch(`*[_type == 'board' && _id == '${boardId}' && orgId == '${orgId}'][0]`, {
      boardId: boardId,
      orgId: orgId
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }

    const lastList = await sanityClient.fetch(`*[_type == 'list' && boardId == '${boardId}'] | order(order desc) [0]`, {});

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await sanityClient.create({
      _type: 'list',
      title,
      boardId,
      order: newOrder,
      createdAt: new Date().toISOString()
    });

    const currentBoard = await sanityClient.getDocument<Board>(boardId);

    const updatedLists = [...(currentBoard?.lists || []), {
      _type: 'reference',
      _key: uuidv4(),
      _ref: list._id,
    }];

    await sanityClient.createOrReplace<Board>({
      ...currentBoard,
      // @ts-ignore
      lists: updatedLists,
      updatedAt: new Date().toISOString(),
    });

    await createAuditLog({
      entityTitle: list.title,
      entityId: list._id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    })
  } catch (error) {
    return {
      error: "Failed to create."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const createList = createSafeAction(CreateList, handler);