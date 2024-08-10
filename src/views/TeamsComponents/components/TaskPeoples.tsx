import { ColumnDef, DataTable } from "@/components/shared";
import { Avatar, Button, Card } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Badge from '@/components/ui/Badge'


import { useMemo, useState } from "react";
import { HiOutlineUser } from "react-icons/hi";
import IndexPage from "@/views/Index/IndexPage";
import PeoplesListComponent from "./PeoplesListComponent";
type Member = {
  id: string;
  name: string;
  email: string;
  isActive: boolean
}
const TaskPeople = () => {
  const PeoplesUrl = 'http://localhost:4000/peoples';

  const { data: PeopleData, error, isPending } = useQuery({
    queryKey: ['taskpeople'],
    queryFn: async () => {
      const response = await axios.get(PeoplesUrl);
      return response.data;
    }
  });
  const [data, setData] = useState(PeopleData)
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<{
    pageIndex: number
    pageSize: number
    sort: {
      order: '' | 'asc' | 'desc'
      key: string | number;
    };
    query: string
    total: number
  }>({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })
  const handlePaginationChange = (pageIndex: number) => {
    setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
  }

  const handleSelectChange = (pageSize: number) => {
    setTableData((prevData) => ({ ...prevData, ...{ pageSize } }))
  }

  const handleSort = ({ order, key }: OnSortParam) => {
    setTableData((prevData) => ({
      ...prevData,
      sort: { order, key }
    }))
  }

  const columns: ColumnDef<Member>[] = useMemo(() => {
    return [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Role in Team',
        accessorKey: 'Role',
      },
      {
        header: "Status",
        accessorKey: 'isActive',
        cell: (props) => {
          const row = props.row.original
          return (
            <div className="flex items-center gap-2">
              <Badge className="" innerClass={row.isActive ? "bg-blue-500" : "bg-red-500"} />
              <p>{row.isActive ? "Active" : "Invited"}</p>
            </div>
          )
        },
      }
    ]
  }, [])
  const HeadersURL = "http://localhost:4000/PeoplesHeader"
  const DataURL = 'http://localhost:4000/peoples'

  console.log(PeopleData);
  return (
    <div className="m-5">
      {
        PeopleData?.length > 0 ?
          (
            <IndexPage
              indexKey={'peoplesList'}
              title="Peoples"
              name="Peoples"
              tableColumns={columns}
              queryFn={PeopleData}
              listViewComponent={PeoplesListComponent}
              headersURL={HeadersURL}
              DataURL={DataURL}

            />
          )
          :
          <>
            <h2>No Data Available</h2>
          </>
      }


    </div>
  )
}
export default TaskPeople