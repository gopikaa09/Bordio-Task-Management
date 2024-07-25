
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@/components/shared/DataTable'
import axios from 'axios';
import { useMemo, useState } from 'react';
import IndexPage from '../Index/IndexPage';
import { TaskListQuery } from '@/Queries/Tasklist';
import TaskListGridComponent from './components/TaskListGridComponent';
import TaskListBoardComponent from './components/TaskListBoardComponent';
import { Outlet, useParams } from 'react-router-dom';
type Tasks = {
  title: string,
  status: string,
  dueDate: string,
  type: string
}

const TaskList = () => {
  const TaskListUrl = 'http://localhost:4000/taskList'; // Ensure this is the correct URL

  const { data, error, isLoading } = useQuery({
    queryKey: ['tasklist'],
    queryFn: async () => {
      const response = await axios.get(TaskListUrl);
      return response.data;
    }
  });

  const TasklistQuery = new TaskListQuery()


  // const { data: Tasks } = useQuery({
  //   queryKey: ['TasksLIst'],
  //   queryFn: () => TaskListQuery.getAll()
  // })




  const columns: ColumnDef<Tasks>[] = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
        cell: (props) => {
          return (
            <>
              {props.row.original.title}
            </>
          )
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          return (
            <>
              {props.row.original.status}
            </>
          )
        },
      },
      {
        header: 'Title',
        accessorKey: 'type',
        cell: (props) => {
          return (
            <>
              {props.row.original.type}
            </>
          )
        },
      },
      {
        header: 'Title',
        accessorKey: 'dueDate',
        cell: (props) => {
          return (
            <>
              {props.row.original.dueDate}
            </>
          )
        },
      },




    ],
  )


  return (
    <div className='m-5'>
      <IndexPage
        indexKey={'tasklist'}
        addBtnLabel={"Add Task"}
        addBtnUrl={'/frontEndTeam/tasks/add'}
        title='Tasks'
        name="Tasks"
        tableColumns={columns}
        queryFn={data}
        gridItemComponent={TaskListGridComponent}
        grid={{ std: 250, xl: 250, lg: 250, md: 250, sm: 250, xs: 250 }}
        // isSelectable={true}
        boardViewComponent={TaskListBoardComponent}
        queryParamsShow={false}
      />
      <Outlet />
    </div>
  );
};

export default TaskList;
