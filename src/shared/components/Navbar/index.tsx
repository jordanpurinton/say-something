import { Navbar as MantineNavbar } from '@mantine/core';
import { FC } from 'react';
import NavbarLinks from '../NavbarLinks';

interface NavbarProps {
  navbarIsOpen: boolean;
  setNavbarIsOpen: (navbarIsOpen: boolean) => void;
}

const Navbar: FC<NavbarProps> = ({ navbarIsOpen, setNavbarIsOpen }) => {
  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!navbarIsOpen}
      width={{ sm: 200, lg: 200 }}
    >
      <NavbarLinks setNavbarIsOpen={setNavbarIsOpen} />
    </MantineNavbar>
  );
};

export default Navbar;
