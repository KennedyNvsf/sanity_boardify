import { defineField } from "sanity";
import {ProjectsIcon} from '@sanity/icons';

const card = {
  name: "card",
  title: "Cards",
  type: "document",
  icon: ProjectsIcon,
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
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'listId',
      title: 'listId',
      type: 'string',
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

export default card;