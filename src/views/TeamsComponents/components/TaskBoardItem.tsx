import { Task } from "@/@types/tasks"
import { Card } from "@/components/ui"

const TaskBoardItem = (tasks: Task) => {
  return (
    <>
      <Card bodyClass="p-4" className={`hover:shadow-lg rounded-lg dark:bg-gray-700 bg-gray-50 mb-4`}>
        <p>{tasks.title}</p>
      </Card>

    </>
  )
}
export default TaskBoardItem