import { useContext } from 'react';
import { ScheduleContext } from '../../store/schedule-context';
import { ScrollView } from 'react-native';
import ProductivityButton from '../UI/ProductivityButton';
import EntertainmentButton from '../UI/EntertainmentButton';
import ExerciseButton from '../UI/ExerciseButton';

function ScheduleOutput({selectedDate}) {
  const date = selectedDate.toString();
  console.log('ScheduleOutput.js - date:', date);
  const { schedules } = useContext(ScheduleContext);
  console.log('ScheduleOutput.js - schedules:', schedules)  

  if (schedules[date] && schedules[date].length > 0) { 
    return (
      <ScrollView>
        {schedules[date].map((task) => {
          if (task.type === "Productivity") {
            return <ProductivityButton selectedDate={selectedDate} key={task.id} {...task} />;
          } else if (task.type === "Entertainment") {
            return <EntertainmentButton selectedDate={selectedDate} key={task.id} {...task} />;
          } else if (task.type === "Exercise") {
            return <ExerciseButton selectedDate={selectedDate} key={task.id} {...task} />;
          } else {
            return null;
          }
        })}
      </ScrollView>
    );
  }
  return null;
}

export default ScheduleOutput;
