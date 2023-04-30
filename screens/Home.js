import { Text, FlatList, ScrollView, TouchableOpacity, Alert, View, Button, StyleSheet } from 'react-native';
import {SearchBar, Overlay} from 'react-native-elements';
import { GlobalStyles } from '../constants/styles';
import { useContext, useState, useEffect } from 'react';
import { TasksContext } from '../store/task-context';
import { fetchTasks, fetchSchedules, deleteTask, updateTask } from '../util/http';
import ProjectsContainer from '../components/Home/ProjectsContainer';
import TasksContainer from '../components/Home/TasksContainer';
//import { fetchWeather } from '../components/OpenWeather';
import { ScheduleContext } from '../store/schedule-context';
import { setTasksFromDatabase, setTasks } from'../store/schedule-context';
import { scheduleTasks } from '../components/calendar/Backtracking';
import { callCloudFunction } from '../firebase';

function Home() {
    const ScheduleCtx = useContext(ScheduleContext);
    const tasksCtx = useContext(TasksContext);
/*
    useEffect(() => {
      callCloudFunction();
    }, []);
  */  
    useEffect(() => {
      async function updateTasks() {
        try {
          const tasksInDatabase = await fetchTasks(); // Fetch all tasks from the database
          const taskIdsInDatabase = tasksInDatabase.map(task => task.id); // Get an array of all task IDs in the database
          const tasksInContext = tasksCtx.tasks; // Get all tasks from tasksCtx
          // Get an array of all task IDs in the tasksCtx
          const taskIdsInContext = tasksInContext.map(task => task.id);
          // Find tasks that are in the database but not in the tasksCtx
          const tasksToDelete = tasksInDatabase.filter(task => !taskIdsInContext.includes(task.id));
          // Find tasks that are in the tasksCtx but not in the database
          const tasksToAdd = tasksInContext.filter(task => !taskIdsInDatabase.includes(task.id));
          // Delete tasks from the database that are not in the tasksCtx
          for (const task of tasksToDelete) {
            await deleteTask(task.id);
          }
          // Add tasks to the database that are in the tasksCtx but not in the database
          for (const task of tasksToAdd) {
            await tasksCtx.storeTask(task);
          }
        } catch (error) {
          console.log("Error updating tasks: ", error);
        }
      } 
      updateTasks();
    }, []);
  
    //  This useEffect is used to get all tasks from the database
    useEffect(() => {
      async function getSchedules() {
        try {
          const schedules = await fetchSchedules();
          console.log("Home - schedules fetched from database", schedules);
          const newTasks = {};
          schedules.forEach(task => {
            const date = task.date;
            const dateString = date;
            ;
            console.log("Home - Date of schedule:", dateString);
            const taskData = {
              title: task.tasks.title,
              deadline: new Date(task.tasks.deadline),
              duration: task.tasks.duration,
              frequency: task.tasks.frequency,
              id: task.tasks.id,
              importance: task.tasks.importance,
              notes: task.tasks.notes,
              priority: task.tasks.priority,
              type: task.tasks.type,
              weather: task.tasks.weather
            };
            if (newTasks[dateString]) {
              newTasks[dateString].push(taskData);
              console.log("Home - QQQQQ", dateString, newTasks[dateString])
            } else {
              newTasks[dateString] = [taskData];
            }
          });

       for (const [date, tasksArray] of Object.entries(newTasks)) {
        ScheduleCtx.setTasks(date, tasksArray);
       }
       console.log("Home - ScheduleCtx after database withtreval, home.js", ScheduleCtx.schedules);
        } catch (error) {
          console.log("Home - ", error);
        }
       }         
       getSchedules();
       }, []);

    return (
      <View style={styles.container}>     
            <View style={styles.projectContainer}>
                <ProjectsContainer/>
            </View>
            <View style={styles.taskContainer}>
                <TasksContainer></TasksContainer>
            </View>
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {flex: 1, padding: 10, margin:5, backgroundColor: GlobalStyles.colors.gray200},
    searchContainer: {flex: 1, padding: 10, margin:5},
    projectContainer: {flex: 2, padding: 10, margin:5},
    taskContainer: {flex: 4, padding: 10, margin:5, marginBottom: 40}
    
});