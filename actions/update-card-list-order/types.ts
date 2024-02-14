import { z } from "zod";
import { Card } from "@/models/typings";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateCardListOrder } from "./schema";

export type InputType = z.infer<typeof UpdateCardListOrder>;
export type ReturnType = ActionState<InputType, Card[]>;