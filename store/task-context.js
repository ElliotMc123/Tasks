import { createContext, useContext, useReducer } from 'react';

export const TasksContext = createContext({
  tasks: [],
  addTask: ({ title, deadline, duration, frequency, type, priority, weather, notes, importance }) => {},
  setTask: (tasks) => {},
  deleteTask: (id) => {},
  updateTask: (id, { title, deadline, duration, frequency, type, priority, weather, notes, importance }) => {},
});


function tasksReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'SET':
      const tasks = action.payload;
      const existingTasks = state.filter(task => !tasks.some(t => t.id === task.id));
      return [...tasks, ...existingTasks];
    case 'UPDATE':
      const updatableTaskIndex = state.findIndex(
        (task) => task.id === action.payload.id
      );
      const updatableTask = state[updatableTaskIndex];
      const updatedItem = { ...updatableTask, ...action.payload.data };
      const updatedTasks = [...state];
      updatedTasks[updatableTaskIndex] = updatedItem;
      return updatedTasks;
    case 'DELETE':
      return state.filter((task) => task.id !== action.payload);
    default:
      return state;
  }
}


  



function TasksContextProvider({ children }) {
  const [tasksState, dispatch] = useReducer(tasksReducer, []);

  function addTask(taskData) {
    dispatch({ type: 'ADD', payload: taskData });
  }

  function setTask(tasks) {
    dispatch({ type: 'SET', payload: tasks });
  }

  function deleteTask(id) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function updateTask(id, taskData) {
    dispatch({ type: 'UPDATE', payload: { id: id, data: taskData } });
  }

  const value = {
    tasks: tasksState,
    setTask: setTask,
    addTask: addTask,
    deleteTask: deleteTask,
    updateTask: updateTask,
  };

  
  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export default TasksContextProvider;