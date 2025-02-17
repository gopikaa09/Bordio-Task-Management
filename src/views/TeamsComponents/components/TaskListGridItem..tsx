import { Card, Tooltip } from "@/components/ui";
import StatusUpdate from "../InlineEdits/StatusUpdate";
import PriorityUpdate from "../InlineEdits/PriorityUpdate";
import StartDateUpdate from "../InlineEdits/StartDateUpdate";
import DueDateUpdate from "../InlineEdits/DueDateUpdate";
import ModuleUpdate from "../InlineEdits/ModuleUpdate";
import TimeEstimatesUpdate from "../InlineEdits/TimeEstimatesUpdate";
import AssigneeUpdate from "../InlineEdits/AssigneUpdate";
import { getInitials } from "@/utils/getInitials";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

const TaskListGridItem = ({ task, onTaskDrop }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    const stopDraggable = draggable({
      element: el,
      getInitialData: () => ({ id: task.id, status: task.status, index: task.index }),
      onDragStart: () => console.log('Dragging started for:', task.id),
      onDrop: () => console.log('Dropped task:', task.id),
    });

    const stopDropTarget = dropTargetForElements({
      element: el,
      onDragEnter: ({ id }) => console.log('Drag entered:', id),
      onDragLeave: ({ id }) => console.log('Drag left:', id),
      onDrop: ({ id, source }) => {
        console.log('Element dropped on target:', id);
        onTaskDrop(source.id, task.id);
      },
    });

    return () => {
      stopDraggable();
      stopDropTarget();
    };
  }, [task, onTaskDrop]);

  return (
    <Card
      bodyClass="p-4"
      className="hover:shadow-lg rounded-lg dark:bg-gray-700 mb-4 leading-8"
      ref={ref}
    >
      <div className="flex justify-between mb-2">
        <p className="font-semibold">{task.title}</p>
        <div className="bg-gray-400 px-3 py-2 rounded-full text-white text-xs font-semibold">
          <Tooltip title={task.assignes}>
            <span>{getInitials(task.assignes)}</span>
          </Tooltip>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Tooltip title="Status">
          <StatusUpdate task={task} id={task.id} taskStatus={task.status} />
        </Tooltip>
        <Tooltip title="Priority">
          <PriorityUpdate task={task} id={task.id} priorityStatus={task.priority} />
        </Tooltip>
        <Tooltip title="Start Date">
          <StartDateUpdate task={task} id={task.id} startDate={task.startDate} />
        </Tooltip>
        <Tooltip title="Due Date">
          <DueDateUpdate task={task} id={task.id} DueDate={task.dueDate} />
        </Tooltip>
        <Tooltip title="Module">
          <ModuleUpdate task={task} id={task.id} moduleStatus={task.modules} />
        </Tooltip>
        <Tooltip title="Estimated Time">
          <TimeEstimatesUpdate task={task} id={task.id} timeEstimates={task.estimates} />
        </Tooltip>
      </div>
    </Card>
  );
};

export default TaskListGridItem;
