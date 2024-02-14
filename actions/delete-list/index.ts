"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import sanityClient from "@/lib/sanityClient";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteList } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, Board, ENTITY_TYPE, List } from "@/models/typings";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { _id, boardId } = data;
  let list: List;

  try {

      
    const currentBoard = await sanityClient.getDocument<Board>(boardId);

    if (!currentBoard) {
      console.log('no board found')
    }

    // Filter out the list to be deleted
    const updatedLists= (currentBoard?.lists || []).filter(
      list => list._ref !== _id
    );

    // Update the board document in Sanity
    // @ts-ignore
    await sanityClient.createOrReplace<Board>({
      ...currentBoard,
      lists: updatedLists,
      updatedAt: new Date().toISOString(),
    });
    

    // Delete the list document
    list = await sanityClient.delete(_id);

    await createAuditLog({
      entityTitle: list.title,
      entityId: list._id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
    })
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to delete."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);