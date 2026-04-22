export const fetchProjects = async (session) => {
    const response = await fetch('http://localhost:3001/api/projects', {
        headers: {
            'Authorization': session,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Не удалось получить проекты');
    }

    return result;
};