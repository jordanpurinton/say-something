import { FC } from "react";
import { Button } from "@mantine/core";
import { Message } from "tabler-icons-react";

const SubmitMessageButton: FC = () => {
  return (
    <Button color="indigo" size="md" rightIcon={<Message />}>
      Submit
    </Button>
  );
};

export default SubmitMessageButton;
