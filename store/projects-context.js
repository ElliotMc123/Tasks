import { createContext, useContext, useReducer } from 'react';

export const ProjectsContext = createContext({
  projects: [],
  addProjectTask: (projectName, taskData) => {},
  setProjectTasks: (projectName, tasks) => {},
  deleteProjectTask: (projectName, taskId) => {},
  updateProjectTask: (projectName, taskId, taskData) => {},
  addProject: (projectName) => {},
});

function ProjectsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        [action.payload.projectName]: [
          action.payload.taskData,
          ...(state[action.payload.projectName] || []),
        ],
      };
    case 'SET':
      return {
        ...state,
        [action.payload.projectName]: action.payload.tasks,
      };
    case 'UPDATE':
      const projectTasks = state[action.payload.projectName];
      const updatedTaskIndex = projectTasks.findIndex(
        (task) => task.id === action.payload.taskId
      );
      const updatedTask = projectTasks[updatedTaskIndex];
      const updatedItem = { ...updatedTask, ...action.payload.taskData };
      const updatedTasks = [...projectTasks];
      updatedTasks[updatedTaskIndex] = updatedItem;
      return {
        ...state,
        [action.payload.projectName]: updatedTasks,
      };
    case 'DELETE':
      const filteredTasks = state[action.payload.projectName].filter(
        (task) => task.id !== action.payload.taskId
      );
      return {
        ...state,
        [action.payload.projectName]: filteredTasks,
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        [action.payload.projectName]: [],
      };
    default:
      return state;
  }
}


function ProjectsContextProvider({ children }) {
  const [ProjectsState, dispatch] = useReducer(ProjectsReducer, {});

  function addProjectTask(projectName, taskData) {
    dispatch({ type: 'ADD', payload: { projectName, taskData } });
  }

  function setProjectTasks(projectName, tasks) {
    dispatch({ type: 'SET', payload: { projectName, tasks } });
  }

  function deleteProjectTask(projectName, taskId) {
    dispatch({ type: 'DELETE', payload: { projectName, taskId } });
  }

  function updateProjectTask(projectName, taskId, taskData) {
    dispatch({ type: 'UPDATE', payload: { projectName, taskId, taskData } });
  }
  function addProject(projectName) {
    dispatch({ type: 'ADD_PROJECT', payload: { projectName } });
  }

  const value = {
    projects: ProjectsState,
    setProjectTasks: setProjectTasks,
    addProjectTask: addProjectTask,
    deleteProjectTask: deleteProjectTask,
    updateProjectTask: updateProjectTask,
    addProject: addProject,
  };

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export default ProjectsContextProvider;
