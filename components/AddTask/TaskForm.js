import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Pressable } from 'react-native';
import Input from './Input';
import MainButton from '../UI/MainButton';
import { GlobalStyles } from '../../constants/styles';
import { Datepicker } from "@ui-kitten/components";
function TaskForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
  //* to set date for datepicker
  const [date, setDate ] = useState(new Date())

  //* function to handle input changes
  const [inputs, setInputs] = useState({
    title: {
      value: defaultValues ? defaultValues.title : '',
      isValid: true,
    },
    deadline: {
      value: defaultValues ? defaultValues.date : '',
      isValid: true,
    },
    duration: {
      value: defaultValues ? defaultValues.duration.toString() : '',
      isValid: true,
    },
    frequency: {
      value: defaultValues ? defaultValues.frequency : '',
      isValid: true,
    },
    type: {
      value: defaultValues ? defaultValues.type : '',
      isValid: true,
    },
    priority: {
      value: defaultValues ? defaultValues.priority : '',
      isValid: true,
    },
    weather: {
      value: defaultValues ? defaultValues.weather : '',
      isValid: true,
    },
    notes: {
      value: defaultValues ? defaultValues.notes : '',
      isValid: true,
    },
    importance: {
      value: defaultValues? defaultValues.importance : '',
      isValid: true,
    },
  });

   //* This function takes user input and set the value of the inputs

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  //* function creates object taskData stored as variable
  function submitHandler() {
    dateInputChangedHandler(date);
        const taskData = {
      title: inputs.title.value,
      deadline: new Date(inputs.deadline.value),
      duration: inputs.duration.value,
      frequency: inputs.frequency.value,
      type: inputs.type.value,
      priority: inputs.priority.value,
      weather: inputs.weather.value,
      notes: inputs.notes.value,
      importance: inputs.importance.value,
    }; 

    //* if the form is valid, call the onSubmit function
    const titleIsValid = taskData.title.trim().length > 0;
    const durationIsValid = taskData.frequency.trim().length > 0;
    const deadlineIsValid = taskData.deadline.toString() !== 'Invalid Date';
    const frequencyIsValid = taskData.frequency.trim().length > 0;
    const typeIsValid = taskData.type.trim().length > 0;
    const priorityIsValid = taskData.priority.trim().length > 0;
    const weatherIsValid = taskData.weather.trim().length > 0;
    const notesIsValid = taskData.notes.trim().length > 0;
    const importanceIsValid = taskData.importance.trim().length > 0;

    if (!durationIsValid || !deadlineIsValid || !titleIsValid || !frequencyIsValid || !typeIsValid || !priorityIsValid || !weatherIsValid || !notesIsValid ||!importanceIsValid) {
       Alert.alert('Invalid input', 'Please check your input values');
      setInputs((curInputs) => {
        return {
          title: { value: curInputs.title.value, isValid: titleIsValid },
          deadline: { value: curInputs.deadline.value, isValid: deadlineIsValid },
          duration: {value: curInputs.duration.value, isValid: durationIsValid},
          frequency: {value: curInputs.frequency.value, isValid: frequencyIsValid},
          type: {value: curInputs.type.value, isValid: typeIsValid},
          priority: {value: curInputs.priority.value, isValid: priorityIsValid},
          weather: {value: curInputs.weather.value, isValid: weatherIsValid},
          notes: {value: curInputs.notes.value, isValid: notesIsValid},
          importance: {value: curInputs.importance.value, isValid: importanceIsValid},
        };
      });
      return;
    }
    onSubmit(taskData);
  }

  const formIsInvalid =
    !inputs.title.isValid ||
    !inputs.deadline.isValid ||
    !inputs.duration.isValid ||
    !inputs.frequency.isValid ||
    !inputs.type.isValid ||
    !inputs.priority.isValid ||
    !inputs.weather.isValid ||
    !inputs.notes.isValid ||
    !inputs.importance.isValid;
    
    //* this function sets the deadline to date    
    function dateInputChangedHandler(date) {
      inputs.deadline.value = date;
      inputChangedHandler('deadline', date);
    }

    //* this function creates the different buttons to select
    function InputFormButton(props) {
      return (
        <View style={styles.buttonOuterContainer}>
          <Pressable
            style={({ pressed }) =>
              pressed
                ? [styles.buttonInnerContainer, styles.pressed]
                : styles.buttonInnerContainer
            }
            onPress={() => inputChangedHandler(props.attr, props.value)}
            android_ripple={{ color: GlobalStyles.colors.primary500 }}
          >
            <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>{props.name}</Text>        
            </View>
          </Pressable>
        </View>
      );
    };

  return (
    <ScrollView style={styles.form}>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label="Task title"
          invalid={!inputs.title.isValid}
          textInputConfig={{
            onChangeText: inputChangedHandler.bind(this, 'title'),
            value: inputs.title.value,
          }}
        />  
      </View>
      <Datepicker date={date} onSelect={setDate} label="Deadline"/>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label="Duration"
          invalid={!inputs.duration.isValid}
          textInputConfig={{
            onChangeText: inputChangedHandler.bind(this, 'duration'),
            value: inputs.duration.value,
          }}
        />
        <Input
          style={styles.rowInput}
          label="Frequency"
          invalid={!inputs.frequency.isValid}
          textInputConfig={{
            onChangeText: inputChangedHandler.bind(this, 'frequency'),
            value: inputs.frequency.value,
          }}
        />
      </View>   
      <Text style={styles.typeButtonLabel}>Type</Text>
      <View style={styles.typeButtonsContainer}>    
        <InputFormButton name="Productivity" attr="type" value="Productivity"/>
        <InputFormButton name="Entertainment" attr="type" value="Entertainment"/>
        <InputFormButton name="Exercise" attr="type" value="Exercise"/>
      </View>
      <Text style={styles.typeButtonLabel}>Priority</Text>
      <View style={styles.typeButtonsContainer}>    
        <InputFormButton name="Moderate" attr="priority" value="Moderate"/>
        <InputFormButton name="Important" attr="priority" value="Important"/>
        <InputFormButton name="Urgent" attr="priority" value="Urgent"/>
      </View>
      <Text style={styles.typeButtonLabel}>Weather</Text>
      <View style={styles.typeButtonsContainer}>    
        <InputFormButton name="N/A" attr="weather" value="N/A"/>
        <InputFormButton name="Sunny" attr="weather" value="Sunny"/>
        <InputFormButton name="rain" attr="weather" value="rain"/>
      </View>  
      <Input
        label="Importance"
        invalid={!inputs.importance.isValid}
        textInputConfig={{
          onChangeText: inputChangedHandler.bind(this, 'importance'),
          value: inputs.importance.value,
        }}
      />  
      <Input
        label="Notes"
        invalid={!inputs.notes.isValid}
        textInputConfig={{
          multiline: true,
          onChangeText: inputChangedHandler.bind(this, 'notes'),
          value: inputs.notes.value,
        }}
      />
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid input values - please check your entered data!
        </Text>
      )}
      <View style={styles.buttons}>
        <MainButton style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </MainButton>
        <MainButton style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </MainButton>
      </View>
    </ScrollView>
  );
}

export default TaskForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 24,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 2,
  },
  errorText: {
    textAlign: 'center',
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  buttonOuterContainer: {
    flex: 1,
    borderRadius: 28,
    margin: 4,
    overflow: 'hidden',
  },
  buttonInnerContainer: {
    backgroundColor: GlobalStyles.colors.primary500,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 10,  
  },
  pressed: {
    opacity: 0.75,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  typeButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  typeButtonLabel: {
    fontSize: 12,
    color: GlobalStyles.colors.primary100,
  
  }
});