"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import sanityClient from "@/lib/sanityClient";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateBoard } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/models/typings";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, _id } = data;
  let board;

  try {

    board = await sanityClient.patch(_id).set({
      title,
      updatedAt: new Date().toISOString()
    }).commit();

    await createAuditLog({
      entityTitle: board.title,
      entityId: board._id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.UPDATE,
    })
  } catch (error) {
    return {
      error: "Failed to update."
    }
  }

  revalidatePath(`/board/${_id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);