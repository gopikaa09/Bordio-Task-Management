import { PriorityEnum, Task, TaskStatus } from "@/@types/tasks"
import BadgeIcon from "@/components/common/BadgeIcon"
import { Badge, Card, Tooltip } from "@/components/ui"
import { getInitials } from "@/utils/getInitials"
import dayjs from "dayjs"
import { FaRegCircle } from "react-icons/fa"

const TaskBoardItem = (tasks: Task) => {
  return (
    <>
      <Card bodyClass="p-4" className={`hover:shadow-lg rounded-lg dark:bg-gray-700 
        ${tasks?.status === 10 ? 'bg-blue-200' : tasks?.status === 20 ? 'bg-green-200' : tasks?.status === 30 ? 'bg-red-200' : 'bg-gray-200'}
        mb-4 leading-8 `}>
        <div className="flex justify-between">
          <p className="font-semibold">{tasks.title}</p>

          <div className="bg-gray-400 px-3 py-2 rounded-full text-white text-xs font-semibold">
            <Tooltip title={tasks?.assignes}>

              <span>{getInitials(tasks?.assignes)}</span>
            </Tooltip>
          </div>
        </div>

        <Tooltip title={'Status'}>
          <BadgeIcon icon={<FaRegCircle />} text={"hello"}></BadgeIcon>
        </Tooltip>
        <Tooltip title={'Priority'}>
          <Badge
            className="mr-3 border border-gray-400"
            content={PriorityEnum[tasks?.priority]}
            innerClass="bg-white text-gray-500"
          />
        </Tooltip>
        <Tooltip title={'Start Date'}>
          <Badge
            className="mr-3 border border-gray-400"
            content={dayjs(tasks?.startDate).format(
              'MM/DD/YYYY'
            )}
            innerClass="bg-white text-gray-500"
          />
        </Tooltip>
        <Tooltip title={'Due Date'}>
          <Badge
            className="mr-3 border border-gray-400"
            content={dayjs(tasks?.dueDate).format(
              'MM/DD/YYYY'
            )}
            innerClass="bg-white text-gray-500"
          />
        </Tooltip>
        <Tooltip title={'Module'}>
          <Badge
            className="mr-3 border border-gray-400"
            content={tasks?.modules}
            innerClass="bg-white text-gray-500"
          />
        </Tooltip>
      </Card>

    </>
  )
}
export default TaskBoardItem