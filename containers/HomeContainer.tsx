import { Container } from "@mantine/core";
import { FC, ReactNode } from "react";

interface HomeContainerProps {
  children: ReactNode;
}

const HomeContainer: FC<HomeContainerProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default HomeContainer;
