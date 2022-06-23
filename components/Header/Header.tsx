import { FC } from "react";
import { Header as MantineHeader, Title } from "@mantine/core";
import Avatar from "../Avatar";
import styles from "./Header.module.scss";

const Header: FC = () => {
  return (
    <MantineHeader className={styles.header} height={60} p="xs">
      <Title order={2}>Say Something</Title>
      <Avatar />
    </MantineHeader>
  );
};

export default Header;
