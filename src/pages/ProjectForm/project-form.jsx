import { useNavigate, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useServerRequest } from "../../hooks";
import { addProject, updateProject } from '../../store/slices/projects-slice';
import styled from "styled-components";

const schema = yup.object({
  name: yup.string().required('Название обязательно'),
  description: yup.string(), 
}) 

const ProjectFormContainer = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const request = useServerRequest();
  const { projects } = useSelector(state => state.projects);

  const {
    register,
    handleSubmit,
    formState: { errors }, 
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: ''}, 
  });

  useEffect(() => {
    if (isEditing) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setValue('name', project.name);
        setValue('description', project.description);
      }
    }
  }, [isEditing, id, projects, setValue]);

  const onSubmit = async (data) => {
    const result = isEditing
      ? await request('updateProject', id, data)
      : await request('addProject', data);

    if (!result.error) {
      const action = isEditing ? updateProject(result.res) : addProject(result.res);
      dispatch(action);
      navigate('/projects');
    } else {
      alert(result.error);
    } 
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Название проекта" />
      {errors.name && <span>{errors.name.message}</span>}

      <textarea {...register('description')} placeholder="Описание" />

      <button type="submit">{isEditing ? 'Сохранить' : 'Создать'}</button>
      <button type="button" onClick={() => navigate('/projects')}>Отмена</button>
    </form>
  );
};

export const ProjectForm = styled(ProjectFormContainer)`
  & > form {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
`;