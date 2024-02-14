import { NextApiRequest } from "next";
import sanityClient from "@/lib/sanityClient";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = async (req: NextApiRequest) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.redirect("/sign-in");
  }

	const {id, firstName, lastName, emailAddresses} = user;
  
  await sanityClient.createIfNotExists({
    _type: "user",
    _id: id,
    firstName,
    lastName,
    email: emailAddresses[0].emailAddress
  })

  const url = "/"
  return NextResponse.redirect(url);
};