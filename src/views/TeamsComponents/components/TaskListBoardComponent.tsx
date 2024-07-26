import { Task, TaskStatus } from "@/@types/tasks";
import { groupBy } from "lodash";
import { useState } from 'react';
import { css } from '@emotion/react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';

import TaskBoardItem from "./TaskBoardItem";

const itemStyles = css({
  position: 'relative',
  display: 'inline-block',
  padding: '16px',
  border: `1px solid lightgrey`,
});

const TaskListBoardComponent = ({ data: initialTasks }: any) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const statuses = [
    { name: 'New Task', value: 10 },
    { name: 'Scheduled', value: 20 },
    { name: 'In Progress', value: 30 },
    { name: 'Completed', value: 40 },
  ];

  const queryClient = useQueryClient();
  const ordered = groupBy(tasks, (x) => x.status);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, task: Task) => {
    event.dataTransfer.setData('task', JSON.stringify(task));
  };

  const { mutateAsync: updateTaskStatus } = useMutation({
    mutationKey: ['taskUpdate'],
    mutationFn: async (task: Task) => {
      const url = `http://localhost:4000/taskList/${task.id}`;
      const response = await axios.put(url, task);
      return response.data;
    },
    onError: (error) => {
      console.error('Error updating task status:', error);
    },
    onSuccess: (updatedTask: Task) => {
      setTasks(prevTasks => prevTasks.map((t: Task) =>
        t.id === updatedTask.id ? updatedTask : t
      ));
      queryClient.invalidateQueries(['tasklist']);
    },
  });

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>, statusValue: number) => {
    event.preventDefault();
    const taskData = event.dataTransfer.getData('task');
    if (taskData) {
      const task = JSON.parse(taskData) as Task;
      const updatedTask = { ...task, status: statusValue };
      try {
        await updateTaskStatus(updatedTask);
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  };

  return (
    <div className="flex overflow-x-auto overflow-y-auto">
      {statuses.map((status, id) => (
        <div
          key={id}
          className='p-2'
          onDrop={(e) => handleDrop(e, status.value)}
          onDragOver={(e) => e.preventDefault()}
        >
          <h6 className="pb-4 break-words">
            {status.name}
          </h6>
          <div className='bg-slate-100 p-2 dark:bg-slate-700 w-72' style={{ height: 'calc(100% - 50px)' }}>
            {ordered[status.value]?.map((task: Task) => (
              <div
                className="mb-3"
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                css={itemStyles}
              >
                <TaskBoardItem {...task} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskListBoardComponent;
