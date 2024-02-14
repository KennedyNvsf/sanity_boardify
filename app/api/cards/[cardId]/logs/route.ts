import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import sanityClient from "@/lib/sanityClient";

export async function GET(
  request: Request,
  { params }: { params: { cardId: string } }
) {
  try {

    const { userId, orgId } = auth();
    const {cardId} = params;

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const auditLogs_qry = `*[_type == 'auditLog' && entityId == '${cardId}' && entityType == 'CARD'][0..2] | order(createdAt desc)`
    const auditLogs = await sanityClient.fetch(auditLogs_qry)
    
    return NextResponse.json(auditLogs);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};