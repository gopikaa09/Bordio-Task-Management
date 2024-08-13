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
import { Button, Dropdown, Input, Select } from '@/components/ui';
import { TbClockPlus } from 'react-icons/tb';
import { MdOutlineContentCopy } from 'react-icons/md';

type TimeSheet = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
  projectName: string;
};

type WeekData = {
  week: string;
  entries: TimeSheet[];
};

const timeSheetData: Record<string, WeekData> = {
  '2024-W32': {
    week: '2024-W32',
    entries: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        visits: 5,
        status: 'Active',
        progress: 80,
        projectName: 'Archd',
      },
      // More entries...
    ],
  },
  // Add more weeks as needed
};

type ReactTableProps<T> = {
  renderRowSubComponent: (props: { row: Row<T> }) => ReactElement;
  getRowCanExpand: (row: Row<T>) => boolean;
  initialData: T[];
};

const { Tr, Th, Td, THead, TBody } = Table;

function ReactTable<T extends object>({
  renderRowSubComponent,
  getRowCanExpand,
  initialData,
}: ReactTableProps<T>) {
  const [rows, setRows] = useState<T[]>(initialData);

  const headers = [
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
    { date: '16 aug 2024', hours: '9:00' },
  ];

  const dropdownItemsOptions = [
    { value: 'a', name: 'Archd' },
    { value: 'b', name: 'UttamBlashtech' },
    { value: 'c', name: 'StageXPS' },
  ];

  const onDropdownItemClick = (eventKey: string, e: SyntheticEvent) => {
    console.log('Dropdown Item Clicked', eventKey, e);
  };

  const dropDownButton = <Button variant='plain'>Archd</Button>;

  const columns = useMemo<ColumnDef<T>[]>(
    () => [
      {
        header: () => null, // No header
        id: 'expander', // It needs an ID
        cell: ({ row }) => (
          <>
            {row.getCanExpand() ? (
              <button
                className="text-lg"
                {...{ onClick: row.getToggleExpandedHandler() }}
              >
                {row.getIsExpanded() ? (
                  <HiOutlineChevronDown />
                ) : (
                  <HiOutlineChevronRight />
                )}
              </button>
            ) : null}
          </>
        ),
        subCell: () => null, // No expander on an expanded row
      },
      {
        header: 'Project Name',
        accessorKey: 'projectName',
        cell: () => (
          <Select
            options={dropdownItemsOptions}
          >
          </Select>
        ),
      },
      {
        header: 'Task',
        accessorKey: 'task',
        cell: () => (
          <Select
            options={dropdownItemsOptions}
          >
          </Select>
        ),
      },
      ...headers.map((header, index) => ({
        header: header.date,
        accessorKey: `header_${index}`, // Unique accessorKey for each column
        cell: () => <p><Input type='time' placeholder='0:00'></Input></p>,
      })),
      {
        header: 'Total',
        accessorKey: 'total',
      },
    ],
    [headers]
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
      firstName: '',
      lastName: '',
      age: 0,
      visits: 0,
      status: '',
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

function SubComponent() {
  const [selectedWeek, setSelectedWeek] = useState('2024-W32');
  const currentWeekData = timeSheetData[selectedWeek]?.entries || [];

  return (
    <ReactTable<TimeSheet>
      renderRowSubComponent={renderSubComponent}
      getRowCanExpand={() => true}
      initialData={currentWeekData} // Pass the week's data here
    />
  );
}

export default SubComponent;
