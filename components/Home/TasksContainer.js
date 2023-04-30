import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import HomeProductivityButton from '../UI/HomeProductivityButton';
import HomeEntertainmentButton from '../UI/HomeEntertainmentButton';
import HomeExerciseButton from '../UI/HomeExerciseButton';
import { useContext, useState, useEffect } from 'react';
import { TasksContext } from '../../store/task-context';
import { deleteTask, fetchTasks } from '../../util/http';

function TasksContainer() {
    const TasksCtx = useContext(TasksContext);
    const [showAllTasks, setShowAllTasks] = useState(true);
    const [showProductivityTasks, setShowProductivityTasks] = useState(false);
    const [showEntertainmentTasks, setShowEntertainmentTasks] = useState(false);
    const [showExerciseTasks, setShowExerciseTasks] = useState(false);

    // This useEffect are used to get all tasks from the database
    useEffect(() => {
        async function updateTasks() {
          try {
            const tasksInDb = await fetchTasks();
            TasksCtx.tasks = [];
            console.log("TasksContainer.js - TasksCtx.tasks: ", TasksCtx.tasks)
            TasksCtx.setTask(tasksInDb);
            console.log("TasksContainer.js - TasksCtx.tasks: ", TasksCtx.tasks)
          } catch (error) {
            console.log("TasksContainer.js -", error);
          }
        }
        updateTasks();
      }, [deleteTask]);
      
    function ShowAllTasks() {
        return (
            <ScrollView>
            {TasksCtx.tasks.map((task) => {
                if (task.type === "Productivity") {
                    return <HomeProductivityButton key={task.id} {...task} />;
                } else if (task.type === "Entertainment") {
                    return <HomeEntertainmentButton key={task.id} {...task} />;
                } else if (task.type === "Exercise") {
                    return <HomeExerciseButton key={task.id} {...task} />;
                } else {
                    return null;
                }
            })}
            </ScrollView>     
        );
    }
    function ShowProductivityTasks() {
        const productivityTasks = TasksCtx.tasks.filter(task => task.type === "Productivity");
        return (
            <ScrollView>
            {productivityTasks.map((task) => (
                <HomeProductivityButton key={task.id} {...task} />
            ))}
            </ScrollView>     
        );
    }
    function ShowEntertainmentTasks() {
        const entertainmentTasks = TasksCtx.tasks.filter(task => task.type === "Entertainment");
        return (
            <ScrollView>
            {entertainmentTasks.map((task) => (
                <HomeEntertainmentButton key={task.id} {...task} />
            ))}
            </ScrollView>     
        );
    }
    function ShowExerciseTasks() {
        const exerciseTasks = TasksCtx.tasks.filter(task => task.type === "Exercise");
        return (
            <ScrollView>
            {exerciseTasks.map((task) => (
                <HomeExerciseButton key={task.id} {...task} />
            ))}
            </ScrollView>     
        );
    }

    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <Pressable onPress={() => {setShowAllTasks(true); setShowProductivityTasks(false); setShowEntertainmentTasks(false); setShowExerciseTasks(false);}}>
            <View style={styles.taskHeader}>
                <Text style={{ fontWeight: 'bold' }}>All</Text>
            </View>
            </Pressable>
            <Pressable onPress={() => {setShowAllTasks(false); setShowProductivityTasks(true); setShowEntertainmentTasks(false); setShowExerciseTasks(false);}}>
            <View style={styles.taskHeader}>    
                <Text style={{ fontWeight: 'bold' }}>Productivity</Text>
                </View>
            </Pressable>
            <Pressable onPress={() => {setShowAllTasks(false); setShowProductivityTasks(false); setShowEntertainmentTasks(true); setShowExerciseTasks(false);}}>
            <View style={styles.taskHeader}>
                <Text style={{ fontWeight: 'bold' }}>Entertainment</Text>
                </View>
            </Pressable>
            <Pressable onPress={() => {setShowAllTasks(false); setShowProductivityTasks(false); setShowEntertainmentTasks(false); setShowExerciseTasks(true);}}>
            <View style={styles.taskHeader}>
                <Text style={{ fontWeight: 'bold' }}>Exercise</Text>
                </View>
            </Pressable>
        </View>
        {showAllTasks && <ShowAllTasks />}
        {showProductivityTasks && <ShowProductivityTasks />}
        {showEntertainmentTasks && <ShowEntertainmentTasks />}
        {showExerciseTasks && <ShowExerciseTasks />}
        </View>
    );
}

export default TasksContainer;

const styles = StyleSheet.create({
    container: {
        backgroundColor: GlobalStyles.colors.gray100,
        padding: 10,
        borderRadius: 28,
        overflow: 'hidden'

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        
        

        
      },
      taskContainer: {flex: 4, padding: 10, margin:5},

      taskHeader: {
        backgroundColor: GlobalStyles.colors.gray200,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 28,
    },

  
});