import { useParams } from "react-router-dom";
import AddTask from "./components/AddTask";


const TaskCrudRoutes = () => {

  const { category } = useParams();
  console.log(category)

  return (
    <>
      {
        category === 'tasks' && <AddTask />
      }
    </>
  )
}

export default TaskCrudRoutes