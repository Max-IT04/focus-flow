export const deleteSession = async (sessionId) =>
	fetch(`http://localhost:3003/users/sessions/${sessionId}`, {
		method: 'DELETE',
	});



