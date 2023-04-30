import axios from 'axios';
import { setTasks } from '../store/schedule-context'
import { ScheduleContext } from '../store/schedule-context';
import { useContext } from 'react';

const BACKEND_URL =
  'https://task-ai-d84be-default-rtdb.europe-west1.firebasedatabase.app/';
  


  // this function takes a taskData argument and makes a post request to the database
export async function storeTask(taskData) {
  const response = await axios.post(BACKEND_URL + '/tasks.json', taskData);
  const id = response.data.name;
  return id;
}

// this function retrieves an array of tasks as objects from the database
export async function fetchTasks() {

  response = await axios.get(BACKEND_URL + '/tasks.json');
  
  const tasks = [];  

  for (const key in response.data) {
    const taskObj = {
      id: key,
      title: response.data[key].title,
      deadline: new Date(response.data[key].deadline),
      duration: response.data[key].duration,
      frequency: response.data[key].frequency,
      type: response.data[key].type,
      priority: response.data[key].priority,
      weather: response.data[key].weather,
      notes: response.data[key].notes,
      importance: response.data[key].importance,
    };
    tasks.push(taskObj);
  }
  console.log("HTTP - Tasks returned from the database: ", tasks);
  return tasks;
}

// this function updates an existing task in the database
export function updateTask(id, taskData) {
  return axios.put(BACKEND_URL + `/tasks/${id}.json`, taskData);
}

 // this function deletes an existing task from the database
 export function deleteTask(taskIds) {
  const deleteRequests = taskIds.map(taskId => {
    return axios.delete(BACKEND_URL + `/tasks/${taskId}.json`);
  });

  return Promise.all(deleteRequests);
}






// this function takes a taskData argument and makes a post request to the database
export async function storeSchedule(date, taskData) {
  const response = await axios.post(BACKEND_URL + `/schedules/${date}.json`, {...taskData});
  const id = response.data.name;
  return id;
}



// this function retrieves an array of schedules as objects from the database
export async function fetchSchedules() {
  
  const response = await axios.get(BACKEND_URL + '/schedules.json');
  const schedules = [];

  for (const dateKey in response.data) {
    const date = new Date(dateKey);
    const tasks = [];

    
    for (const idKey in response.data[dateKey]) {
      for (const taskId in response.data[dateKey][idKey]) {

        const task = response.data[dateKey][idKey][taskId]; // Assuming only one task per ID
        dateName = dateKey;
        
        tasks.push(task);

        console.log("HTTP - Date of schedule trying to access:", dateName);

       const scheduleObj = {
        date: dateName,
        tasks: task,
      };
    //  console.log("HTTP - FFFFFFF", scheduleObj);
        
  
     
        schedules.push(scheduleObj);
        
      }

    }
  
    console.log("HTTP - Schedule for date returned from the database: ", schedules);

  

    
}
    
  
return schedules;





}


  /*
  // Use flatMap() to flatten the tasks array
  const flattenedSchedules = schedules.flatMap(schedule => ({
    id: schedule.id,
    tasks: schedule.tasks.flatMap(task => task),
  }));

  console.log("HTTP - flattenedSchedules", flattenedSchedules);
}
*/



/*
export const fetchSchedules = async () => {
  try {
    const response = await fetch(
      BACKEND_URL + '/schedules.json' );
      console.log(HTTP - response);
    const data = await response.json();
    const schedulesArray = [];
    for (const [date, tasks] of Object.entries(data.schedules)) {
      const tasksArray = [];
      for (const [taskId, task] of Object.entries(tasks)) {
        tasksArray.push({
          ...task,
          id: taskId,
        });
      }
      schedulesArray.push({
        date: new Date(Number(date)),
        tasks: tasksArray,
      });
    }
    const sortedSchedulesArray = schedulesArray.sort(
      (a, b) => a.date - b.date
    );
    const scheduleObj = {};
    sortedSchedulesArray.forEach((schedule) => {
      const dateString = schedule.date.toISOString().split("T")[0];
      scheduleObj[dateString] = schedule.tasks;
    });
    return scheduleObj;
  } catch (error) {
    console.log(HTTP - error);
    return {};
  }
};
*/
// this function updates an existing schedule in the database
export function updateSchedule(id, scheduleData) {
  return axios.put(BACKEND_URL + `/schedules/${id}.json`, scheduleData);
}

// this function deletes an existing schedule from the database
// Deletes the whole schedule for a given date
export function deleteSchedule(date) {
//


const formattedDate =  new Date(date); // You need to define this function to format the date in the desired format
const finalDate = formattedDate.toString();
  console.log("HTTP - formatted", finalDate);
  return axios.delete(BACKEND_URL + `/schedules/${finalDate}.json`);
}

// Deletes a single task from the schedule for a given date
export function deleteScheduleTask(date, taskId) {
  const formattedDate = new Date(date); // You need to define this function to format the date in the desired format
  return axios.delete(BACKEND_URL + `/schedules/${formattedDate}/tasks/${taskId}.json`);
}
