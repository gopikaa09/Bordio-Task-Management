
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
import { HiOutlinePlus, HiOutlinePlusCircle } from 'react-icons/hi';
import { LabelsEnum, PriorityEnum, TaskStatus } from '@/@types/tasks';
import dayjs from 'dayjs';
type Tasks = {
  title: string,
  description: string,
  status: number,
  priority: number
  assignes: string,
  lables: string
  modules: string
  startDate: string
  dueDate: string
  estimates: string,
  attachements: string
}

const TaskList = () => {
  const TaskListUrl = 'http://localhost:4000/taskList';
  const [isOpen, setIsOpen] = useState(false)

  const { data, error, isLoading, refetch } = useQuery({
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
              {TaskStatus[props.row.original.status]}
            </>
          )
        },
      },
      {
        header: 'Priority',
        accessorKey: 'priority',
        cell: (props) => {
          return (
            <>
              {PriorityEnum[props.row.original.priority]}
            </>
          )
        },
      },
      {
        header: 'Assignes',
        accessorKey: 'assignes',
        cell: (props) => {
          return (
            <>
              {props.row.original.assignes}
            </>
          )
        },
      },
      {
        header: 'Labels',
        accessorKey: 'labels',
        cell: (props) => {
          return (
            <>
              {LabelsEnum[props.row.original.lables]}
            </>
          )
        },
      },
      {
        header: 'Modules',
        accessorKey: 'modules',
        cell: (props) => {
          return (
            <>
              {props.row.original.modules}
            </>
          )
        },
      },
      {
        header: 'Start Date',
        accessorKey: 'startDate',
        cell: (props) => {
          return (
            props.row.original.dueDate &&
            dayjs(props.row.original.startDate).format(
              'MM/DD/YYYY'
            )
          )
        },
      },
      {
        header: 'Due Date',
        accessorKey: 'dueDate',
        cell: (props) => {
          return (
            props.row.original.dueDate &&
            dayjs(props.row.original.dueDate).format(
              'MM/DD/YYYY'
            )
          )
        },
      },

      {
        header: 'Estimates',
        accessorKey: 'estimates',
        cell: (props) => {
          return (
            <>
              {props.row.original.estimates}
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
          icon={<HiOutlinePlusCircle />}
          variant='solid'
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
        // grid={{ std: 250, xl: 250, lg: 250, md: 250, sm: 250, xs: 250 }}
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
