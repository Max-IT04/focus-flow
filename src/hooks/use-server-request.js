import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectUserSession } from '../store/slices/user-slice';
import { selectUser } from '../store/slices/user-slice'; // добавить
import { server } from '../bff';

export const useServerRequest = () => {
  const sessionId = useSelector(selectUserSession);
  const user = useSelector(selectUser);

  return useCallback(
    (operation, ...params) => {
      // Операции, которые НЕ требуют сессию
      const noSessionOps = ['register', 'authorize', 'getSession'];
      
      const session = sessionId ? { hash: sessionId, user } : null;
      
      const request = noSessionOps.includes(operation)
        ? params
        : [session, ...params];

      return server[operation](...request);
    },
    [sessionId, user]
  );
};