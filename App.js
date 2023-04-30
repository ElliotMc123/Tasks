import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ScheduleProvider from './store/schedule-context';
import TasksContextProvider from './store/task-context';
import ProjectsContextProvider from './store/projects-context';

import Home from './screens/Home';
//import Streaks from './screens/Streaks';
import AddTask from './screens/AddTask';
import Calendar from './screens/Calendar';

import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

import { GlobalStyles } from './constants/styles';

import { Ionicons } from '@expo/vector-icons';



const BottomTabs = createBottomTabNavigator();


export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <TasksContextProvider>
        <ProjectsContextProvider>
        <ScheduleProvider>
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <BottomTabs.Navigator screenOptions={{
            headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
            headerTintColor: 'white',
            tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
            tabBarActiveTintColor: GlobalStyles.colors.accent500, }}>
              <BottomTabs.Screen name="Home" component={Home} 
              options={{
              title: 'Home',
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }} />
              <BottomTabs.Screen name="AddTask" component={AddTask} 
              options={{
                title: 'Task',
                tabBarLabel: 'Task',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="add-circle-outline" size={size} color={color} />
                ),
              }} />
              <BottomTabs.Screen name="Calendar" component={Calendar}
              options={{
                title: 'Calendar',
                tabBarLabel: 'Calendar',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="calendar-outline" size={size} color={color} />
                ),
              }} />
            </BottomTabs.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
        </ScheduleProvider>
        </ProjectsContextProvider>
      </TasksContextProvider>
        
    </>
  );
}



