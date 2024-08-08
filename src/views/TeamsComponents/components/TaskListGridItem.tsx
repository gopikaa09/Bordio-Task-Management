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

const TaskListGridItem = ({ task, DataURL }) => {
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

    return () => stopDraggable();
  }, [task]);

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
          <StatusUpdate task={task} id={task.id} taskStatus={task.status} DataURL={DataURL} />
        </Tooltip>
        <Tooltip title="Priority">
          <PriorityUpdate task={task} id={task.id} priorityStatus={task.priority} DataURL={DataURL} />

        </Tooltip>
        <Tooltip title="Start Date">
          <StartDateUpdate task={task} id={task.id} startDate={task.startDate} DataURL={DataURL} />

        </Tooltip>
        <Tooltip title="Due Date">
          <DueDateUpdate task={task} id={task.id} DueDate={task.dueDate} DataURL={DataURL} />

        </Tooltip>
        <Tooltip title="Module">
          <ModuleUpdate task={task} id={task.id} moduleStatus={task.modules} DataURL={DataURL} />

        </Tooltip>
        <Tooltip title="Estimated Time">
          <TimeEstimatesUpdate task={task} id={task.id} timeEstimates={task.estimates} DataURL={DataURL} />
        </Tooltip>
      </div>
    </Card>
  );
};

export default TaskListGridItem;
