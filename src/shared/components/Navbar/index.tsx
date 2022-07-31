import { Navbar as MantineNavbar } from '@mantine/core';
import { FC } from 'react';
import NavbarLinks from '../NavbarLinks';
import styles from '../../styles/Navbar.module.scss';
import { useSession } from 'next-auth/react';

interface NavbarProps {
  navbarIsOpen: boolean;
  setNavbarIsOpen: (navbarIsOpen: boolean) => void;
}

const Navbar: FC<NavbarProps> = ({ navbarIsOpen, setNavbarIsOpen }) => {
  const { status } = useSession();

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <MantineNavbar
      className={styles.navbar}
      hidden={!navbarIsOpen}
      width={{ sm: 150, lg: 150 }}
      hiddenBreakpoint="sm"
      p="md"
    >
      <NavbarLinks setNavbarIsOpen={setNavbarIsOpen} />
    </MantineNavbar>
  );
};

export default Navbar;
