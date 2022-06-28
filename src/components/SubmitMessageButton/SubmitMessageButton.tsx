import { FC, useCallback } from "react";
import { Button } from "@mantine/core";
import { Message } from "tabler-icons-react";
import { trpc } from "../../utils/trpc";

const SubmitMessageButton: FC = () => {
  const createMessageMutation = trpc.useMutation("create-message");

  const handleClick = useCallback(async () => {
    createMessageMutation.mutate({
      content: "hello world",
      views: 0,
      sentBy: "Jordan Purinton",
    });
  }, [createMessageMutation]);

  return (
    <Button onClick={handleClick} size="md" rightIcon={<Message />}>
      Submit
    </Button>
  );
};

export default SubmitMessageButton;
