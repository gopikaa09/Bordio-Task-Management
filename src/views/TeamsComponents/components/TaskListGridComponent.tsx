import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { monitorForElements, dropTargetForElements, draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import TaskListGridItem from "./TaskListGridItem.";

const TaskListGridComponent = ({ data: initialTasks, DataURL }) => {
  const tasksWithIndex = initialTasks.map((task, index) => ({ ...task, index }));
  console.log('Initial tasks:', tasksWithIndex);

  const [tasks, setTasks] = useState(tasksWithIndex);

  const queryClient = useQueryClient();
  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationKey: ['taskStatusUpdate'],
    mutationFn: async (task) => {
      const url = `DataURL/${task.id}`;
      const response = await axios.put(url, task);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    }
  });

  const swapTaskIndices = (draggedTaskId, targetTaskId) => {
    const draggedTaskIndex = tasks.findIndex(task => task.id === draggedTaskId);
    const targetTaskIndex = tasks.findIndex(task => task.id === targetTaskId);

    if (draggedTaskIndex !== -1 && targetTaskIndex !== -1) {
      const updatedTasks = [...tasks];
      [updatedTasks[draggedTaskIndex], updatedTasks[targetTaskIndex]] =
        [updatedTasks[targetTaskIndex], updatedTasks[draggedTaskIndex]];

      updatedTasks[draggedTaskIndex].index = draggedTaskIndex;
      updatedTasks[targetTaskIndex].index = targetTaskIndex;

      setTasks(updatedTasks);
      console.log('Tasks after swap:', updatedTasks);
    }
  };

  useEffect(() => {
    const stopMonitoring = monitorForElements({
      onDrop: async ({ source, location }) => {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const destinationStatus = destination.data.status;
        const sourceTaskIndex = source.data.index;

        const updatedTasks = tasks.map(task =>
          task.index === sourceTaskIndex ? { ...task, status: destinationStatus } : task
        );
        setTasks(updatedTasks);

        const updatedTask = updatedTasks.find(task => task.index === sourceTaskIndex);
        if (updatedTask) {
          try {
            await changeStatusMutation(updatedTask);
          } catch (error) {
            console.error('Failed to update task status:', error);
          }
        }
      },
    });

    const dropTargets = document.querySelectorAll('.drop-target');
    dropTargets.forEach(target => {
      dropTargetForElements({
        element: target,
        getData: () => ({ status: Number(target.getAttribute('data-status')) })
      });
    });

    return () => stopMonitoring();
  }, [tasks, changeStatusMutation]);

  return (
    <>
      {tasks.map(task => (
        <TaskListGridItem key={task.id} task={task} onTaskDrop={swapTaskIndices} DataURL={DataURL} />
      ))}
    </>
  );
};

export default TaskListGridComponent;
