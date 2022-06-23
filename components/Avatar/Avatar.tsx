import { useUser } from "@auth0/nextjs-auth0";
import { Avatar as MantineAvatar } from "@mantine/core";
import { FC } from "react";
import styles from "./Avatar.module.scss";

const Avatar: FC = () => {
  const { user } = useUser();

  return (
    <MantineAvatar className={styles.avatar} src={user?.picture} alt={user?.name as string} size="md" />
  );
};

export default Avatar;
