import { Task } from "@/@types/tasks";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TaskBoardItem from "./TaskBoardItem";
import { monitorForElements, dropTargetForElements, draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import axios from "axios";
import { Button, Drawer } from "@/components/ui";
import { HiOutlinePlus } from "react-icons/hi";
import AddTask from "./AddTask";

const TaskListBoardComponent = ({ data: initialTasks, DataURL, headersURL, onColumnDataSend }: { data: Task[]; DataURL: string }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isOpen, setIsOpen] = useState(false);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      const url = `${DataURL}/${task.id}`;
      const response = await axios.put(url, task);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    },
  });

  const [statusPosition, setStatusPosition] = useState(statuses);

  useEffect(() => {
    const stopMonitoring = monitorForElements({
      onDrop: async ({ source, location }) => {
        const dropTargets = location.current.dropTargets;

        if (dropTargets.length === 0) {
          console.error('No drop targets found.');
          return;
        }

        const dropTargetData = dropTargets[0]?.data;
        if (!dropTargetData || typeof dropTargetData.index !== 'number') {
          console.error('Invalid drop target data.');
          return;
        }

        const dropTargetIndex = dropTargetData.index;

        if (source.data.type === 'statusDiv') {
          const newStatus = [...statusPosition];
          const draggedItemIndex = newStatus.findIndex(item => item.position === source.data.position);

          if (draggedItemIndex === -1) {
            console.error('Dragged item not found in statusPosition.');
            return;
          }

          const [movedItem] = newStatus.splice(draggedItemIndex, 1);
          newStatus.splice(dropTargetIndex, 0, movedItem);

          // Update the positions in the newStatus array
          newStatus.forEach((item, index) => {
            item.position = index + 1;  // Update position to match new order
          });

          setStatusPosition(newStatus);
          console.log('Updated status positions:', newStatus);
          console.log(`Status column moved to position: ${dropTargetIndex}`);
        } else if (source.data.type === 'taskCard') {
          const destinationStatus = dropTargetData.status;
          const sourceTaskId = source.data.id;

          const updatedTasks = tasks.map((task) =>
            task.id === sourceTaskId ? { ...task, status: destinationStatus } : task
          );

          setTasks(updatedTasks);

          const updatedTask = updatedTasks.find((task) => task.id === sourceTaskId);
          if (updatedTask) {
            try {
              await changeStatusMutation(updatedTask);
            } catch (error) {
              console.error('Failed to update task status:', error);
            }
          }
        }
      },
    });

    const dropTargets = document.querySelectorAll('.status-target');
    dropTargets.forEach((target, index) => {
      dropTargetForElements({
        element: target,
        getData: () => ({ index, status: Number(target.getAttribute('data-status')) }),
      });
    });

    return () => stopMonitoring();
  }, [tasks, statusPosition, changeStatusMutation]);

  const setColumnRef = (el: HTMLDivElement | null, position: number) => {
    if (el) {
      draggable({
        element: el,
        getInitialData: () => ({ type: 'statusDiv', position: position }),

        onDragStart: () => console.log(`Dragging started for column ${position}`),
        onDrop: () => console.log(`Dropped column ${position}`),
      });
    }
    columnRefs.current[position - 1] = el; // Adjust index to avoid gaps in the array
    onColumnDataSend(columnRefs.current);
  };

  const handleAddTaskDrawerOpen = (status: number) => {
    setIsOpen(true);
  };

  const onDrawerClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex overflow-x-auto overflow-y-auto">
        {statusPosition
          .sort((a, b) => a.position - b.position)
          .map((status, index) => (
            <div
              key={index}
              className="p-2 drop-target status-target"
              data-status={status.value}
            >
              <div className="flex justify-between mx-4">
                <h6 className="pb-4 break-word"
                  ref={(el) => setColumnRef(el, status.position)}
                >
                  {status.name}
                </h6>
                <Button
                  icon={<HiOutlinePlus />}
                  size="xs"
                  onClick={() => handleAddTaskDrawerOpen(status.value)}
                />
              </div>
              <div className="p-2 dark:bg-slate-700 w-96" style={{ height: 'calc(100% - 50px)' }}>
                {tasks
                  .filter((task) => task.status === status.value)
                  .map((task) => (
                    <div className="mb-3" key={task.id}>
                      <TaskBoardItem task={task} DataURL={DataURL} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
      <Drawer
        title="Add Task"
        isOpen={isOpen}
        drawerClass={'w-full md:w-[650px]'}
        bodyClass="overflow-x-hidden p-0 editDrawer"
        className=""
        onClose={onDrawerClose}
        onRequestClose={onDrawerClose}
      >
        <div className="p-5">
          <AddTask drawerClose={onDrawerClose} status={statusPosition[0].value} />
        </div>
      </Drawer>
    </>
  );
};

export default TaskListBoardComponent;
