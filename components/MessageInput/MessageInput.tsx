import { FC, ChangeEvent, useState } from "react";
import { Input } from "@mantine/core";
import { Message } from "tabler-icons-react";
import styles from "./MessageInput.module.scss";

const MessageInput: FC = () => {
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState("");

  return (
    <Input
      className={styles.messageInput}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setMessage(e.target.value)
      }
      placeholder="Enter a message..."
      icon={<Message />}
    />
  );
};

export default MessageInput;
