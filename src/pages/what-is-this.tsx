import { Container, List, Space, Text, Title } from '@mantine/core';
import { NextPage } from 'next';

const WhatIsThis: NextPage = () => {
  return (
    <>
      <Container size="sm" px="sm">
        <Title order={3}>What is this? 🤔</Title>
        <Space h="md" />
        <Text>
          Simply put, this is a rehash of an old project that I had worked on
          back in college.
        </Text>
      </Container>

      <Space h="xl" />
      <Space h="xl" />

      <Container size="sm" px="sm">
        <Title order={3}>What does it do?</Title>
        <Space h="md" />
        <List>
          <Text weight="bold">
            <List.Item>Sending Messages</List.Item>
          </Text>
          <Space h="md" />
          <Text>
            If you click the &quot;Send Message&quot; button on the home page,
            it will send the message to our backend and store the message. This
            message has the potential to be viewed by anyone. No personal data
            is available to the person who reads your message outside of the
            message content, the number of views a message has, your selected
            nickname, the date is was sent and the number of upvotes your
            message has.
          </Text>
          <Space h="md" />
          <Text weight="bold">
            <List.Item>Viewing Messages</List.Item>
          </Text>
          <Space h="md" />
          <Text>
            If you click the &quot;View Messages&quot; button on the home page,
            it will show you a random message that has been sent by a user. You
            will then have the chance to upvote or downvote the message if you
            so choose.
          </Text>
          <Space h="md" />
          <Text weight="bold">
            <List.Item>Message History</List.Item>
          </Text>
          <Space h="md" />
          <Text>
            There are pages for &quot;Send History&quot; and &quot;View
            History&quot;. On these pages you can view all the messages you have
            sent and viewed. In addition, you can track how many views, upvotes
            and downvotes the messages have gotten.
          </Text>
          <Space h="md" />
          <Text weight="bold">
            <List.Item>Delete Your Account</List.Item>
          </Text>
          <Space h="md" />
          <Text>
            Think this stinks? Hey, no skin off my back. Feel free to delete
            your account by going to your Profile page using the navbar.
          </Text>
        </List>
      </Container>

      <Space h="xl" />
      <Space h="xl" />

      <Container size="sm" px="sm">
        <Title order={3}>Finally,</Title>
        <Space h="md" />
        <Text>
          Hope you enjoy 🙂
          <Space h="md" />
          Please try and be nice when messaging.
        </Text>
      </Container>
    </>
  );
};

export default WhatIsThis;
