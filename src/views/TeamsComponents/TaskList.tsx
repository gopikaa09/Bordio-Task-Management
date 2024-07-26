
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@/components/shared/DataTable'
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import IndexPage from '../Index/IndexPage';
import { TaskListQuery } from '@/Queries/Tasklist';
import TaskListGridComponent from './components/TaskListGridComponent';
import TaskListBoardComponent from './components/TaskListBoardComponent';
import { Outlet, useParams } from 'react-router-dom';
import { Button, Drawer } from '@/components/ui';
import AddTask from './components/AddTask';
type Tasks = {
  title: string,
  status: string,
  dueDate: string,
  type: string
}

const TaskList = () => {
  const TaskListUrl = 'http://localhost:4000/taskList';
  const [isOpen, setIsOpen] = useState(false)

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
  const openAddTaskDrawer = () => {
    setIsOpen(true)
  }
  const onDrawerClose = () => {
    setIsOpen(false)
  }
  const AddButton = () => {
    return (
      <>
        <Button
          onClick={openAddTaskDrawer}
        >Add Task</Button>
      </>
    )


  }


  return (
    <div className='m-5'>
      <IndexPage
        indexKey={'tasklist'}
        // addBtnLabel={"Add Task"}
        // addBtnUrl={'/frontEndTeam/tasks/add'}
        // addBtn={AddButton}
        dropdownItem={AddButton}
        addBtnLabelDropdown={true}
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
      <div>
        <Drawer
          title='Add Task'
          isOpen={isOpen}
          drawerClass={'w-full md:w-[650px]'}
          bodyClass='overflow-x-hidden p-0 editDrawer'
          className=''
          onClose={onDrawerClose}
          onRequestClose={onDrawerClose}
        >
          <div className="p-5">
            <AddTask drawerClose={onDrawerClose} />
          </div>

        </Drawer>

      </div>
      <Outlet />
    </div>
  );
};

export default TaskList;
