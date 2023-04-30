import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { TasksContext } from './task-context';
import  { fetchSchedules } from '../util/http';

export const ScheduleContext = createContext({
  schedules: {},
  addTask: ({ date, title, deadline, duration, frequency, type, priority, weather, notes, importance }) => {},
  setTasks: (date, tasks) => {},
  deleteTask: (date, id) => {},
  updateTask: (date, id, { title, deadline, duration, frequency, type, priority, weather, notes, importance }) => {},
  setFromFirebase: (date, tasks) => {},
});

function scheduleReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      const { date, taskData } = action.payload;
      return {
        ...state,
        [date]: [taskData, ...(state[date] || [])],
      };
    case 'SET':
      return {
        ...state,
        [action.payload.date]: action.payload.tasks,
      };
    case 'UPDATE':
      const { date: updateDate, id: updateId, taskData: updateTaskData } = action.payload;
      const updateSchedule = state[updateDate];
      const updateIndex = updateSchedule.findIndex((task) => task.id === updateId);
      const updatedTask = { ...updateSchedule[updateIndex], ...updateTaskData };
      const updatedSchedule = [...updateSchedule];
      updatedSchedule[updateIndex] = updatedTask;
      return {
        ...state,
        [updateDate]: updatedSchedule,
      };
    case 'DELETE':
      const { date: deleteDate, id: deleteId } = action.payload;
      const deleteSchedule = state[deleteDate];
      const deleteTasks = deleteSchedule.filter((task) => task.id !== deleteId);
      return {
        ...state,
        [deleteDate]: deleteTasks,
      };
      case 'SET_FROM_DATABASE':
        return {
          ...state,
          [action.payload.date]: action.payload.tasks,
        };
    default:
      return state;
  }
}

function ScheduleContextProvider({ children }) {
  const [scheduleState, dispatch] = useReducer(scheduleReducer, {});
  const { tasks, setTask } = useContext(TasksContext);
 // const [schedules, setSchedules] = useState({});


  useEffect(() => {
    const scheduledTasks = Object.values(scheduleState).flat();
    const newTasks = tasks.filter(task => !scheduledTasks.some(scheduledTask => scheduledTask.id === task.id));
    setTask(newTasks);
  }, [scheduleState]);


  function addTask(taskData) {
    const { date } = taskData;
    dispatch({ type: 'ADD', payload: { date, taskData } });
  }

  function setTasks(date, tasks) {
    const existingTasks = scheduleState[date] || [];
    const updatedTasks = [...existingTasks, ...tasks];
    console.log("ScheduleContext - Updated schedule tasks", date, "|", updatedTasks)
    dispatch({ type: 'SET', payload: { date, tasks: updatedTasks } });
  }
  

  function deleteTask(date, id) {
    dispatch({ type: 'DELETE', payload: { date, id } });
  }

  function updateTask(date, id, taskData) {
    dispatch({ type: 'UPDATE', payload: { date, id, taskData } });
  }

  function setTasksFromDatabase(date, tasks) {
    const existingTasks = scheduleState[date] || [];
    const updatedTasks = tasks.filter(task => !existingTasks.some(existingTask => existingTask.id === task.id));
    const allTasks = [...existingTasks, ...updatedTasks];
    dispatch({ type: 'SET_FROM_DATABASE', payload: { date, tasks: allTasks } });
  }
  
  
  
  
  

  

  const value = {
    schedules: scheduleState,
    setTasks: setTasks,
    addTask: addTask,
    deleteTask: deleteTask,
    updateTask: updateTask,
    setTasksFromDatabase: setTasksFromDatabase,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}

export default ScheduleContextProvider;
