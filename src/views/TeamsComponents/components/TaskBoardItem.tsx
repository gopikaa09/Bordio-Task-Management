import { Task } from "@/@types/tasks";
import { Card, Tooltip } from "@/components/ui";
import { getInitials } from "@/utils/getInitials";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import StatusUpdate from "../InlineEdits/StatusUpdate";
import PriorityUpdate from "../InlineEdits/PriorityUpdate";
import StartDateUpdate from "../InlineEdits/StartDateUpdate";
import DueDateUpdate from "../InlineEdits/DueDateUpdate";
import ModuleUpdate from "../InlineEdits/ModuleUpdate";

const TaskBoardItem = ({ task }: { task: Task }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    const stopDraggable = draggable({
      element: el,
      getInitialData: () => ({ id: task.id, status: task.status }),
      onDragStart: () => console.log('Dragging started for:', task.id),
      onDrop: () => console.log('Dropped task:', task.id),
    });

    return () => stopDraggable();
  }, [task]);

  return (
    <div ref={ref} id={task.id}>
      <Card
        bodyClass="p-4"
        className={` dark:bg-gray-700
          ${task.status === 10 ? 'bg-blue-200' : task.status === 20 ? 'bg-green-200' : task.status === 30 ? 'bg-red-200' : 'bg-gray-200'}
          mb-4 leading-8`}
      >
        <div className="flex justify-between mb-2">
          <p className="font-semibold">{task.title}</p>
          <div className="bg-gray-400 px-3 py-2 rounded-full text-white text-xs font-semibold">
            <Tooltip title={task.assignes}>
              <span>{getInitials(task.assignes)}</span>
            </Tooltip>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap bg-gre">
          <Tooltip title={'Status'}>
            <StatusUpdate task={task} id={task.id} taskStatus={task.status} />
          </Tooltip>
          <Tooltip title={'Priority'}>
            <PriorityUpdate task={task} id={task.id} priorityStatus={task.priority} />
          </Tooltip>
          <Tooltip title={'Start Date'}>
            <StartDateUpdate task={task} id={task.id} startDate={task.startDate} />
          </Tooltip>
          <Tooltip title={'Due Date'}>
            <DueDateUpdate task={task} id={task.id} DueDate={task.dueDate} />
          </Tooltip>
          <Tooltip title={'Module'}>
            <ModuleUpdate task={task} id={task.id} moduleStatus={task.modules} />
          </Tooltip>
        </div>
      </Card>
    </div>
  );
};

export default TaskBoardItem;






















