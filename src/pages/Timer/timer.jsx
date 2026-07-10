import { useDispatch, useSelector } from "react-redux";
import { useServerRequest } from "../../hooks";
import { useEffect } from "react";
import { 
  pauseTimer, 
  resetTimer, 
  setCurrentProject, 
  startTimer, 
  tick,
  loadTimerState,
  restoreTimer,
  syncTimer
} from "../../store/slices/timer-slice";
import { setProjects, setLoading } from "../../store/slices/projects-slice";
import { setSessions, addSession, setLoading as setSessionsLoading } from '../../store/slices/time-sessions-slice';
import { Card, H2, Loader, Button } from "../../components";
import styled from "styled-components";

const TimerContainer = () => {
  const dispatch = useDispatch();
  const request = useServerRequest();
  const { projects, loading } = useSelector(state => state.projects);
  const { currentProjectId, isRunning, seconds } = useSelector(state => state.timer);
  const { user } = useSelector(state => state.user);
  const { sessions, loading: sessionsLoading } = useSelector(state => state.timeSessions);
  const { startTime } = useSelector(state => state.timer);

  // для восстановления из localStorage
  useEffect(() => {
    const savedState = loadTimerState();
    if (savedState) {
      dispatch(restoreTimer(savedState));
    }
  }, [dispatch]);

  // для tick
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // для загрузки проектов
  useEffect(() => {
    if (projects.length === 0) {
      dispatch(setLoading(true));
      request('fetchProjects', user?.id).then(({ error, res }) => {
        if (!error) {
          dispatch(setProjects(res));
        }
        dispatch(setLoading(false));
      });
    }
  }, [dispatch, request, projects.length, user?.id]);

  // для загрузки замеров
  useEffect(() => {
    if (currentProjectId) {
      dispatch(setSessionsLoading(true));
      request('fetchTimeSessions', user?.id).then(({ error, res }) => {
        if (!error) {
          const projectSessions = res.filter(s => s.project_id == currentProjectId);
          dispatch(setSessions(projectSessions));
        }
        dispatch(setSessionsLoading(false));
      });
    }
  }, [currentProjectId, dispatch, request, user?.id]);

  // visibilitychange
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isRunning && startTime) {
        const now = Date.now();
        const expectedSeconds = Math.floor((now - startTime) / 1000);
        if (Math.abs(seconds - expectedSeconds) > 1) {
          dispatch(syncTimer(expectedSeconds));
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, startTime, seconds, dispatch]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = 'Таймер ещё работает. Вы уверены, что хотите закрыть страницу?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60; 
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

const saveTimeSession = async () => {
  if (seconds === 0) return;

  const result = await request('addTimeSession', {
    project_id: currentProjectId || null,
    duration: seconds,
    start_time: new Date(Date.now() - seconds * 1000).toISOString(),
    end_time: new Date().toISOString(),
  });

  if (!result.error) {
    dispatch(addSession(result.res));
    dispatch(resetTimer());
    alert('Время сохранено');
  }
};

  if (loading && projects.length === 0) return <Loader />;

  return (
    <TimerWrapper className="fade-in">
      <H2>Таймер</H2>

      <TimerCard>
        <SelectContainer>
          <StyledSelect 
            onChange={(e) => dispatch(setCurrentProject(e.target.value))} 
            value={currentProjectId || ''}
          >
            <option value="">Выберите проект</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </StyledSelect>
        </SelectContainer>

        <TimerDisplay>
          {formatTime(seconds)}
        </TimerDisplay>

        <ButtonGroup>
          <Button 
            onClick={() => dispatch(startTimer())} 
            disabled={!currentProjectId || isRunning}
            variant="primary"
          >
            ▶ Старт
          </Button>
          <Button 
            onClick={() => dispatch(pauseTimer())} 
            disabled={!isRunning}
            variant="secondary"
          >
            ⏸ Пауза
          </Button>
          <Button 
            onClick={saveTimeSession} 
            disabled={seconds === 0}
            variant="success"
          >
            💾 Сохранить
          </Button>
          <Button 
            onClick={() => dispatch(resetTimer())}
            variant="danger"
          >
            ⟳ Сброс
          </Button>
        </ButtonGroup>

        {!currentProjectId && (
          <InfoText>⚠️ Выберите проект, чтобы начать работу</InfoText>
        )}
      </TimerCard>

      <SessionsSection>
        <SectionTitle>Замеры времени</SectionTitle>
        {sessionsLoading ? (
          <Loader />
        ) : (
          <SessionsList>
            {sessions.length > 0 ? (
              sessions.map(session => (
                <SessionItem key={session.id}>
                  <SessionDate>
                    📅 {new Date(session.start_time).toLocaleString('ru-RU')}
                  </SessionDate>
                  <SessionDuration>
                    ⏱ {Math.floor(session.duration / 60)} мин {session.duration % 60} сек
                  </SessionDuration>
                </SessionItem>
              ))
            ) : (
              <EmptyState>
                {currentProjectId 
                  ? 'Нет замеров для этого проекта. Запустите таймер и сохраните результат!' 
                  : 'Выберите проект, чтобы увидеть замеры времени'}
              </EmptyState>
            )}
          </SessionsList>
        )}
      </SessionsSection>
    </TimerWrapper>
  );
};

export const Timer = TimerContainer;

// ========== СТИЛИ ==========

const TimerWrapper = styled.div`
  animation: fadeIn 0.3s ease-out;
`;

const TimerCard = styled(Card)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  margin-left: auto;    
  margin-right: auto;   
  max-width: 800px;     
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.cardBg} 0%, 
  ${({ theme }) => theme.colors.surface} 100%);
`;

const TimerDisplay = styled.div`
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  margin: ${({ theme }) => theme.spacing.xl} 0;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 4px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
    margin: ${({ theme }) => theme.spacing.lg} 0;
  }
`;

const SelectContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: center;
  width: 100%;
`;

// Это и есть сам select
const StyledSelect = styled.select`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.inputBg};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const SessionsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  display: inline-block;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const SessionItem = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    transform: translateX(4px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const SessionDate = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const SessionDuration = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.125rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
`;