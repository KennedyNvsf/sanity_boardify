import { defineField } from "sanity";
import {UlistIcon} from '@sanity/icons';

const list = {
  name: "list",
  title: "Lists",
  type: "document",
  icon: UlistIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
    defineField({
      name: "boardId",
      title: "Board Id",
      type: "string",
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'card' }] }]
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

export default list;