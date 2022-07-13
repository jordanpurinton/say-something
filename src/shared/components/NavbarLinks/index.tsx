import React, { FC, useCallback } from 'react';
import { Home, InfoCircle, Message } from 'tabler-icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import Avatar from '../Avatar';
import { useRouter } from 'next/router';
import { useIsChangingPage } from '../../context/AppContext';

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
  const router = useRouter();
  const { setIsChangingPage } = useIsChangingPage();
  const handleClick = useCallback(async () => {
    setIsChangingPage(true);
    setNavbarIsOpen(false);
    await router.push(url);
    setIsChangingPage(false);
  }, [setIsChangingPage, setNavbarIsOpen, router, url]);

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
          <ThemeIcon color={color} size="xl" variant="light">
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

const data: {
  icon: JSX.Element;
  color: string;
  label: string;
  url: string;
}[] = [
  { icon: <Home size={24} />, color: 'blue', label: 'Home', url: '/' },
  {
    icon: <Message size={24} />,
    color: 'teal',
    label: 'Send history',
    url: '/send-history',
  },
  {
    icon: <Message size={24} />,
    color: 'violet',
    label: 'View history',
    url: '/view-history',
  },
  {
    icon: <InfoCircle size={24} />,
    color: 'orange',
    label: 'What is this?',
    url: '/what-is-this',
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
