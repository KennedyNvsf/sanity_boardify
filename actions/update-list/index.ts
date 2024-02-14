"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import sanityClient from "@/lib/sanityClient";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateList } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE, List } from "@/models/typings";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, _id, boardId } = data;
  let list: List;

  try {
    list = await sanityClient.patch(_id).set({
        title,
        updatedAt: new Date().toISOString()
    }).commit();

    await createAuditLog({
      entityTitle: list.title,
      entityId: list._id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
    })
  } catch (error) {
    return {
      error: "Failed to update."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);