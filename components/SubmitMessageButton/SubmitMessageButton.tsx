import { FC, useCallback } from "react";
import { Button } from "@mantine/core";
import { Message } from "tabler-icons-react";
import { asyncHandler } from "../../util";

const SubmitMessageButton: FC = () => {
  const handleClick = useCallback(async () => {
    
    asyncHandler(fetch("/api/createMessage"));
  }, []);

  return (
    <Button onClick={handleClick} size="md" rightIcon={<Message />}>
      Submit
    </Button>
  );
};

export default SubmitMessageButton;
