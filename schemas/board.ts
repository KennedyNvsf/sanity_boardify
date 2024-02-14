import { defineField } from "sanity";
import {DashboardIcon} from '@sanity/icons'

const board = {
  name: "board",
  title: "Boards",
  type: "document",
  icon: DashboardIcon,
  fields: [
    defineField({
      name: "orgId",
      title: "Organization Id",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Organization Title",
      type: "string",
    }),
    defineField({
      name: "imageId",
      title: "Image Id",
      type: "string",
    }),
    defineField({
        name: "imageThumbUrl",
        title: "Image Thumb URL",
        type: "text",
    }),
    defineField({
        name: "imageFullUrl",
        title: "Image Full URL",
        type: "text",
    }),
    defineField({
        name: "imageUserName",
        title: "Image User Name",
        type: "text",
    }),
    defineField({
        name: "imageLinkHTML",
        title: "Image Link Html",
        type: "text",
    }),
    defineField({
      name: 'lists',
      title: 'Lists',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'list' }] }],
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

export default board;