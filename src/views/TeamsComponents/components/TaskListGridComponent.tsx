import { Card } from "@/components/ui"

const TaskListGridComponent = ({ data: tasks }: any) => {
  console.log('====================================');
  console.log(tasks);
  console.log('====================================');
  return (
    <Card>
      <p>{tasks?.title}</p>
    </Card>
  )
}
export default TaskListGridComponent



// import { Task } from "@/@types/tasks";
// import { Card } from "@/components/ui";

// const TaskListGridComponent = ({ data: tasks }) => {
//   return (
//     <div className={`grid grid-cols-250 xl:grid-cols-250 lg:grid-cols-250 md:grid-cols-250 sm:grid-cols-250 xs:grid-cols-250 gap-8 mt-2 mb-2`}>
//       {tasks?.map((task: Task) => {
//         return (
//           <Card key={task.id}>
//             <p>{task.title}</p>
//           </Card>
//         );
//       })}
//     </div>
//   );
// };

// export default TaskListGridComponent;