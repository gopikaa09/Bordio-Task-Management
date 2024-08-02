import React, { useState } from 'react';
import Table from '@/components/ui/Table/Table';
import THead from '@/components/ui/Table/THead';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import Tr from '@/components/ui/Table/Tr';
import Th from '@/components/ui/Table/Th';
import TBody from '@/components/ui/Table/TBody';
import Td from '@/components/ui/Table/Td';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/shared';

const IndexTableView = ({ data, query, columns, loading }: any) => {
  const [rowsData, setRowsData] = useState(data);
  const [rowSelection, setRowSelection] = useState({})

  const queryClient = useQueryClient();

  const updateTaskOrderMutation = useMutation({
    mutationFn: async (updatedTasks) => {
      const response = await axios.put('http://localhost:4000/taskList', updatedTasks);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    },
  });

  const reorderData = (startIndex: number, endIndex: number) => {
    const newData = [...rowsData];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);
    setRowsData(newData);
    return newData; // Return the new order
  };

  const table = useReactTable({
    data: rowsData,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const newData = reorderData(source.index, destination.index);

    // Update server with new order
    updateTaskOrderMutation.mutate(newData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Table className="w-full">
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </THead>
        <StrictModeDroppable droppableId="table-body">
          {(provided) => (
            <TBody ref={provided.innerRef} {...provided.droppableProps}>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Draggable key={row.id} draggableId={row.id} index={row.index}>
                    {(provided, snapshot) => {
                      const { style } = provided.draggableProps;
                      return (
                        <Tr
                          ref={provided.innerRef}
                          className={snapshot.isDragging ? 'table' : ''}
                          style={style}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <Td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </TBody>
          )}
        </StrictModeDroppable>
      </Table>
    </DragDropContext>
  );
};

export default IndexTableView;
