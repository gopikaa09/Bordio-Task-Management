import React, { useState, useMemo } from 'react';
import { DataTable, OnSortParam, StrictModeDroppable } from "@/components/shared";
import { MdWarningAmber } from "react-icons/md";
import Table from '@/components/ui/Table/Table';
import THead from '@/components/ui/Table/THead';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Tr from '@/components/ui/Table/Tr';
import Th from '@/components/ui/Table/Th';
import TBody from '@/components/ui/Table/TBody';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import Td from '@/components/ui/Table/Td';

const IndexTableView = ({ data, query, columns, loading }: any) => {

  const [sort, setSort] = useState<{ order: '' | 'asc' | 'desc'; key: string | number }>({ order: '', key: '' });


  const sortedData = useMemo(() => {
    if (sort.order === 'asc') {
      return [...data].sort((a, b) => {
        const aValue = String(a[sort.key]).toLowerCase();
        const bValue = String(b[sort.key]).toLowerCase();
        if (aValue > bValue) return 1;
        if (aValue < bValue) return -1;
        return 0;
      });
    } else if (sort.order === 'desc') {
      return [...data].sort((a, b) => {
        const aValue = String(a[sort.key]).toLowerCase();
        const bValue = String(b[sort.key]).toLowerCase();
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
        return 0;
      });
    } else {
      return data;
    }
  }, [sort, data]);
  const reorderData = (startIndex: number, endIndex: number) => {
    const newData = [...data]
    const [movedRow] = newData.splice(startIndex, 1)
    newData.splice(endIndex, 0, movedRow)
    // setData(newData)
  }


  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    reorderData(source.index, destination.index)
  }



  const handleSort = ({ order, key }: OnSortParam) => {
    setSort({ order, key });
  };
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <div>
      {data && data?.length > 0 ? (
        <div className="bg-white dark:bg-transparent mb-3">
          {/* <DataTable
            columns={columns}
            data={sortedData}
            // pagingData={{
            //     total: data?.length,
            //     pageIndex : query?.pageNumber,
            //     pageSize:query?.pageSize
            // }}
            // showPagination={false}
            onSort={handleSort}
          /> */}
          <Table className='w-full'>
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th key={header.id} colSpan={header.colSpan}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Th>
                    )
                  })}
                </Tr>
              ))}
            </THead>
            <DragDropContext onDragEnd={handleDragEnd}>
              <StrictModeDroppable droppableId="table-body">
                {(provided) => (
                  <TBody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <Draggable
                          key={row.id}
                          draggableId={row.id}
                          index={row.index}
                        >
                          {(provided, snapshot) => {
                            const { style } =
                              provided.draggableProps
                            return (
                              <Tr
                                ref={provided.innerRef}
                                className={
                                  snapshot.isDragging
                                    ? 'table'
                                    : ''
                                }
                                style={style}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {row
                                  .getVisibleCells()
                                  .map((cell) => {
                                    return (
                                      <Td
                                        key={
                                          cell.id
                                        }
                                      >
                                        {flexRender(
                                          cell
                                            .column
                                            .columnDef
                                            .cell,
                                          cell.getContext()
                                        )}
                                      </Td>
                                    )
                                  })}
                              </Tr>
                            )
                          }}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </TBody>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          </Table>
        </div>

      ) : (
        <div className="text-center ">
          <h5 className="flex gap-3 items-center my-10">
            <MdWarningAmber className='text-xl' />
            No Data Available
          </h5>
        </div>
      )}
    </div>
  );
};

export default IndexTableView;
