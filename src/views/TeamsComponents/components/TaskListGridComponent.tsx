import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { monitorForElements, dropTargetForElements, draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import TaskListGridItem from "./TaskListGridItem";

const TaskListGridComponent = ({ data: initialTasks, DataURL }) => {


  const [tasks, setTasks] = useState(initialTasks);

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

  useEffect(() => {
    const stopMonitoring = monitorForElements({
      onDrop: async ({ source, location }) => {
        const dropTargets = location.current.dropTargets;

        console.log('Drop targets:', dropTargets);

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

        const newPeoples = [...tasks];
        const draggedItemIndex = newPeoples.findIndex(item => item.id === source.data.id);
        if (draggedItemIndex === -1) return;

        const [movedItem] = newPeoples.splice(draggedItemIndex, 1);
        newPeoples.splice(dropTargetIndex, 0, movedItem);

        setTasks(newPeoples);
        console.log(`Item ID: ${source.data.id} moved to position: ${dropTargetIndex}`);

      },
    });

    const dropTargets = document.querySelectorAll('.drop-target');
    dropTargets.forEach((target, index) => {
      dropTargetForElements({
        element: target,
        getData: () => ({ index })
      });
    });

    return () => stopMonitoring();
  }, [tasks]);

  return (
    <div className="grid xs:grid-cols-1 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 ">
      {
        tasks.map((task, index) => (
          <>
            <div key={task.id} data-index={index}
              className="drop-target"
            >
              <TaskListGridItem key={task.id} task={task} DataURL={DataURL} />
            </div>
          </>
        ))}
    </div>
  );
};

export default TaskListGridComponent;
