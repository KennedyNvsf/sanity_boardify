"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import sanityClient from "@/lib/sanityClient";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { checkSubscription } from "@/lib/subscription";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/models/typings";


const handler = async (data: InputType): Promise<ReturnType> => {

    const { userId, orgId } = auth();

    if(!userId || !orgId) {
        return {
            error: "Unauthorized"
        };
    }

    const canCreate = await hasAvailableCount();
    const isPro = await checkSubscription();
  
    if (!canCreate && !isPro) {
      return {
        error: "You have reached your limit of free boards. Please upgrade to create more."
      }
    }

    const { title, image } = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split('|');

    if(!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: "Missing fields. Failed to create board"
        }
    }


    let board;

    try {
        board = await sanityClient.create({
            _type: 'board',
            orgId,
            title,
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName,
            createdAt: new Date().toISOString()
        })

        if (!isPro) {
            await incrementAvailableCount();
        }
       
        await createAuditLog({
            entityTitle: board.title,
            entityId: board._id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE,
        })
    } catch (error) {
        return {
            error: "Failed to Create Board."
        }
    }

    revalidatePath(`/board/${board._id}`);
    return {data: board};

};

export const createBoard = createSafeAction(CreateBoard, handler)