import {
  Burger,
  Header as MantineHeader,
  MediaQuery,
  Title,
} from '@mantine/core';
import React, { FC } from 'react';
import styles from '../../styles/Header.module.scss';

interface HeaderProps {
  navbarIsOpen: boolean;
  setNavbarIsOpen: (navbarIsOpen: boolean) => void;
}

export const Header: FC<HeaderProps> = ({ navbarIsOpen, setNavbarIsOpen }) => {
  return (
    <MantineHeader className={styles.header} height={60} p="xs">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={navbarIsOpen}
            onClick={() => setNavbarIsOpen(!navbarIsOpen)}
            size="sm"
            color="white"
            mr="xl"
          />
        </MediaQuery>
        <Title order={2}>Say Something</Title>
      </div>
    </MantineHeader>
  );
};

export default Header;
