import { signIn, getSession, getProviders } from 'next-auth/react';
import { CommonProviderOptions } from 'next-auth/providers';
import { GetServerSidePropsContext, NextPage } from 'next';
import { Button, Container, Space, Text, Title } from '@mantine/core';
import styles from '../../shared/styles/SignIn.module.scss';

const SignIn: NextPage<{
  providers: Record<string, CommonProviderOptions>;
}> = ({ providers }) => {
  const auth0 = providers?.auth0 || null;

  if (!auth0) {
    return null;
  }

  return (
    <Container className={styles.container}>
      <Title order={2}>Say Something</Title>
      <Space h="xl" />
      <Button
        onClick={() => signIn(auth0.id)}
        size="lg"
        color="indigo"
        variant="light"
      >
        Sign In
      </Button>
      <Space h="xl" />
      <Space h="xl" />
      <Text size="sm">
        If this is your first time, you will be prompted to create a new account
      </Text>
    </Container>
  );
};

export default SignIn;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: '/' },
    };
  }

  return {
    props: {
      providers: await getProviders(),
    },
  };
}
