import { z } from "zod";
import { Card } from "@/models/typings";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteCard } from "./schema";

export type InputType = z.infer<typeof DeleteCard>;
export type ReturnType = ActionState<InputType, Card>;