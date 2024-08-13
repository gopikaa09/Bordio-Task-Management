import { ColumnDef, DataTable } from '@/components/shared'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useMemo } from 'react'
type TimeSheets = {
  date: string
}
const TimeSheetTableView = () => {
  const sheetUrl = 'http://localhost:4000/timeSheetList'

  const { data } = useQuery({
    queryKey: ['TimeSheet'],
    queryFn: async () => {
      const response = await axios.get(sheetUrl)
      return response?.data
    }
  })

  return (
    <div>
      <DataTable
        columns={columnDefs}
        data={data}
      />

    </div>
  )
}

export default TimeSheetTableView
