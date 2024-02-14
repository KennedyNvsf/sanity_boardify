import { auth } from "@clerk/nextjs";

import sanityClient from "./sanityClient";
import { MAX_FREE_BOARDS } from "@/constants/boards";

export const incrementAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit_qry = `*[_type == 'orgLimit' && orgId == '${orgId}'][0]`;
  const orgLimit = await sanityClient.fetch(orgLimit_qry, { orgId });

  if (orgLimit) {
    await sanityClient.patch(orgLimit._id)
    .set({
      count: orgLimit.count + 1,
    }).commit();
  } else {
    await sanityClient.create({
        _type: 'orgLimit',
        orgId,
        count: 1
    });
  }
};

export const decreaseAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit_qry = `*[_type == 'orgLimit' && orgId == '${orgId}'][0]`;
  const orgLimit = await sanityClient.fetch(orgLimit_qry, { orgId });

  if (orgLimit) {

    await sanityClient.patch(orgLimit._id)
    .set({
        count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 ,
    }).commit();
  } else {
    await sanityClient.create({
      _type: 'orgLimit',
      orgId,
      count: 1
    });
  }
};

export const hasAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error ("Unauthorized");
  }

  const orgLimit_qry = `*[_type == 'orgLimit' && orgId == '${orgId}'][0]`;
  const orgLimit = await sanityClient.fetch(orgLimit_qry, { orgId });

  if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
    return true;
  } else {
    return false;
  }
};

export const getAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return 0;
  }

  const orgLimit_qry = `*[_type == 'orgLimit' && orgId == '${orgId}'][0]`;
  const orgLimit = await sanityClient.fetch(orgLimit_qry, { orgId });
  
  if (!orgLimit) {
    return 0;
  }

  return orgLimit.count;
};