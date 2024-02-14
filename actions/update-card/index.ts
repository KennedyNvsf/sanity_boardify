"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import sanityClient from "@/lib/sanityClient";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateCard } from "./schema";
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

  const { _id, boardId, ...values } = data;
  let card: any;

  try {

    card = await sanityClient.patch(_id).set({
      ...values,
      updatedAt: new Date().toISOString()
    }).commit();


    await createAuditLog({
      entityTitle: card.title,
      entityId: card._id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
    })
  } catch (error) {
    return {
      error: "Failed to update."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);