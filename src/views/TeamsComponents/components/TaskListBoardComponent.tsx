import { Task, TaskStatus } from "@/@types/tasks"
import { groupBy } from "lodash"
import TaskBoardItem from "./TaskBoardItem"

const TaskListBoardComponent = ({ data: tasks }: any) => {

  const statuses = [
    { name: 'New Task', value: 10 },
    { name: 'Scheduled', value: 20 },
    { name: 'In Progress', value: 30 },
    { name: 'Completed', value: 40 },
  ]

  const ordered = groupBy(tasks, (x) => x.status)


  return (
    <>
      <div className={`flex overflow-x-auto overflow-y-auto`}>
        {statuses.map((status, id) => (
          <div key={id}
            className='p-2'
          >
            <h6 key={status.value} className="pb-4 break-words">
              {TaskStatus[status.value]}
            </h6>
            <div className='bg-slate-100 p-2 dark:bg-slate-700 w-72' style={{ height: 'calc(100% - 50px)' }}>

              {ordered[status.value]?.map((tasks: Task) => (
                <div className="mb-3" key={tasks.id}>
                  <TaskBoardItem {...tasks} />
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