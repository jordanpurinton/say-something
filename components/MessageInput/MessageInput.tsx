import { FC, ChangeEvent, useState } from "react";
import { Textarea } from "@mantine/core";
import styles from "./MessageInput.module.scss";
import { MAX_MESSAGE_LENGTH } from "../../constants/message-input";

const MessageInput: FC = () => {
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState("");

  return (
    <Textarea
      className={styles.messageInput}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        setMessage(e.target.value)
      }
      label={`(${message.length} / ${MAX_MESSAGE_LENGTH})`}
      maxLength={MAX_MESSAGE_LENGTH}
    />
  );
};

export default MessageInput;
