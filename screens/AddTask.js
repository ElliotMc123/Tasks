import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import TaskForm from '../components/AddTask/TaskForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { TasksContext } from '../store/task-context';
import { storeTask } from '../util/http';

function AddTask({ navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  //* stores task context to a constant
  const tasksCtx = useContext(TasksContext);

  //* Handles cancel action
  function cancelHandler() {
    navigation.goBack();
  }

  //* handles the submission of a task
  async function confirmHandler(taskData) {
    setIsSubmitting(true);
    try {
        const id = await storeTask(taskData);
        tasksCtx.addTask({ ...taskData, id: id });
      navigation.goBack();
    } catch (error) {
      setError('Could not save data - please try again later!');
      setIsSubmitting(false);
    }
    if (error && !isSubmitting) {
      return <ErrorOverlay message={error} />;
    }
    if (isSubmitting) {
      return <LoadingOverlay />;
    }
}

  return (
    <View style={styles.container}>
      <TaskForm
        submitButtonLabel='Add'
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
      />
    </View>
  );
}

export default AddTask;;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
});