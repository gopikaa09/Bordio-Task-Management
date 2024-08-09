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
  const statuses = [
    { name: 'New Task', value: 10, position: 1 },
    { name: 'Scheduled', value: 20, position: 2 },
    { name: 'In Progress', value: 30, position: 3 },
    { name: 'Completed', value: 40, position: 4 },
  ];
  const [columns, setColumns] = useState(statuses);

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

  const handleColumnRef = () => {
    setColumns(statusPosition)
  }

  const DataURL = 'http://localhost:4000/taskList'
  const [statusPosition, setStatusPosition] = useState(statuses);
  useEffect(() => {
    const stopMonitoring = monitorForElements({
      onDrop: async ({ source, location }) => {
        const dropTargets = location.current.dropTargets;

        console.log('Drop targets:', dropTargets);

        if (dropTargets.length === 0) {
          console.error('No drop targets found.');
          return;
        }

        const dropTargetData = dropTargets[0]?.data;
        console.log(dropTargetData);

        if (!dropTargetData || typeof dropTargetData.index !== 'number') {
          console.error('Invalid drop target data.');
          return;
        }

        const dropTargetIndex = dropTargetData.index;
        console.log(dropTargetIndex);


        const newStatus = [...statusPosition];
        console.log(newStatus);
        const draggedItemIndex = newStatus.findIndex(item => item.index === source.data.index);
        if (draggedItemIndex === -1) return;

        const [movedItem] = newStatus.splice(draggedItemIndex, 1);
        newStatus.splice(dropTargetIndex, 0, movedItem);

        setStatusPosition(newStatus);
        console.log(statusPosition);
        console.log(`Item ID: ${source.data.id} moved to position: ${dropTargetIndex}`);
      },
    });

    const dropTargets = document.querySelectorAll('.status-target');
    dropTargets.forEach((target, index) => {
      dropTargetForElements({
        element: target,
        getData: () => ({ index })
      });
    });

    return () => stopMonitoring();
  }, [data, statusPosition]);



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
        initialBoardStatus={statuses}
        updatedBoardStatus={statusPosition}
        DataURL={DataURL}
        headersURL={`http://localhost:4000/headers`}
        gridItemComponent={TaskListGridComponent}
        boardViewComponent={TaskListBoardComponent}
        onColumnDataSend={handleColumnRef}
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
