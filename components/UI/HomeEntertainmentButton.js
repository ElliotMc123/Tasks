import { View, Text, Pressable, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { useState, useContext } from 'react';
import { TasksContext } from '../../store/task-context';
import { deleteTask } from '../../util/http';
import { ProjectsContext } from '../../store/projects-context';
import { useEffect } from 'react';
//import { ProjectsContainer } from '../../components/ProjectsContainer';

function HomeEntertainmentButton({ id, title, deadline, duration, frequency, type, priority, weather, notes, importance }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showProjectOptions, setShowProjectOptions] = useState(false);
  const tasksCtx = useContext(TasksContext);
  const projectsCtx = useContext(ProjectsContext);
  const [projectTasks, setProjectTasks] = useState([]);




  const options = [
    { id: '1', title: 'Schedule Task' },
    { id: '2', title: 'Delete Task' },
    { id: '3', title: 'Add Task to Project' },
    { id: '4', title: 'Close' },
  ];

  const projects = projectsCtx.projects;

  const projectOptions = Object.keys(projects).map(key => ({
title: key,    
  }));

  useEffect (() => {

  //  addTaskToProjectHandler(projectOptions);

  }, [projectOptions]);



  const scheduleTaskHandler = () => {
    console.log("HomeProductivityButton - Schedule Task pressed");
    // Do something to schedule the task
    setShowOptions(false);
  };

  async function deleteTaskHandler() {
    try {
      await deleteTask([id]);
      tasksCtx.deleteTask(id);
    } catch (error) {
      console.log("HomeProductivityButton - Failed to delete task", error);
    }
    setShowOptions(false);
  }

/******************   Projects have to be pressed twice      ********************************************** */
  const addTaskToProjectHandler = (projectId) => {
    const task = tasksCtx.tasks.find(task => task.id === id);
    console.log("HomeProductivityButton - task, ", task.title);
    const projectName = projectId;
    console.log("HomeProductivityButton - projectName, ", projectName);
    projectsCtx.addProjectTask(projectName, task);
    setShowOptions(false);
    console.log("HomeProductivityButton - Projects, ", projectsCtx.projects);
  }; 
  

  const projectOptionsHandler = () => {
    setShowOptions(false);
    setShowProjectOptions(true);
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
        </View>
      </Pressable>
      <Modal
        visible={showOptions}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowOptions(false)}
      >
        <View style={styles.modalContainer}>
          {showProjectOptions ? (
            <View style={styles.optionsContainer}>
              {projectOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={() => {
                    addTaskToProjectHandler(option.title);
                    setShowOptions(false);
                  }}
                >
                  <Text style={styles.optionText}>{option.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={() => {
                    if (option.id === '1') {
                      scheduleTaskHandler();
                    } else if (option.id === '2') {
                      deleteTaskHandler();
                    } else if (option.id === '3') {
                      setShowProjectOptions(true);
                    } else if (option.id === '4') {
                      setShowOptions(false);
                    }
                  }}
                >
                  <Text style={styles.optionText}>{option.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
      
}

export default HomeEntertainmentButton;



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
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonContainer: {
    flexDirection: 'row',
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
