import { View, Text, Pressable, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { useState, useContext, useEffect } from 'react';
import { TasksContext } from '../../store/task-context';
import { deleteTask, deleteSchedule } from '../../util/http';
import { ScheduleContext } from '../../store/schedule-context';

function EntertainmentButton({ selectedDate, id, title, deadline, duration, frequency, type, priority, weather, notes, importance }) {
  const [showOptions, setShowOptions] = useState(false);
  const [date, setDate] = useState(selectedDate);
   // allows access to the task context
   const tasksCtx = useContext(TasksContext);
   const ScheduleCtx = useContext(ScheduleContext);


   useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);


   const options = [
    { id: '1', title: 'Completed' },
    { id: '2', title: 'Reschedule' },
    { id: '3', title: 'Delete' },
    { id: '4', title: 'Close' },
  ];

  const Completed = () => {
    console.log("EntertainmentButton- completed");
    ScheduleCtx.deleteTask(date, id);
    setShowOptions(false);
  };

  async function deleteTaskHandler() {
    try {
      await deleteSchedule(date);
      ScheduleCtx.deleteTask(date, id);
    } catch (error) {
      console.log("EntertainmentButton - Failed to delete task", error);
    }
    setShowOptions(false);
  }

  async function rescheduleHandler () {
    console.log("EntertainmentButton - date", date);
    console.log("EntertainmentButton - tasks", tasksCtx.tasks);
    tasksCtx.addTask({title, deadline, duration, frequency, type, priority, weather, notes, importance});
    console.log("EntertainmentButton - Newtasks", tasksCtx.tasks);


    ScheduleCtx.deleteTask(date, id);

    console.log("EntertainmentButton - Rescheduled tasks", tasksCtx.tasks);
    setShowOptions(false);
    try {
      await deleteSchedule(date);

      console.log("EntertainmentButton - Deleted task", date, id, title);
    } catch (error) {
      console.log("EntertainmentButton - Failed to delete task", error);
    }
  };


  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={() => setShowOptions(true)}
        android_ripple={{ color: GlobalStyles.colors.gray200 }}
      >
        <View style={styles.buttonContainer}>
            <Ionicons name="film-outline" color= 'black' size={30} />
            <Text style={styles.buttonText}>{title}</Text>
            <Ionicons name="notifications-outline" color= 'black' size={30} />
        </View>
      </Pressable>
      <Modal
        visible={showOptions}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionButton}
                onPress={() => {
                  if (option.id === '1') {
                    Completed();
                  } else if (option.id === '2') {
                    rescheduleHandler();
                  } else if (option.id === '3') {
                    deleteTaskHandler();
                  } else if (option.id === '4') {
                    setShowOptions(false);
                  }
                }}
              >
                <Text style={styles.optionText}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default EntertainmentButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 28,
    margin: 4,
    overflow: 'hidden',
  },
  buttonInnerContainer: {
    backgroundColor: GlobalStyles.colors.gray200,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalContainer: {
    flex: 1,
    //backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    elevation: 4,
  },
  optionButton: {
    padding: 8,
    alignItems: 'center',
  },
  optionText: {
    color: 'black',
    fontSize: 16,
  },
});