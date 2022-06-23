import { FC, ChangeEvent, useState } from "react";
import { Input } from "@mantine/core";
import { Message } from "tabler-icons-react";

const MessageInput: FC = () => {
  const [message, setMessage] = useState("");

  return (
    <Input
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setMessage(e.target.value)
      }
      placeholder="Enter a message..."
      icon={<Message />}
    />
  );
};

export default MessageInput;
