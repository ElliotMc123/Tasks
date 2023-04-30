import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

import { ScheduleContext } from '../store/schedule-context';
import {useEffect, useState, useContext} from 'react';
import { GlobalStyles } from '../constants/styles';
import ScheduleOutput from '../components/calendar/ScheduleOutput';
import Dialog from "react-native-dialog";
import { Ionicons } from '@expo/vector-icons';
import DayButton from '../components/UI/DayButton';
import { scheduleTasks } from '../components/calendar/Backtracking';
import { TasksContext } from '../store/task-context';
import { deleteSchedule, deleteTask, storeSchedule } from '../util/http';
import axios from 'axios';




function Calendar() {
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAlert, setShowAlert] = useState(false);
  const [text, setText] = useState('');
  const [userEndTime, setUserEndTime] = useState('');
  const tasksCtx = useContext(TasksContext);
  const scheduleCtx = useContext(ScheduleContext);
  const [isSunny, setIsSunny] = useState(true);



  function pressHandler() {
    setShowAlert(true);
  }

  function handleCancel() {
    setShowAlert(false);
  }
  function handleOk() {
    setUserEndTime(text);
    setShowAlert(false);
  }

  useEffect(() => {
    const updateSchedule = async () => {
      try {
        const updatedScheduleId = await storeSchedule(selectedDate, scheduleCtx[selectedDate]);
        console.log('Schedule updated with ID:', updatedScheduleId);
      } catch (error) {
        console.error('Failed to update schedule:', error);
      }
    };

    updateSchedule();
  }, [scheduleCtx]);


  

  useEffect(() => {
    const options = {
      method: 'GET',
      url: 'https://api.weatherbit.io/v2.0/forecast/daily',
      params: {
        lat: '51.454514',
        lon: '-2.58791',
        days: 16,
        key: '1c7abe7d521d4715874b99324c0c46d5'
      }
    };

    axios.request(options).then(function (response) {
      const weatherData = response.data;
      console.log("Calendar - weatherData", weatherData);
      
      const targetDate = new Date(selectedDate.toString());
      console.log("Calendar - targetDate", targetDate);

      const weatherDay = weatherData.data.find(day => new Date(day.datetime).getDate() === targetDate.getDate());
      console.log("whether", weatherDay);
      
      if (weatherDay.precip > 0) {
        setIsSunny(false);
        console.log("Calendar - RAAAIIIN")
      } else {
        setIsSunny(true);
        console.log("Calendar - SUUUUNNNNN")
      }
      
    });
  }, [selectedDate]);



    


  async function generateButtonPressHandler () {
    const tasks = tasksCtx.tasks;
    const selectedDateString = new Date(selectedDate);
    console.log("Calendar - selectedDateString", selectedDateString);    
    try {
      console.log("Calendar - scheduleCtx.schedules[selectedDateString]", scheduleCtx.schedules[selectedDateString]);
      const selectedDateTasks = scheduleCtx.schedules[selectedDateString];
      console.log ("Calendar - Tasks from selected day: ", selectedDateTasks);
      // Update the tasks in tasksCtx
      if (selectedDateTasks) {
      tasksCtx.setTask(selectedDateTasks)
      };
      console.log ("Calendar - tasksCtx", tasksCtx);
    scheduleCtx.schedules[selectedDateString] = [];
      await deleteSchedule(selectedDate);
      console.log("Calendar - Deleted database task", selectedDate);
    } catch (error) {
      console.log("Calendar - Failed to delete task", error);
    }
    console.log("Calendar - scheduleCtx.schedules", scheduleCtx.schedules); 
    const startTime = new Date();
    console.log("Calendar - hours", userEndTime );
    const endTime = new Date(startTime.getTime() + userEndTime * 60 * 60 * 1000);
    const filteredTasks = tasks;
 
    const options = {
    method: 'GET',
    url: 'https://api.weatherbit.io/v2.0/forecast/daily',
    params: {
      lat: '51.454514',
      lon: '-2.58791',
      days: 16,
      key: '1c7abe7d521d4715874b99324c0c46d5'
    }
  };
  axios.request(options).then(function (response) {
    const weatherData = response.data;
    console.log("Calendar - weatherData", weatherData);
    targetDate = new Date(selectedDate.toString());
    console.log("Calendar - targetDate", targetDate);
    const weatherDay = weatherData.data.find(day => new Date(day.datetime).getDate() === targetDate.getDate());
      const weatherDescription = weatherDay.weather.description;
      console.log("Calendar - weatherDescription", targetDate, weatherDescription);
    if (weatherDay.precip > 0) {
      for (let i = 0; i < filteredTasks.length; i++) {
        if (filteredTasks[i].weather === "Sunny" ) {
          filteredTasks.splice(i, 1);
          i--;
        }
      }
      console.log("Calendar - Rainy Tasks", filteredTasks);
      setIsSunny(false);
    } else {
      for (let i = 0; i < filteredTasks.length; i++) {
        if (filteredTasks[i].weather === "rain") {
          filteredTasks.splice(i, 1);
          i--;
        }
      }
      console.log("Calendar - Sunny Tasks", filteredTasks);
      setIsSunny(true);
    } 
  }).catch(function (error) {
    console.error(error);
  });
  
  
    const {schedule, totalImportance} = scheduleTasks(filteredTasks, startTime, endTime);
    console.log("Calendar - Schedule:", schedule);
    console.log("Calendar - Total importance:", totalImportance);
    const scheduleArray = Object.entries(schedule).map(([, value]) => value);
    const taskIds = scheduleArray.map(task => task.id);
    console.log("Calendar - Tasks BEFORE:", tasksCtx);
    tasksCtx.deleteTask(taskIds);
    await deleteTask(taskIds); 
    console.log("Calendar - Tasks AFTER:", tasksCtx);
    const lastDate = selectedDate.toString();
    console.log("Calendar - Schedule to be added", scheduleArray)
    console.log("Calendar - lastDate", lastDate, schedule)
    scheduleCtx.setTasks(lastDate, scheduleArray)  
    await storeSchedule(lastDate, schedule);
  };

  
    return (
        <View style={styles.container}>
          <CalendarStrip
            onDateSelected={setSelectedDate}
            calendarAnimation={{type: 'sequence', duration: 999, useNativeDriver: false}}
            scrollable scrollerPaging
            style={{height:100, paddingTop: 20, paddingBottom: 10}}
            calendarColor={GlobalStyles.colors.gray200}
            dateNumberStyle={GlobalStyles.colors.primary200}
            dateNameStyle={GlobalStyles.colors.primary200}
            daySelectionAnimation={{type: 'border', borderWidth: 5, borderHighlightColor: GlobalStyles.colors.primary500}}
          />
          
          <View style={styles.buttonOuterContainer}>
        <View style={styles.dayView}>
            <Text>Day Structure</Text>
            {isSunny ?(
            <Ionicons name="sunny-outline" color= 'black' size={30} />
            ) : (<Ionicons name="cloudy-outline" color= 'black' size={30} />)}
            <Pressable onPress={pressHandler}>
              <Ionicons name="filter-outline" color= 'black' size={30} />
            </Pressable>
        </View>   
        <View style={styles.buttonContainer}>
  
        </View>
        <View style={styles.generateButtonOuterContainer}>
          <Pressable
            style={({ pressed }) =>
              pressed
                ? [styles.generateButtonInnerContainer, styles.pressed]
                : styles.generateButtonInnerContainer
            }
            onPress={generateButtonPressHandler}
            android_ripple={{ color: GlobalStyles.colors.primary500 }}
          >
            <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Generate Button</Text>
                <Ionicons name="color-wand-outline" color= 'white' size={30} />
            </View>
          </Pressable>
        </View>
        {showAlert && (
          <Dialog.Container visible={showAlert}>
            <Dialog.Title>Hours allocated for today</Dialog.Title>
            <Dialog.Input onChangeText={(text) => setText(text)} value={text} />
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button label="OK" onPress={handleOk} />
          </Dialog.Container>
        )}
    </View>





          <ScheduleOutput selectedDate={selectedDate} setSchedule={setSchedule}></ScheduleOutput>
        </View>
      );
}

export default Calendar;

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonOuterContainer: {
    backgroundColor: GlobalStyles.colors.gray100,
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 2,
    borderRadius: 28,
    margin: 8,
  },
  button: {
    fontSize: 20,
    color: GlobalStyles.colors.gray700,
    
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
    
  },
  dayView: {
    flexDirection: 'row',
  justifyContent: 'space-between'
  
},



generateButtonOuterContainer: {
  borderRadius: 28,
  margin: 4,
  overflow: 'hidden',
},
generateButtonInnerContainer: {
  backgroundColor: GlobalStyles.colors.primary500,
  paddingVertical: 8,
  paddingHorizontal: 16,
  elevation: 2,
},
buttonText: {
  color: 'white',
  textAlign: 'center',
},
pressed: {
  opacity: 0.75,
},
  
  });
