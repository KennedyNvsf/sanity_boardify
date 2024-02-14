import { auth } from "@clerk/nextjs";

import sanityClient from "./sanityClient";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return false;
  }

  const orgSubs_qry = `*[_type == 'orgSubscription' && orgId == '${orgId}'][0]{
    stripeSubscriptionId,
    stripeCurrentPeriodEnd,
    stripeCustomerId,
    stripePriceId
  }`;

  // Execute the query with the specified parameters
  const orgSubscription = await sanityClient.fetch(orgSubs_qry, { orgId });

  if (!orgSubscription) {
    return false;
  }

  // Assuming stripeCurrentPeriodEnd is a datetime string coming from the Sanity document
  const stripeCurrentPeriodEndDateTimeString = orgSubscription.stripeCurrentPeriodEnd;

  // Parse the datetime string into a JavaScript Date object
  const stripeCurrentPeriodEndDate = new Date(stripeCurrentPeriodEndDateTimeString);

  // Check if the parsed date is valid
  const isValidDate = !isNaN(stripeCurrentPeriodEndDate.getTime());

  // Check if stripePriceId is truthy and stripeCurrentPeriodEndDate is a valid Date object
  const isValid = orgSubscription.stripePriceId && isValidDate && stripeCurrentPeriodEndDate.getTime() + DAY_IN_MS > Date.now();

  return !!isValid;

};