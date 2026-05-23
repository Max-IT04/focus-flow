import { useDispatch, useSelector } from "react-redux";
import { useServerRequest } from "../../hooks";
import { use, useEffect } from "react";
import { pauseTimer, resetTimer, setCurrentProject, startTimer, tick } from "../../store/slices/timer-slice";
import { setProjects, setLoading } from "../../store/slices/projects-slice";
import { setSessions, addSession, setLoading as setSessionsLoading } from '../../store/slices/time-sessions-slice';
import { loadTimerState, restoreTimer } from '../../store/slices/timer-slice';
import { H2, Loader } from "../../components";
import { syncTimer } from '../../store/slices/timer-slice';
import styled from "styled-components";

const TimerContainer = () => {
  const dispatch = useDispatch();
  const request = useServerRequest();
  const { projects, loading } = useSelector(state => state.projects);
  const { currentProjectId, isRunning, seconds } = useSelector(state => state.timer);
  const { session, user } = useSelector(state => state.user);
  const { sessions } = useSelector(state => state.timeSessions);
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
      request('fetchProjects').then(({ error, res }) => {
        if (!error) {
          dispatch(setProjects(res));
        }
        dispatch(setLoading(false));
      });
    }
  }, [dispatch, request, projects.length]);

  // для загрузки замеров
  useEffect(() => {
    if (currentProjectId) {
      dispatch(setSessionsLoading(true));
      request('fetchTimeSessions').then(({ error, res }) => {
        if (!error) {
          const projectSessions = res.filter(s => s.projectId === currentProjectId);
          dispatch(setSessions(projectSessions));
        }
        dispatch(setSessionsLoading(false));
      });
    }
  }, [currentProjectId]);

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
  }, [isRunning, startTime, seconds]);

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
      projectId: currentProjectId,
      userId: user?.id,
      duration: seconds,
      startTime: new Date(Date.now() - seconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
    });

    if (!result.error) {
      dispatch(addSession(result.res));
      dispatch(resetTimer());
      alert('Время сохранено');
    }
  };

  if (loading && projects.length === 0) return <Loader />

  return (
    <div>
      <H2>Таймер</H2>

      <select onChange={(e) => dispatch(setCurrentProject(e.target.value))} value={currentProjectId || ''}>
        <option value="">Выберите проект</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>

      <div>
        {formatTime(seconds)}
      </div>

      <div>
        <button onClick={() => dispatch(startTimer())} disabled={!currentProjectId || isRunning}>
          Старт
        </button>
        <button onClick={() => dispatch(pauseTimer())} disabled={!isRunning}>
          Пауза
        </button>
        <button onClick={saveTimeSession} disabled={seconds === 0}>Сохранить</button>
        <button onClick={() => dispatch(resetTimer())}>Сброс</button>
      </div>

      <div>
        <h3>Замеры времени</h3>
        {sessions.map(session => (
          <div key={session.id}>
            {new Date(session.startTime).toLocaleString()} : 
            {Math.floor(session.duration / 60)} мин {session.duration % 60} сек
          </div>
        ))}
      </div>
    </div>
  )
};

export const Timer = styled(TimerContainer)`

`;