import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import sanityClient from "@/lib/sanityClient";

import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
};

const BoardIdPage = async ({
  params,
}: BoardIdPageProps) => {

  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const {boardId} = params

  const query = `*[_type == 'list' && boardId == '${boardId}'] | order(order asc) {
    _id,
    title,
    order,
    "cards": cards[]->{  // Use "cards" as a field name
      _id,
      title,
      order,
      description,
      listId,
      createdAt,
      updatedAt
  }
  }`;

  // Execute the query with the specified parameters
  const lists = await sanityClient.fetch(query, { boardId: boardId });
  

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer
        boardId={boardId}
        data={lists}
      />
    </div>
  );
};

export default BoardIdPage;