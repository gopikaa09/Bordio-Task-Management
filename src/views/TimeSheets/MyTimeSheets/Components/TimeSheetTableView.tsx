import { useMemo, Fragment, useState } from 'react';
import Table from '@/components/ui/Table';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { HiOutlineChevronRight, HiOutlineChevronDown } from 'react-icons/hi';
import type { ColumnDef, Row } from '@tanstack/react-table';
import type { ReactElement, SyntheticEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DropdownItem from '@/components/ui/Dropdown/DropdownItem';
import { Button, Dropdown } from '@/components/ui';
import { TbClockPlus } from 'react-icons/tb';
import { MdOutlineContentCopy } from 'react-icons/md';

type TimeSheet = {
  id: string;
  progress: number;
  projectName: string;
};

type ReactTableProps<T> = {
  renderRowSubComponent: (props: { row: Row<T> }) => ReactElement;
  getRowCanExpand: (row: Row<T>) => boolean;
};

const { Tr, Th, Td, THead, TBody } = Table;

function ReactTable<T extends object>({
  renderRowSubComponent,
  getRowCanExpand,
}: ReactTableProps<T>) {
  const TimeSheetUrl = 'http://localhost:4000/timeSheetList';
  const { data: TimeSheetsData = [], isLoading } = useQuery({
    queryKey: ['timesheets'],
    queryFn: async () => {
      const response = await axios.get(TimeSheetUrl);
      return response.data;
    },
  });

  const [rows, setRows] = useState<TimeSheet[]>(TimeSheetsData);

  const headers = [
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
  ];

  const dropdownItemsProjects = [
    { key: 'a', name: 'Archd' },
    { key: 'b', name: 'UttamBlashtech' },
    { key: 'c', name: 'StageXPS' },
  ];

  const onDropdownItemClick = (eventKey: string, e: SyntheticEvent) => {
    console.log('Dropdown Item Clicked', eventKey, e);
  };

  const onDropdownClick = (e: SyntheticEvent) => {
    console.log('Dropdown Clicked', e);
  };

  const dropDownButton = <Button variant='plain'>Archd</Button>;

  const columns = useMemo<ColumnDef<T>[]>(
    () => [
      {
        header: () => null,
        id: 'expander',
        cell: ({ row }) => (
          <>
            {row.getCanExpand() ? (
              <button className="text-lg" {...{ onClick: row.getToggleExpandedHandler() }}>
                {row.getIsExpanded() ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
              </button>
            ) : null}
          </>
        ),
        subCell: () => null,
      },
      {
        header: 'Project Name',
        accessorKey: 'projectName',
        cell: ({ cell }) => (
          <input
            type="text"
            value={cell.getValue() as string}
            onChange={(e) => {
              const newValue = e.target.value;
              setRows((prevRows) =>
                prevRows.map((row, idx) =>
                  idx === cell.row.index ? { ...row, projectName: newValue } : row
                )
              );
            }}
            className="input"
          />
        ),
      },
      {
        header: 'Task',
        accessorKey: 'task',
        cell: ({ cell }) => (
          <input
            type="text"
            value={cell.getValue() as string}
            onChange={(e) => {
              const newValue = e.target.value;
              setRows((prevRows) =>
                prevRows.map((row, idx) =>
                  idx === cell.row.index ? { ...row, task: newValue } : row
                )
              );
            }}
            className="input"
          />
        ),
      },
      ...headers.map((header, index) => ({
        header: header.date,
        accessorKey: `header_${index}`,
        cell: () => <p>{header.hours}</p>,
      })),
      {
        header: 'Total',
        accessorKey: 'total',
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
    const newRow: TimeSheet = {
      id: (rows.length + 1).toString(),
      progress: 0,
      projectName: '',
    };
    setRows([...rows, newRow]);
  };

  return (
    <>
      <h6 className='mb-5'>My Time Sheets</h6>
      <Table>
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} colSpan={header.colSpan}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Th>
              ))}
            </Tr>
          ))}
        </THead>
        <TBody>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <Tr>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
              {row.getIsExpanded() && (
                <Tr>
                  <Td colSpan={row.getVisibleCells().length}>
                    {renderRowSubComponent({ row })}
                  </Td>
                </Tr>
              )}
            </Fragment>
          ))}
          {/* Add a summary or total row at the end */}
          <Tr>
            <Td colSpan={3}>Total</Td>
            {headers.map((header, index) => (
              <Td key={index}>
                18:00
                {/* Customize the content as needed */}
                {/* Display total hours calculation */}
              </Td>
            ))}
            <Td>80:00 </Td>
          </Tr>
        </TBody>
      </Table>
      <div className='flex gap-4 my-4'>
        <Button icon={<TbClockPlus />} onClick={handleAddRow}>
          Add TimeSheet Row
        </Button>
        <Button icon={<MdOutlineContentCopy />}>
          Copy Previous Week
        </Button>
      </div>
    </>
  );

}

const renderSubComponent = ({ row }: { row: Row<TimeSheet> }) => {
  return (
    <pre style={{ fontSize: '10px' }}>
      <code>{JSON.stringify(row.original, null, 2)}</code>
    </pre>
  );
};

const SubComponent = () => {
  return (
    <ReactTable<TimeSheet>
      renderRowSubComponent={renderSubComponent}
      getRowCanExpand={() => true}
    />
  );
};

export default SubComponent;
