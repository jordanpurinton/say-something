import { FC, useCallback } from "react";
import { Button } from "@mantine/core";
import { Message } from "tabler-icons-react";
import { trpc } from "../../utils/trpc";

const RandomMessageButton: FC = () => {
  const { data, error, refetch } = trpc.useQuery(["get-random-message"], {
    enabled: false,
  });

  const handleClick = useCallback(async () => refetch(), []);

  return (
    <>
      <Button onClick={handleClick} size="md" rightIcon={<Message />}>
        Random
      </Button>
      {data && (
        <div>
          <h1>{data.message.content}</h1>
          <p>{data.message.sentBy}</p>
        </div>
      )}
    </>
  );
};

export default RandomMessageButton;
