import { Task } from "@/@types/tasks";
import { groupBy } from "lodash";
import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TaskBoardItem from "./TaskBoardItem";
import { monitorForElements, dropTargetForElements, draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import axios from "axios";
import invariant from "tiny-invariant";
import { Button, Drawer } from "@/components/ui";
import { HiOutlinePlus } from "react-icons/hi";
import AddTask from "./AddTask";

const itemStyles = css({
  position: 'relative',
  display: 'inline-block',
  padding: '16px',
  border: `1px solid lightgrey`,
});

const TaskListBoardComponent = ({ data: initialTasks }: { data: Task[] }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isOpen, setIsOpen] = useState(false)

  const statuses = [
    { name: 'New Task', value: 10, position: 1 },
    { name: 'Scheduled', value: 20, position: 2 },
    { name: 'In Progress', value: 30, position: 3 },
    { name: 'Completed', value: 40, position: 4 },
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
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const destinationStatus = destination.data.status;
        const sourceTaskId = source.data.id;

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

    const dropTargets = document.querySelectorAll('.drop-target');
    dropTargets.forEach(target => {
      dropTargetForElements({
        element: target,
        getData: () => ({ status: Number(target.getAttribute('data-status')) })
      });
    });

    return () => stopMonitoring();
  }, [tasks, changeStatusMutation]);

  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setColumnRef = (el: HTMLDivElement | null, statusValue: number) => {
    if (el) {
      draggable({
        element: el,
        getInitialData: () => ({ type: 'column', status: statusValue }),
        onDragStart: () => console.log('Dragging started for column'),

        onDrop: () => console.log('Dropped column'),
      });

    }
    const dropTargets = document.querySelectorAll('.draggable-column');
    dropTargets.forEach(target => {
      dropTargetForElements({
        element: target,
        getData: () => ({ position: Number(target.getAttribute('data-position')) })
      });

      draggable({
        element: target,
        getData: () => ({ position: Number(target.getAttribute('data-position')) })
      });
    });
    columnRefs.current[statusValue] = el;
  };

  const ordered = groupBy(tasks, task => task.status);
  const handleAddTaskDrawerOpen = (status) => {
    setIsOpen(true)
  }

  const openAddTaskDrawer = () => {
    setIsOpen(true)
  }
  const onDrawerClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div className="flex overflow-x-auto overflow-y-auto" data-position={statuses}>
        {statuses.map((status) => (
          <div
            key={status.value}
            className='p-2 drop-target'
            data-status={status.value}
            ref={el => setColumnRef(el, status.value)}
          >
            <div className="flex justify-between mx-4">
              <h6 className="pb-4 break-word">{status.name}</h6>
              <Button icon={<HiOutlinePlus />} size="xs" onClick={() => handleAddTaskDrawerOpen(status?.value)}></Button>
            </div>
            <div className='p-2 dark:bg-slate-700 w-96' style={{ height: 'calc(100% - 50px)' }}>
              {ordered[status.value]?.map((task: Task) => (
                <div
                  className="mb-3"
                  key={task.id}
                  css={itemStyles}
                >
                  <TaskBoardItem task={task} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <Drawer
          title='Add Task'
          isOpen={isOpen}
          drawerClass={'w-full md:w-[650px]'}
          bodyClass='overflow-x-hidden p-0 editDrawer'
          className=''
          onClose={onDrawerClose}
          onRequestClose={onDrawerClose}
        >
          <div className="p-5">
            <AddTask drawerClose={onDrawerClose} status={status} />
          </div>

        </Drawer>

      </div>
    </>

  );
};

export default TaskListBoardComponent;
