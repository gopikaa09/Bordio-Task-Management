import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@/components/shared/DataTable';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import IndexPage from '../Index/IndexPage';
import TaskListGridComponent from './components/TaskListGridComponent';
import TaskListBoardComponent from './components/TaskListBoardComponent';
import { Outlet } from 'react-router-dom';
import { Button, Drawer } from '@/components/ui';
import AddTask from './components/AddTask';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { LabelsEnum, PriorityEnum, TaskStatus } from '@/@types/tasks';
import dayjs from 'dayjs';
import { monitorForElements, dropTargetForElements, draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useAppSelector } from '@/store';

type Tasks = {
  title: string;
  description: string;
  status: number;
  priority: number;
  assignes: string;
  labels: string;
  modules: string;
  startDate: string;
  dueDate: string;
  estimates: string;
  attachments: string;
};

const TaskList = () => {
  const TaskListUrl = 'http://localhost:4000/taskList';
  const [isOpen, setIsOpen] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['tasklist'],
    queryFn: async () => {
      const response = await axios.get(TaskListUrl);
      return response.data;
    }
  });

  const columnDefs: ColumnDef<Tasks>[] = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
        cell: (props) => props.row.original.title,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => TaskStatus[props.row.original.status],
      },
      {
        header: 'Priority',
        accessorKey: 'priority',
        cell: (props) => PriorityEnum[props.row.original.priority],
      },
      {
        header: 'Assignes',
        accessorKey: 'assignes',
        cell: (props) => props.row.original.assignes,
      },
      {
        header: 'Labels',
        accessorKey: 'labels',
        cell: (props) => LabelsEnum[props.row.original.labels],
      },
      {
        header: 'Modules',
        accessorKey: 'modules',
        cell: (props) => props.row.original.modules,
      },
      {
        header: 'Start Date',
        accessorKey: 'startDate',
        cell: (props) => props.row.original.startDate && dayjs(props.row.original.startDate).format('MM/DD/YYYY'),
      },
      {
        header: 'Due Date',
        accessorKey: 'dueDate',
        cell: (props) => props.row.original.dueDate && dayjs(props.row.original.dueDate).format('MM/DD/YYYY'),
      },
      {
        header: 'Estimates',
        accessorKey: 'estimates',
        cell: (props) => props.row.original.estimates,
      },
    ],
    []
  );

  const openAddTaskDrawer = () => setIsOpen(true);
  const onDrawerClose = () => setIsOpen(false);

  const AddButton = () => (
    <Button
      icon={<HiOutlinePlusCircle />}
      variant='solid'
      onClick={openAddTaskDrawer}
    >
      Add Task
    </Button>
  );



  const DataURL = 'http://localhost:4000/taskList'




  return (
    <div className='m-5 status-target' data-status={'taskList'}>
      <IndexPage
        indexKey={'tasklist'}
        dropdownItem={AddButton}
        addBtnLabelDropdown={true}
        title='Tasks'
        name="Tasks"
        tableColumns={columnDefs}
        queryFn={data}
        DataURL={DataURL}
        headersURL={`http://localhost:4000/headers`}
        gridItemComponent={TaskListGridComponent}
        boardViewComponent={TaskListBoardComponent}
        queryParamsShow={false}
      />
      <div>
        <Drawer
          title='Add Task'
          isOpen={isOpen}
          drawerClass={'w-full md:w-[650px]'}
          bodyClass='overflow-x-hidden p-0 editDrawer'
          onClose={onDrawerClose}
          onRequestClose={onDrawerClose}
        >
          <div className="p-5">
            <AddTask drawerClose={onDrawerClose} DataURL={DataURL} />
          </div>
        </Drawer>
      </div>
      <Outlet />

    </div>
  );
};

export default TaskList;
