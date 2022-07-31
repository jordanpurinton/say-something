import {
  ActionIcon,
  Burger,
  Header as MantineHeader,
  Loader,
  MediaQuery,
  Title,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { Moon, Sun } from 'tabler-icons-react';
import { useIsChangingPage } from '../../context/AppContext';
import styles from '../../styles/Header.module.scss';

interface HeaderProps {
  navbarIsOpen: boolean;
  setNavbarIsOpen: (navbarIsOpen: boolean) => void;
  selectedTheme: 'light' | 'dark';
  setSelectedTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
}

export const Header: FC<HeaderProps> = ({
  navbarIsOpen,
  setNavbarIsOpen,
  selectedTheme,
  setSelectedTheme,
}) => {
  const { isChangingPage } = useIsChangingPage();
  const { status } = useSession();

  const handleThemeChange = useCallback(() => {
    setSelectedTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setSelectedTheme]);

  if (status !== 'authenticated') {
    return null;
  }

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
        {isChangingPage && (
          <div style={{ marginLeft: '1em', marginTop: '0.55em' }}>
            <Loader color="white" />
          </div>
        )}
      </div>
      <div className={styles.themeToggle}>
        <ActionIcon
          onClick={() => handleThemeChange()}
          color={selectedTheme === 'light' ? 'dark' : 'yellow'}
        >
          {selectedTheme === 'light' ? <Moon /> : <Sun />}
        </ActionIcon>
      </div>
    </MantineHeader>
  );
};

export default Header;
