import { useNavigate, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useServerRequest } from "../../hooks";
import { addProject, updateProject } from '../../store/slices/projects-slice';
import { Loader, AuthFormError, Button } from "../../components";
import styled from "styled-components";

const schema = yup.object({
  name: yup
    .string()
    .required('Название обязательно')
    .min(3, 'Название должно быть минимум 3 символа')
    .max(50, 'Название не должно превышать 50 символов'),
  description: yup.string().max(500, 'Описание не должно превышать 500 символов'),
});

const Container = styled.div`
  animation: fadeIn 0.3s ease-out;
  max-width: 600px;
  margin: 0 auto;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.cardBg};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-align: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Input = styled.input`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const SubmitButton = styled(Button)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.success};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.success};
    filter: brightness(1.1);
  }
`;

const CancelButton = styled(Button)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.secondary};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    filter: brightness(0.9);
  }
`;

const ErrorMessage = styled(AuthFormError)`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
`;

const ProjectFormContainer = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const request = useServerRequest();
  const { projects } = useSelector(state => state.projects);
  const [isSaving, setIsSaving] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '' },
  });

  const descriptionValue = watch('description', '');

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
    setIsSaving(true);
    const result = isEditing
      ? await request('updateProject', id, data)
      : await request('addProject', data);
    setIsSaving(false);

    if (!result.error) {
      const action = isEditing ? updateProject(result.res) : addProject(result.res);
      dispatch(action);
      navigate('/projects');
    } else {
      alert(result.error);
    }
  };

  if (isSaving) return <Loader />;

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title>{isEditing ? '✏️ Редактирование проекта' : '📁 Новый проект'}</Title>
        
        <FormGroup>
          <Label>Название проекта *</Label>
          <Input 
            {...register('name')} 
            placeholder="Введите название проекта"
            autoFocus
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Описание (необязательно)</Label>
          <Textarea 
            {...register('description')} 
            placeholder="Опишите, над чем будете работать..."
          />
          <small style={{ 
            display: 'block', 
            marginTop: '4px',
            color: descriptionValue.length > 500 ? 'red' : '#64748b',
            fontSize: '0.75rem'
          }}>
            {descriptionValue.length}/500 символов
            {descriptionValue.length > 500 && ' (превышено!)'}
          </small>
          {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
        </FormGroup>

        <ButtonGroup>
          <SubmitButton type="submit">
            {isEditing ? '💾 Сохранить' : '✨ Создать'}
          </SubmitButton>
          <CancelButton type="button" onClick={() => navigate('/projects')} variant="secondary">
            ❌ Отмена
          </CancelButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export const ProjectForm = styled(ProjectFormContainer)``;