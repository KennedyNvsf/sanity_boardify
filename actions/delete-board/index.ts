"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import sanityClient from "@/lib/sanityClient";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/models/typings";
import { decreaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const isPro = await checkSubscription();

  const { _id } = data;
  let board;

  try {

    const currentBoard = await sanityClient.getDocument(_id);

    // @ts-ignore
    await sanityClient.createOrReplace<Board>({
      ...currentBoard,
      lists: [],
      updatedAt: new Date().toISOString(),
    });

    const query = `*[_type == 'list' && boardId == '${_id}'] | order(order asc) {
      _id,
      title,
      order,
      cards[] {
        _id,
        title,
        order
      }
    }`;
  
    // Execute the query with the specified parameters
    const lists = await sanityClient.fetch(query, { boardId: _id });

    lists.forEach(async (list: any) => {
      await sanityClient.delete(list._id);
    });
    

    board = await sanityClient.delete(_id);

    if (!isPro) {
      await decreaseAvailableCount();
    }

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });

  } catch (error) {
    console.log(error);
    return {
      error: "Failed to delete."
    }
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
  
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);