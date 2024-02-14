import { defineField } from "sanity";
import {FilterIcon} from '@sanity/icons'

const orgLimit = {
  name: "orgLimit",
  title: "Organization Limit",
  type: "document",
  icon: FilterIcon,
  fields: [
    defineField({
      name: 'orgId',
      title: 'Organization ID',
      type: 'string',
    }),
    defineField({
      name: 'count',
      title: 'Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    })
  ],
};

export default orgLimit;