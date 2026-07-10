import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useServerRequest } from "../../hooks";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { setProjects, setLoading as setProjectsLoading } from '../../store/slices/projects-slice';
import { setSessions, setLoading as setSessionsLoading } from '../../store/slices/time-sessions-slice';
import { H2, Button, Input, Loader } from '../../components';
import styled from 'styled-components';


const AnalyticsContainer = () => {
  const dispatch = useDispatch();
  const request = useServerRequest();
  const { projects, loading: projectsLoading } = useSelector(state => state.projects);
  const { sessions, loading: sessionsLoading } = useSelector(state => state.timeSessions);

  const [filterProjectId, setFilterProjectId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const projectStats = projects.map(p => ({
    name: p.name,
    value: sessions.filter(s => s.project_id === p.id).reduce((sum, s) => sum + s.duration, 0) / 3600,
  }));

  const dailyStats = [...sessions].reduce((acc, s) => {
    const date = new Date(s.start_time).toLocaleDateString();
    acc[date] = (acc[date] || 0) + s.duration / 3600;
    return acc;
  }, {});

  const dailyData = Object.entries(dailyStats).map(([date, hours]) => ({ date, hours }));

  useEffect(() => {
    dispatch(setProjectsLoading(true));
    request('fetchProjects').then(({ error, res }) => {
      if (!error) dispatch(setProjects(res));
      dispatch(setProjectsLoading(false));
    });

    dispatch(setSessionsLoading(true));
    request('fetchTimeSessions').then(({ error, res }) => {
      if (!error) dispatch(setSessions(res));
      dispatch(setSessionsLoading(false));
    });
  }, []);

  const filteredSessions = sessions.filter(s => {
    const sessionDate = new Date(s.start_time); 
    
    if (filterProjectId && s.project_id !== filterProjectId) return false;
    if (startDate && sessionDate < new Date(startDate)) return false;
    if (endDate && sessionDate > new Date(endDate)) return false;
    return true; 
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.start_time) - new Date(b.start_time)
        : new Date(b.start_time) - new Date(a.start_time);
    } else {
      return sortOrder === 'asc'
      ? a.duration - b.duration
      : b.duration - a.duration;
    }
  })

  if (projectsLoading || sessionsLoading) return <Loader />

  return (
  <div>
      <H2>Аналитика</H2>

      <StatsContainer>
        <StatCard>
          <StatValue>{sortedSessions.length}</StatValue>
          <StatLabel>Всего замеров</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{Math.floor(sortedSessions.reduce((sum, s) => sum + s.duration, 0) / 3600)} ч</StatValue>
          <StatLabel>Общее время</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{projects.length}</StatValue>
          <StatLabel>Проектов</StatLabel>
        </StatCard>
      </StatsContainer>

      <FiltersContainer>
        <Select value={filterProjectId} onChange={(e) => setFilterProjectId(e.target.value)}>
          <option value="">Все проекты</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Дата от" />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Дата до" />
        
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">По дате</option>
          <option value="duration">По длительности</option>
        </Select>
        
        <Button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </FiltersContainer>

      <ChartsContainer>
        <ChartCard>
          <h4>Время по проектам (часы)</h4>
          <PieChart width={400} height={300}>
            <Pie data={projectStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {projectStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][index % 4]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
        
        <ChartCard>
          <h4>Динамика по дням (часы)</h4>
          <BarChart width={500} height={300} data={dailyData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#3b82f6" />
          </BarChart>
        </ChartCard>
      </ChartsContainer>

      <div>
        <h3>Замеры времени ({sortedSessions.length})</h3>
          {sortedSessions.map(session => {
            const project = projects.find(p => p.id === session.project_id);
            return (
              <SessionCard key={session.id}>
                <div><strong>{project?.name || 'Неизвестный проект'}</strong></div>
                <div>{new Date(session.start_time).toLocaleString()}</div>
                <div>{Math.floor(session.duration / 60)} мин {session.duration % 60} сек</div>
              </SessionCard>
            );
          })}
      </div>
    </div>
  );
};

const StatsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  min-width: 100px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const Select = styled.select`
  padding: 8px 12px;
  // border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
`;

const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
`;

const ChartCard = styled.div`
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const SessionCard = styled.div`
  // background: #f9fafb;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
`;

export const Analytics = styled(AnalyticsContainer)`

`;
