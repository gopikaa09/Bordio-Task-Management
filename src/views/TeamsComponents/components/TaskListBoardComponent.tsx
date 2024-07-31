import { Task } from "@/@types/tasks";
import { groupBy } from "lodash";
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TaskBoardItem from "./TaskBoardItem";
import { monitorForElements, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import axios from "axios";
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

const itemStyles = css({
  position: 'relative',
  display: 'inline-block',
  padding: '16px',
  border: `1px solid lightgrey`,
});

const TaskListBoardComponent = ({ data: initialTasks }: { data: Task[] }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const statuses = [
    { name: 'New Task', value: 10 },
    { name: 'Scheduled', value: 20 },
    { name: 'In Progress', value: 30 },
    { name: 'Completed', value: 40 },
  ];

  const queryClient = useQueryClient();
  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationKey: ['taskStatusUpdate'],
    mutationFn: async (task: Task) => {
      const url = `http://localhost:4000/taskList/${task.id}`;
      const response = await axios.put(url, task);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    }
  });

  useEffect(() => {
    const stopMonitoring = monitorForElements({
      onDrop: async ({ source, location }) => {
        console.log('Drop Event Triggered');
        console.log('Source Data:', source.data);
        console.log('Location Data:', location);

        const destination = location.current.dropTargets[0];
        if (!destination) {
          console.log('No Drop Target Found');
          return;
        }

        const destinationStatus = destination.data.status;
        const sourceTaskId = source.data.id;

        console.log('Destination Status:', destinationStatus);
        console.log('Source Task ID:', sourceTaskId);

        // Update local state
        const updatedTasks = tasks.map(task =>
          task.id === sourceTaskId ? { ...task, status: destinationStatus } : task
        );
        setTasks(updatedTasks);

        // Update server
        const updatedTask = updatedTasks.find(task => task.id === sourceTaskId);
        if (updatedTask) {
          try {
            await changeStatusMutation(updatedTask);
          } catch (error) {
            console.error('Failed to update task status:', error);
          }
        }
      },
    });

    // Register drop targets and auto-scroll for each status column
    const dropTargets = document.querySelectorAll('.drop-target');
    dropTargets.forEach(target => {
      dropTargetForElements({
        element: target,
        getData: () => ({ status: Number(target.getAttribute('data-status')) })
      });

      autoScrollForElements({
        element: target,
        canScroll: ({ direction }) => direction === 'y',  // Enable vertical scrolling
      });
    });

    return () => stopMonitoring();
  }, [tasks, changeStatusMutation]);

  const ordered = groupBy(tasks, task => task.status);

  return (
    <div className="flex overflow-x-auto overflow-y-auto">
      {statuses.map((status, id) => (
        <div key={id} className='p-2 drop-target' data-status={status.value}>
          <h6 className="pb-4 break-words text-center">{status.name}</h6>
          <div className='p-2 dark:bg-slate-700 w-96' style={{ height: 'calc(100% - 50px)' }}>
            {ordered[status.value]?.map((task: Task) => (
              <div className="mb-3" key={task.id}>
                <TaskBoardItem task={task} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskListBoardComponent
