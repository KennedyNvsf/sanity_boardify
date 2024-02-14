import { groq } from 'next-sanity';



export const listCards_qry = groq`*[_type == "list" && _id == $listId]{
    _id,
    title,
    order,
    boardId,
    cards[]{
        title
    },
    createdAt,
    updatedAt
}`

export const getCard_qry = groq`*[_type == "card" && _id == $id]{
    _id,
    title,
    description,
    order,
    listId,
    createdAt,
    updatedAt
}`

export const getCardList_qry = groq`*[_type == "list" && cards._id == $id]{
    _id,
    title,
}`



