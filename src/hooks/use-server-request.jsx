import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectUserSession } from '../store/slices/user-slice';
import { server } from '../bff';

export const useServerRequest = () => {
	const session = useSelector(selectUserSession);

	return useCallback(
		(operation, ...params) => {
			const request = ['register', 'authorize', 'fetchProjects'].includes(
				operation,
			)
				? params
				: [session, ...params];

			return server[operation](...request);
		},
		[session]
	);
};
