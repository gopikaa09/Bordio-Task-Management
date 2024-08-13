import { Task } from "@/@types/tasks";
import { Card, Tooltip } from "@/components/ui";
import { getInitials } from "@/utils/getInitials";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import StatusUpdate from "../InlineEdits/StatusUpdate";
import PriorityUpdate from "../InlineEdits/PriorityUpdate";
import StartDateUpdate from "../InlineEdits/StartDateUpdate";
import DueDateUpdate from "../InlineEdits/DueDateUpdate";
import ModuleUpdate from "../InlineEdits/ModuleUpdate";
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';

const TaskBoardItem = ({ task, DataURL }: { task: Task; DataURL: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    const stopDraggable = draggable({
      element: el,
      getInitialData: () => ({ type: 'taskCard', id: task.id, status: task.status }),
      onDragStart: () => {
        el.classList.add('dragging');
        setIsDragging(true);
        console.log('Dragging started:', task.id);
      },
      // onGenerateDragPreview: ({
      //   nativeSetDragImage: DataTransfer['setDragImage'] | null;
      //   render: ({ container }) => {
      //     setPreview(container);
      //     setCustomNativeDragPreview({ element: container, nativeSetDragImage });
      //   },
      // }),
      onDrop: () => {
        el.classList.remove('dragging');
        setIsDragging(false);
        console.log('Dropped task:', task.id);
        setPreview(null);
      },

    });

    return () => stopDraggable();
  }, [task]);

  return (
    <div ref={ref} id={task.id}>
      <Card
        bodyClass="p-4"
        className={`dark:bg-gray-700
          ${task.status === 10 ? 'bg-blue-200' : task.status === 20 ? 'bg-green-200' : task.status === 30 ? 'bg-red-200' : 'bg-gray-200'}
          mb-4 leading-8
          ${isDragging ? 'opacity-50' : ''}
        `}
      >
        <div className="flex justify-between mb-2">
          <p className="font-semibold">{task.title}</p>
          <div className="bg-gray-400 px-3 py-2 rounded-full text-white text-xs font-semibold">
            <Tooltip title={task.assignes}>
              <span>{getInitials(task.assignes)}</span>
            </Tooltip>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap ">
          <Tooltip title={'Status'}>
            <StatusUpdate task={task} id={task.id} taskStatus={task.status} DataURL={DataURL} />
          </Tooltip>
          <Tooltip title={'Priority'}>
            <PriorityUpdate task={task} id={task.id} priorityStatus={task.priority} DataURL={DataURL} />
          </Tooltip>
          <Tooltip title={'Start Date'}>
            <StartDateUpdate task={task} id={task.id} startDate={task.startDate} DataURL={DataURL} />
          </Tooltip>
          <Tooltip title={'Due Date'}>
            <DueDateUpdate task={task} id={task.id} DueDate={task.dueDate} DataURL={DataURL} />
          </Tooltip>
          <Tooltip title={'Module'}>
            <ModuleUpdate task={task} id={task.id} moduleStatus={task.modules} DataURL={DataURL} />
          </Tooltip>
        </div>
      </Card>
      {preview && <CardPreview card={task} />}
    </div>
  );
};

export default TaskBoardItem;

const CardPreview = ({ card }: { card: Task }) => {
  return (
    <Card
      bodyClass="p-4"
      className={`dark:bg-gray-700
    ${card.status === 10 ? 'bg-blue-200' : card.status === 20 ? 'bg-green-200' : card.status === 30 ? 'bg-red-200' : 'bg-gray-200'}
    mb-4 leading-8
    opacity-50
    `}
    >
      <div className="flex justify-between mb-2">
        <p className="font-semibold">{card.title}</p>
        <div className="bg-gray-400 px-3 py-2 rounded-full text-white text-xs font-semibold">
          <Tooltip title={card.assignes}>
            <span>{getInitials(card.assignes)}</span>
          </Tooltip>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap ">
        <Tooltip title={'Status'}>
          <StatusUpdate task={card} id={card.id} taskStatus={card.status} DataURL={DataURL} />
        </Tooltip>
        <Tooltip title={'Priority'}>
          <PriorityUpdate task={card} id={card.id} priorityStatus={card.priority} DataURL={DataURL} />
        </Tooltip>
        <Tooltip title={'Start Date'}>
          <StartDateUpdate task={card} id={card.id} startDate={card.startDate} DataURL={DataURL} />
        </Tooltip>
        <Tooltip title={'Due Date'}>
          <DueDateUpdate task={card} id={card.id} DueDate={card.dueDate} DataURL={DataURL} />
        </Tooltip>
        <Tooltip title={'Module'}>
          <ModuleUpdate task={card} id={card.id} moduleStatus={card.modules} DataURL={DataURL} />
        </Tooltip>
      </div>
    </Card>
  )
}
