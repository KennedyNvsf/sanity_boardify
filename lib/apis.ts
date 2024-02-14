import sanityClient from "./sanityClient";
import * as queries from './sanityQueries';
import {  List} from "@/models/typings";
import { CardWithList } from "@/types";


export async function getListCards(listId: string) {
    const result = await sanityClient.fetch<List>(
      queries.listCards_qry,
      {listId},
      {cache: 'no-cache'}
    )
  
    return result;
}

export async function getCard(id: string | undefined) {
  const result = await sanityClient.fetch<CardWithList>(
    queries.getCard_qry,
    {id},
  )

  return result;
}


export async function getCardList(id: string) {
  const result = await sanityClient.fetch<List>(
    queries.getCardList_qry,
    {id}
  )

  return result;
}







