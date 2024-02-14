import { defineField } from "sanity";
import {TiersIcon} from '@sanity/icons';

const orgSubscription = {
  name: "orgSubscription",
  title: "Organization Subscription",
  type: "document",
  icon: TiersIcon,
  fields: [
    defineField({
        name: 'orgId',
        title: 'Organization ID',
        type: 'string',
    }),
    defineField({
        name: 'stripeCustomerId',
        title: 'Stripe Customer ID',
        type: 'string',
        description: 'Stripe Customer ID'
    }),
    defineField({
        name: 'stripeSubscriptionId',
        title: 'Stripe Subscription ID',
        type: 'string',
        description: 'Stripe Subscription ID'
    }),
    defineField({
        name: 'stripePriceId',
        title: 'Stripe Price ID',
        type: 'string',
        description: 'Stripe Price ID'
    }),
    defineField({
        name: 'stripeCurrentPeriodEnd',
        title: 'Stripe Current Period End',
        type: 'datetime',
        description: 'Stripe Current Period End'
    })
  ],
};

export default orgSubscription;