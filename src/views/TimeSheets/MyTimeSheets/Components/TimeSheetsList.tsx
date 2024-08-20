import { Button, Drawer } from '@/components/ui'
import IndexPage from '@/views/Index/IndexPage'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import React, { useMemo, useState } from 'react'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import AddTimeSheet from './AddTimeSheet'
import TimeSheetTableView from './TimeSheetTableView'
import { DataTable } from '@/components/shared'
type TimeSheets = {
  date: string
}
const TimeSheetsList = () => {
  const sheetUrl = 'http://localhost:4000/timeSheetList'
  const headersURL = 'http://localhost:4000/timeSheetHeaders'
  const [isOpen, setIsOpen] = useState(false);
  const openAddTaskDrawer = () => setIsOpen(true);

  const onDrawerClose = () => setIsOpen(false);
  const { data } = useQuery({
    queryKey: ['TimeSheet'],
    queryFn: async () => {
      const response = await axios.get(sheetUrl)
      return response?.data
    }
  })
  const AddButton = () => (
    <Button
      icon={<HiOutlinePlusCircle />}
      variant='solid'
      onClick={openAddTaskDrawer}

    >
      Add Time Entry
    </Button>
  );
  const columnDefs: ColumnDef<TimeSheets>[] = useMemo(
    () => [
      {
        header: 'Date',
        accessorKey: 'date',
        cell: (props) => props.row.original.date,
      },
    ],
    []
  );

  console.log(data);
  return (
    <div>
      <TimeSheetTableView />
      {/* <DataTable
        columns={columnDefs}
        data={data}
      /> */}
      <div>
        <Drawer
          title='Add Time Entry'
          isOpen={isOpen}
          drawerClass={'w-full md:w-[650px]'}
          bodyClass='overflow-x-hidden p-0 editDrawer'
          onClose={onDrawerClose}
          onRequestClose={onDrawerClose}
        >
          <div className="p-5">
            <AddTimeSheet />
          </div>
        </Drawer>
      </div>
    </div>
  )
}

export default TimeSheetsList
