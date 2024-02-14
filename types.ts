import { Card, List } from "./models/typings";

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { list: List };