"use client";

import { toast } from "sonner";
import { List } from "@/models/typings";
import { ElementRef, useRef } from "react";
import { MoreHorizontal, X } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
  boardId: string;
};

export const ListOptions = ({
  data,
  onAddCard,
  boardId
}: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List was deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const onDelete = (formData: FormData) => {
    const _id = formData.get("id") as string;
    // const boardId = formData.get("boardId") as string;
    executeDelete({ _id, boardId });
  };

  const onCopy = (formData: FormData) => {
    const _id = formData.get("id") as string;
    // const boardId = formData.get("boardId") as string;

    executeCopy({ _id, boardId });
  };


 
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card...
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" value={data._id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <Button
            type="submit"
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy list...
          </Button>
        </form>
        <Separator />
        <form
          action={onDelete}
        >
          <input hidden name="id" id="id" value={data._id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <Button
            type="submit"
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Delete this list
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};