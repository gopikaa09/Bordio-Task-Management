import { Card } from "@/components/ui"
import { Badge, Tooltip } from "@/components/ui"
import { getInitials } from "@/utils/getInitials"
import dayjs from "dayjs"
import { FaRegCircle } from "react-icons/fa"
import { LuCalendarCheck2, LuCalendarClock, LuCircleDashed } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TbAlarm } from "react-icons/tb"
import { HiOutlineExclamationCircle } from "react-icons/hi"
import { MdOutlineBarChart, MdOutlineViewModule } from "react-icons/md"
import BadgeIcon from "@/components/common/BadgeIcon"
import { PriorityEnum, TaskStatus } from "@/@types/tasks"
const TaskListGridComponent = ({ item: tasks }: any) => {
  return (
    <Card bodyClass="p-4" className={`hover:shadow-lg rounded-lg dark:bg-gray-700 
      mb-4 leading-8 `}>
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
          <BadgeIcon icon={
            tasks?.status === 10 ?
              <FaRegCircle /> : tasks?.status === 20 ? <TbAlarm /> : tasks?.status === 30 ? <LuCircleDashed /> : <FaRegCircleCheck />} text={TaskStatus[tasks?.status]}></BadgeIcon>
        </Tooltip>
        <Tooltip title={'Priority'}>
          <BadgeIcon icon={tasks?.priority === 1 ? <HiOutlineExclamationCircle />
            : tasks?.priority === 2 ? <MdOutlineBarChart /> : tasks?.priority === 3 ? <MdOutlineBarChart /> :
              tasks?.priority === 4 ? <MdOutlineBarChart /> : <FaRegCircle />

          }
            text={PriorityEnum[tasks?.priority]}
          />
        </Tooltip>
        <Tooltip title={'Start Date'}>
          <BadgeIcon icon={<LuCalendarClock />} text={dayjs(tasks?.startDate).format(
            'MM/DD/YYYY'
          )} />
        </Tooltip>
        <Tooltip title={'Start Date'}>
          <BadgeIcon icon={<LuCalendarCheck2 />
          } text={dayjs(tasks?.dueDate).format(
            'MM/DD/YYYY'
          )} />
        </Tooltip>
        <Tooltip title={'Module'}>
          <BadgeIcon icon={<MdOutlineViewModule />} text={tasks?.modules} />
        </Tooltip>
      </div>
    </Card>
  )
}
export default TaskListGridComponent
