import { useEffect, useRef } from "react";
import { Card } from "@/components/ui";
import { Badge, Tooltip } from "@/components/ui";
import { getInitials } from "@/utils/getInitials";
import dayjs from "dayjs";
import { FaRegCircle } from "react-icons/fa";
import { LuCalendarCheck2, LuCalendarClock, LuCircleDashed } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TbAlarm } from "react-icons/tb";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdOutlineBarChart, MdOutlineViewModule } from "react-icons/md";
import BadgeIcon from "@/components/common/BadgeIcon";
import { PriorityEnum, TaskStatus } from "@/@types/tasks";
import StatusUpdate from "../InlineEdits/StatusUpdate";
import PriorityUpdate from "../InlineEdits/PriorityUpdate";
import StartDateUpdate from "../InlineEdits/StartDateUpdate";
import DueDateUpdate from "../InlineEdits/DueDateUpdate";
import ModuleUpdate from "../InlineEdits/ModuleUpdate";
import TimeEstimatesUpdate from "../InlineEdits/TimeEstimatesUpdate";
import AssigneeUpdate from "../InlineEdits/AssigneUpdate";
import { draggable, monitorForElements, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

const TaskListGridComponent = ({ item: tasks }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    // Setup draggable
    const stopDraggable = draggable({
      element: el,
      getInitialData: () => ({ id: tasks.id, status: tasks.status }),
      onDragStart: () => console.log('Dragging started for:', tasks.id),
      onDrop: () => console.log('Dropped task:', tasks.id),
    });

    // Setup monitor for elements
    const stopMonitoring = monitorForElements({
      element: el,
      onElementDragStart: ({ id }) => console.log('Element drag started:', id),
      onElementDrop: ({ id }) => console.log('Element dropped:', id),
    });

    // Setup drop target for elements
    const stopDropTarget = dropTargetForElements({
      element: el,
      onDragEnter: ({ id }) => console.log('Drag entered:', id),
      onDragLeave: ({ id }) => console.log('Drag left:', id),
      onDrop: ({ id }) => {
        console.log('Element dropped on target:', id);
        // Handle the drop logic here
      },
    });

    return () => {
      stopDraggable();
      stopMonitoring();
      stopDropTarget();
    };
  }, [tasks]);

  return (
    <Card
      bodyClass="p-4"
      className={`hover:shadow-lg rounded-lg dark:bg-gray-700 mb-4 leading-8`}
      ref={ref}
    >
      <div className="flex justify-between mb-2">
        <p className="font-semibold">{tasks?.title}</p>
        <div className="bg-gray-400 px-3 py-2 rounded-full text-white text-xs font-semibold">
          <Tooltip title={tasks?.assignes}>
            <span>{getInitials(tasks?.assignes)}</span>
          </Tooltip>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Tooltip title={'Status'}>
          <StatusUpdate task={tasks} id={tasks?.id} taskStatus={tasks?.status} />
        </Tooltip>
        <Tooltip title={'Priority'}>
          <PriorityUpdate task={tasks} id={tasks?.id} priorityStatus={tasks?.priority} />
        </Tooltip>
        <Tooltip title={'Start Date'}>
          <StartDateUpdate task={tasks} id={tasks?.id} startDate={tasks?.startDate} />
        </Tooltip>
        <Tooltip title={'Due Date'}>
          <DueDateUpdate task={tasks} id={tasks?.id} DueDate={tasks?.dueDate} />
        </Tooltip>
        <Tooltip title={'Module'}>
          <ModuleUpdate task={tasks} id={tasks?.id} moduleStatus={tasks?.modules} />
        </Tooltip>
        <Tooltip title={'Estimated Time'}>
          <TimeEstimatesUpdate task={tasks} id={tasks?.id} timeEstimates={tasks?.estimates} />
        </Tooltip>
      </div>
    </Card>
  );
};

export default TaskListGridComponent;
