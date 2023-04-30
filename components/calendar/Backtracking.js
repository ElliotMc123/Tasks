
export function scheduleTasks(filteredTasks, startTime, endTime) {
    const schedule = []; 
    let currentTime = new Date(startTime); 
    let totalImportance = 0; 
    let bestSolution = null; 
    
     
    function backtrack(index) {
      if (index === filteredTasks.length) { // If all tasks have been considered.
        if (bestSolution === null || totalImportance > bestSolution.totalImportance) { // If the current schedule is better than the best solution found so far.
          bestSolution = {schedule: [...schedule], totalImportance}; // Update the best solution.
        }
        return;
      }
      let task = filteredTasks[index]; // Get the current task.
      if (currentTime.getTime() + task.duration * 60000 <= new Date(task.deadline).getTime() && currentTime.getTime() + task.duration * 60000 <= new Date(endTime).getTime()) { // If the task can be scheduled within the given time frame.
        schedule.push(task); // Add the task to the schedule.
        currentTime = new Date(currentTime.getTime() + task.duration * 60000); // Update the current time.
        totalImportance += Number(task.importance); // Update the total importance.
        filteredTasks.splice(index, 1); // Remove the task from the tasks array.
        backtrack(index); // Recursively call the function with the next task.
        filteredTasks.splice(index, 0, task); // Add the task back to the tasks array.
        schedule.pop(); // Remove the task from the schedule.
        currentTime = new Date(currentTime.getTime() - task.duration * 60000); // Update the current time.
        totalImportance -= Number(task.importance); // Update the total importance.
      }
      backtrack(index + 1); // Recursively call the function with the next task.
    }
    backtrack(0); // Call the function with the first task.
    return {schedule: bestSolution.schedule, totalImportance: bestSolution.totalImportance};
  }


