import { Task } from "@/@types/tasks";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TaskBoardItem from "./TaskBoardItem";
import { monitorForElements, dropTargetForElements, draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import axios from "axios";
import { Button, Drawer } from "@/components/ui";
import { HiOutlinePlus } from "react-icons/hi";
import AddTask from "./AddTask";

const TaskListBoardComponent = ({ data: initialTasks, DataURL }: { data: Task[]; DataURL: string }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isOpen, setIsOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState([
    { name: 'New Task', value: 10 },
    { name: 'Scheduled', value: 20 },
    { name: 'In Progress', value: 30 },
    { name: 'Completed', value: 40 },
  ]);

  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
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

        let dropTargetIndex = dropTargetData.index;

        console.log('Drop target index:', dropTargetIndex);

        if (source.data.type === 'statusDiv') {
          const newOrder = [...statusOrder];
          const draggedItemIndex = newOrder.findIndex(item => item.value === source.data.value);

          console.log('Dragged item index:', draggedItemIndex);

          if (draggedItemIndex === -1) {
            console.error('Dragged item not found in statusOrder.');
            return;
          }

          const [movedItem] = newOrder.splice(draggedItemIndex, 1);

          // Adjust drop target index
          if (dropTargetIndex >= newOrder.length) {
            dropTargetIndex = newOrder.length - 1;
          }

          newOrder.splice(dropTargetIndex, 0, movedItem);

          setStatusOrder(newOrder);
          console.log('Updated status order:', newOrder);
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

    // Initialize drop targets with correct index
    const dropTargets = document.querySelectorAll('.status-target');
    dropTargets.forEach((target, index) => {
      dropTargetForElements({
        element: target,
        getData: () => ({ index, status: Number(target.getAttribute('data-status')) }),
      });
    });

    return () => stopMonitoring();
  }, [tasks, statusOrder, changeStatusMutation]);




  const setColumnRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      draggable({
        element: el,
        getInitialData: () => ({ type: 'statusDiv', value: statusOrder[index].value }),
        onDragStart: () => console.log(`Dragging started for column at index ${index}`),
        onDrop: () => console.log(`Dropped column at index ${index}`),
      });
    }
    columnRefs.current[index] = el;
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
        {statusOrder.map((status, index) => (
          <div
            key={status.value}
            className="p-2 drop-target status-target"
            data-status={status.value}
            ref={(el) => setColumnRef(el, index)}
          >
            <div className="flex justify-between mx-4">
              <h6 className="pb-4 break-word">
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
        onClose={onDrawerClose}
        onRequestClose={onDrawerClose}
      >
        <div className="p-5">
          <AddTask drawerClose={onDrawerClose} status={statusOrder[0].value} />
        </div>
      </Drawer>
    </>
  );
};

export default TaskListBoardComponent;
