import { defineField } from "sanity";
import {ActivityIcon} from '@sanity/icons'

const auditLog = {
  name: "auditLog",
  title: "Audit Logs",
  type: "document",
  icon: ActivityIcon,
  fields: [
    defineField({
        name: 'orgId',
        title: 'Organization ID',
        type: 'string',
    }),
    defineField({
        name: 'action',
        title: 'Action',
        type: 'string',
        options: {
          list: ['CREATE', 'UPDATE', 'DELETE'],
        },
    }),
    defineField({
        name: 'entityId',
        title: 'Entity ID',
        type: 'string',
    }),
    defineField({
        name: 'entityType',
        title: 'Entity Type',
        type: 'string',
        options: {
          list: ['BOARD', 'LIST', 'CARD'],
        },
    }),
    defineField({
      name: 'entityTitle',
      title: 'Entity Title',
      type: 'string',
    }),
    defineField({
        name: 'userId',
        title: 'User Id',
        type: 'string',
    }),
    defineField({
        name: 'userImage',
        title: 'User Image',
        type: 'text',
    }),
    defineField({
        name: 'userName',
        title: 'User Name',
        type: 'text',
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

export default auditLog;