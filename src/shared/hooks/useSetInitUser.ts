import { SerializedUser } from '../types';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

export const useSetInitUser = (): ((user: SerializedUser) => void) => {
  const router = useRouter();
  const { setUser } = useUser();

  const setInitUser = (user: SerializedUser | undefined): void => {
    try {
      if (user) {
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          viewedMessageIds: user.viewedMessageIds,
          canViewMessageTimestamp: new Date(user.canViewMessageTimestamp),
          canSendMessageTimestamp: new Date(user.canSendMessageTimestamp),
        });
      } else {
        router.push('/api/auth/signin');
      }
    } catch (e) {
      console.error(e);
      router.push('/api/auth/signin');
    }
  };

  return setInitUser;
};
