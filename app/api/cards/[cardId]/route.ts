import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import sanityClient from "@/lib/sanityClient";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {

    const { userId, orgId } = auth();

    const {cardId} = params;

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cardQuery = `*[_type == "card" && _id == "${cardId}"][0]`;
    const card = await sanityClient.fetch(cardQuery);


   
    return NextResponse.json(card);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}