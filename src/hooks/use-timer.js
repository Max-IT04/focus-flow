import { useDispatch, useSelector } from "react-redux";
import { startTimer, pauseTimer, resetTimer, tick } from '../store/slices/timer-slice';
import { useEffect } from "react";

export const useTimer = () => {
  const dispatch = useDispatch();
  const { isRunning, seconds, currentProjectId} = useSelector(state => state.timer);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleStart = () => dispatch(startTimer());
  const handlePause = () => dispatch(pauseTimer());
  const handleReset = () => dispatch(resetTimer());

  return {
    isRunning,
    seconds,
    currentProjectId,
    startTimer: handleStart,
    pauseTimer: handlePause,
    resetTimer: handleReset,
  };
};