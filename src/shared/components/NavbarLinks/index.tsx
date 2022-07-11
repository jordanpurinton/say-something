import React, { FC } from 'react';
import { Home, Message } from 'tabler-icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import Avatar from '../Avatar';

interface NavBarLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  url: string;
  setNavbarIsOpen: (navbarIsOpen: boolean) => void;
}

const NavBarLink: FC<NavBarLinkProps> = ({
  icon,
  color,
  label,
  url,
  setNavbarIsOpen,
}: NavBarLinkProps) => {
  const handleClick = () => {
    setNavbarIsOpen(false);
    window.location.href = url;
  };

  return (
    <UnstyledButton
      onClick={handleClick}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        {label !== 'Profile' ? (
          <ThemeIcon color={color} size="lg" variant="light">
            {icon}
          </ThemeIcon>
        ) : (
          icon
        )}
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

const data = [
  { icon: <Home size={16} />, color: 'blue', label: 'Home', url: '/' },
  {
    icon: <Message size={16} />,
    color: 'teal',
    label: 'Send History',
    url: '/send-history',
  },
  {
    icon: <Message size={16} />,
    color: 'violet',
    label: 'View History',
    url: '/view-history',
  },
  {
    icon: <Avatar />,
    color: 'grape',
    label: 'Profile',
    url: '/profile',
  },
];

export const NavbarLinks: FC<{
  setNavbarIsOpen: (navbarIsOpen: boolean) => void;
}> = ({ setNavbarIsOpen }) => {
  const links = data.map((link) => (
    <NavBarLink {...link} setNavbarIsOpen={setNavbarIsOpen} key={link.label} />
  ));
  return <div>{links}</div>;
};

export default NavbarLinks;
