import { Task, TaskStatus } from "@/@types/tasks"
import { groupBy } from "lodash"
import { useEffect, useRef, useState } from 'react';
import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
// import { token } from '@atlaskit/tokens';

import TaskBoardItem from "./TaskBoardItem"
// import { DropIndicator } from '../../src/box';

const itemStyles = css({
  position: 'relative',
  display: 'inline-block',
  padding: 'space.20 16px',
  border: `1px solid lightgrey`,
});

const TaskListBoardComponent = ({ data: tasks }: any) => {

  const statuses = [
    { name: 'New Task', value: 10 },
    { name: 'Scheduled', value: 20 },
    { name: 'In Progress', value: 30 },
    { name: 'Completed', value: 40 },
  ]

  const ordered = groupBy(tasks, (x) => x.status)

  const handleDragStart = (event: any, task: Task) => {
    event.dataTransfer.setData('task', JSON.stringify(task));
  };

  const handleDrop = (event: any, statusValue: number) => {
    const task = JSON.parse(event.dataTransfer.getData('task'));
    task.status = statusValue;
  };

  return (
    <>
      <div className={`flex overflow-x-auto overflow-y-auto`}>
        {statuses.map((status, id) => (
          <div
            key={id}
            className='p-2'
            onDrop={(e) => handleDrop(e, status.value)}
            onDragOver={(e) => e.preventDefault()}
          >
            <h6 key={status.value} className="pb-4 break-words">
              {TaskStatus[status.value]}
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
    </>
  )
}

export default TaskListBoardComponent
