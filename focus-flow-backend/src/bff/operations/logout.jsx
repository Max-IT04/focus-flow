export const logout = async () => {
  localStorage.removeItem('token');
  return { error: null, res: null };
};

// import { sessions } from '../sessions';

// export const logout = async (sessionId) => {
// 	const response = await fetch(`http://localhost:3001/sessions?hash=${sessionId}`);
// 	const sessions = await response.json();
// 	const session = sessions[0];

// 	if (session) {
// 		await fetch(`http://localhost:3001/sessions/${session.id}`, {
// 			method: 'DELETE',
// 		});
// 	}

// 	return { error: null, res: null };
// };
