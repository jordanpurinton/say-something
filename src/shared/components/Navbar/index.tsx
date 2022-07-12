import { Navbar as MantineNavbar } from '@mantine/core';
import { FC } from 'react';
import NavbarLinks from '../NavbarLinks';
import styles from '../../styles/Navbar.module.scss';

interface NavbarProps {
  navbarIsOpen: boolean;
  setNavbarIsOpen: (navbarIsOpen: boolean) => void;
}

const Navbar: FC<NavbarProps> = ({ navbarIsOpen, setNavbarIsOpen }) => {
  return (
    <MantineNavbar
      className={styles.navbar}
      hidden={!navbarIsOpen}
      width={{ sm: 200, lg: 200 }}
      hiddenBreakpoint="sm"
      p="md"
    >
      <NavbarLinks setNavbarIsOpen={setNavbarIsOpen} />
    </MantineNavbar>
  );
};

export default Navbar;
