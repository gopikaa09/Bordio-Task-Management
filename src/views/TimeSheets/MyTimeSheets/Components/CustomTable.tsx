import { useMemo, Fragment, useState } from 'react';
import Table from '@/components/ui/Table';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { HiOutlineChevronRight, HiOutlineChevronDown, HiOutlineTrash, HiOutlineMinusCircle, HiOutlinePlusCircle } from 'react-icons/hi';
import type { ColumnDef, Row } from '@tanstack/react-table';
import type { ReactElement } from 'react';
import { Button, Card, Input, Select } from '@/components/ui';
import { TbClockPlus } from 'react-icons/tb';
import { MdOutlineContentCopy } from 'react-icons/md';

type TimeSheet = {
  id: string;
  projectName: string;
  task: string;
  [key: string]: any; // To handle dynamic keys for dates
};

type ReactTableProps<T> = {
  renderRowSubComponent: (props: { row: Row<T> }) => ReactElement;
  getRowCanExpand: (row: Row<T>) => boolean;
  initialData: T[];
  headers: { date: string; hours: string }[];
};

function CustomTable<T extends TimeSheet>({
  renderRowSubComponent,
  getRowCanExpand,
  initialData,
  headers,
}: ReactTableProps<T>) {
  const [rows, setRows] = useState<T[]>(initialData);

  const ProjectDropDownOptions = [
    { value: 'a', label: 'Project 1' },
    { value: 'b', label: 'Project 2' },
    { value: 'c', label: 'Project 3' },
  ];

  const TaskDropDownOptions = [
    { value: 'a', label: 'Task 1' },
    { value: 'b', label: 'Task 2' },
    { value: 'c', label: 'Task 3' },
  ];

  const handleTimeInput = (rowId: string, columnKey: string, value: string) => {
    setRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? { ...row, [columnKey]: value }
          : row
      )
    );
  };

  const calculateHorizontalTotal = (row: T) => {
    return headers.reduce((total, header, index) => {
      const time = row[`header_${index}`];
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        return total + (hours || 0) + (minutes || 0) / 60;
      }
      return total;
    }, 0);
  };

  const calculateVerticalTotals = () => {
    return headers.map((_, index) => {
      const total = rows.reduce((sum, row) => {
        const time = row[`header_${index}`];
        if (time) {
          const [hours, minutes] = time.split(':').map(Number);
          return sum + (hours || 0) + (minutes || 0) / 60;
        }
        return sum;
      }, 0);
      const hours = Math.floor(total);
      const minutes = Math.round((total - hours) * 60);
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    });
  };

  const columns = useMemo<ColumnDef<T>[]>(
    () => [
      {
        header: ({ table }) => {
          return (
            <button
              className="text-xl"
              {...{
                onClick:
                  table.getToggleAllRowsExpandedHandler(),
              }}
            >
              {table.getIsAllRowsExpanded() ? (
                <HiOutlineMinusCircle />
              ) : (
                <HiOutlinePlusCircle />
              )}
            </button>
          )
        }, // No header
        id: 'expander', // It needs an ID
        cell: ({ row, getValue }) => {
          return (
            <>
              {row.getCanExpand() ? (
                <button
                  className="text-xl"
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                  }}
                >
                  {row.getIsExpanded() ? (
                    <HiOutlineMinusCircle />
                  ) : (
                    <HiOutlinePlusCircle />
                  )}
                </button>
              ) : null}
              {getValue()}
            </>
          )
        },
        subCell: ({ row }) => {
          return (
            <table className="sub-table">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header.date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {headers.map((header, index) => (
                    <td key={index}>
                      <Input
                        size='sm'
                        type='time'
                        placeholder='0:00'
                        value={row.original[`header_${index}`] || ''}
                        onChange={(e) => handleTimeInput(row.original.id, `header_${index}`, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )
        }, // No expander on an expanded row
      },
      {
        header: 'Project 1',
        accessorKey: 'projectName',
        cell: ({ row }) => (
          <Select
            size='sm'
            options={ProjectDropDownOptions}
            placeholder="Select Project"
            onChange={(value) => console.log('Selected Project:', value)}
            value={row.getValue('projectName')}
          />
        ),
      },
      {
        header: 'Task',
        accessorKey: 'task',
        cell: ({ row }) => (
          <Select
            size='sm'
            options={TaskDropDownOptions}
            placeholder="Select Task"
            onChange={(value) => console.log('Selected Task:', value)}
            value={row.getValue('task')}
          />
        ),
      },
      ...headers.map((header, index) => ({
        header: header.date,
        accessorKey: `header_${index}`,
        cell: ({ row }) => (
          <Input
            size='sm'
            type='time'
            placeholder='0:00'
            value={row.getValue(`header_${index}`) || ''}
            onChange={(e) => handleTimeInput(row.original.id, `header_${index}`, e.target.value)}
          />
        ),
      })),
      {
        header: 'Total',
        accessorKey: 'total',
        cell: ({ row }) => {
          const total = calculateHorizontalTotal(row.original);
          const hours = Math.floor(total);
          const minutes = Math.round((total - hours) * 60);
          return `${hours}:${minutes.toString().padStart(2, '0')}`;
        },
      },
    ],
    [headers, rows]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const handleAddRow = () => {
    const newRow: T = {
      id: (rows.length + 1).toString(),
      projectName: '',
      task: '',
      ...headers.reduce((acc, header, index) => {
        acc[`header_${index}`] = '';
        return acc;
      }, {} as Record<string, string>),
    } as T;
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const verticalTotals = calculateVerticalTotals();

  return (
    <div className='max-w-900px overflow-x-auto'>
      <table className='custom-table'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => {
            return (
              <Fragment key={row.id}>
                <tr>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td>
                    <Button onClick={() => handleDeleteRow(row.original.id)} variant='twoTone' size='xs' color='red' shape='circle' icon={<HiOutlineTrash />}></Button>
                  </td>
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    <td colSpan={row.getVisibleCells().length}>
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
          <tr className={`last-row`}>
            <td colSpan={2}>
              <div className='flex gap-4 my-4'>
                <Button size='sm' icon={<TbClockPlus />} onClick={handleAddRow}>
                  Add Task
                </Button>
                <Button size='sm' icon={<MdOutlineContentCopy />}>
                  Copy Previous Timesheet
                </Button>
              </div>
            </td>
            {verticalTotals.map((total, index) => (
              <td key={index}>{total}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable;
