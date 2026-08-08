import { setProjects, setLoading, removeProject } from "../../store/slices/projects-slice";
import { useDispatch, useSelector } from "react-redux";
import { useServerRequest } from "../../hooks";
import { useEffect } from "react";
import { H2, Button } from '../../components';
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader/loader";
import styled from "styled-components";

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
  };

  return (
    <Container>
      <Header>
        <H2>Мои проекты</H2>
        <CreateButton onClick={() => navigate('/projects/new')}>
          + Создать проект
        </CreateButton>
      </Header>

      {projects.length === 0 ? (
        <EmptyState>
          <div>📁</div>
          <p>У вас пока нет проектов</p>
          <Button onClick={() => navigate('/projects/new')}>
            Создать первый проект
          </Button>
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {projects.map(project => (
            <ProjectCard key={project.id}>
              <ProjectName>{project.name}</ProjectName>
              <ProjectDescription>
                {project.description || 'Нет описания'}
              </ProjectDescription>
              <CardFooter>
                <EditButton onClick={() => navigate(`/projects/${project.id}`)}>
                  Редактировать
                </EditButton>
                <DeleteButton onClick={() => handleDelete(project.id)}>
                  Удалить
                </DeleteButton>
              </CardFooter>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}
    </Container>
  );
};


const Container = styled.div`
  animation: fadeIn 0.3s ease-out;
  padding: ${({ theme }) => theme.spacing.md};
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const CreateButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.success};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.success};
    filter: brightness(1.1);
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const ProjectCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.primary}40;
  }
`;

const ProjectName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  word-break: break-word;
`;

const ProjectDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  &:empty {
    display: none;
  }
`;

const CardFooter = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
`;

const EditButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
`;

const DeleteButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.danger};
    filter: brightness(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  svg {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.5;
  }
`;