import { setProjects, setLoading, removeProject } from "../../store/slices/projects-slice";
import { useDispatch, useSelector } from "react-redux";
import { useServerRequest } from "../../hooks";
import { useEffect } from "react";
import { H2 } from '../../components';
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader/loader";

export const Projects = () => {
  const dispatch = useDispatch();
  const request = useServerRequest();
  const { projects, loading } = useSelector(state => state.projects);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setLoading(true));
    request('fetchProjects').then(({ error, res }) => {
      if (!error) {
        dispatch(setProjects(res));
      }
      dispatch(setLoading(false));
    });
  }, [dispatch, request]);

  if (loading) return <Loader />;

  const handleDelete = async (id) => {
    if (window.confirm('Удалить проект?')) {
      const result = await request('removeProject', id);
      if (!result.error) {
        dispatch(removeProject(id));
      } else {
        alert(result.error);
      }
    }
  }

  return (
    <div>
      <button onClick={() => navigate('/projects/new')}>Создать проект</button>
      <H2>Мои проекты</H2>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <button onClick={() => navigate(`/projects/${project.id}`)}>Редактировать</button>
          <button onClick={() => handleDelete(project.id)}>Удалить</button>
        </div>
      ))}
    </div>
  )
}

// НАПИСАТЬ СТИЛИ

// export const Projects = styled(ProjectsContainer)`
//   display: flex;
// `;