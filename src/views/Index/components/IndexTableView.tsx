import React, { useState, useMemo, useRef, useEffect } from 'react';
import Table from '@/components/ui/Table/Table';
import THead from '@/components/ui/Table/THead';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Tr from '@/components/ui/Table/Tr';
import Th from '@/components/ui/Table/Th';
import TBody from '@/components/ui/Table/TBody';
import Td from '@/components/ui/Table/Td';
import invariant from 'tiny-invariant';
import { draggable, monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

const IndexTableView = ({ data, query, columns, loading }: any) => {
  const [sort, setSort] = useState<{ order: '' | 'asc' | 'desc'; key: string | number }>({ order: '', key: '' });
  const [rowsData, setRowsData] = useState(data);

  useEffect(() => {
    setRowsData(data);
  }, [data]);

  const sortedData = useMemo(() => {
    if (sort.order === 'asc') {
      return [...rowsData].sort((a, b) => {
        const aValue = String(a[sort.key]).toLowerCase();
        const bValue = String(b[sort.key]).toLowerCase();
        return aValue.localeCompare(bValue);
      });
    } else if (sort.order === 'desc') {
      return [...rowsData].sort((a, b) => {
        const aValue = String(a[sort.key]).toLowerCase();
        const bValue = String(b[sort.key]).toLowerCase();
        return bValue.localeCompare(aValue);
      });
    } else {
      return rowsData;
    }
  }, [sort, rowsData]);

  const reorderData = (startIndex: number, endIndex: number) => {
    const newData = [...rowsData];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);
    setRowsData(newData);
  };

  const handleSort = ({ order, key }: OnSortParam) => {
    setSort({ order, key });
  };

  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const elements = document.querySelectorAll('[data-drag]');

    elements.forEach((el, index) => {
      invariant(el);

      const stopDraggable = draggable({
        element: el,
        getInitialData: () => ({ index }),
        onDragStart: (e) => console.log('Dragging started for:', index),
        onDrop: (e) => {
          const startIndex = e.dataTransfer.getData('text/plain');
          console.log('Dropped:', index);


          reorderData(parseInt(startIndex, 10), index);
        },
      });

      const stopMonitoring = monitorForElements({
        onDrop: async ({ source, location }) => {
          const destination = location.current.dropTargets[0]
          if (!destination) {
            console.log("No destination Available")
            return;
          }
          const destinationIndex = destination.data.index
          const sourceTaskId = source.data.id;

        }
      })

      return () => stopDraggable();
    });
  }, [rowsData]);

  return (
    <Table>
      <THead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Th key={header.id} colSpan={header.colSpan}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Th>
            ))}
          </Tr>
        ))}
      </THead>
      <TBody>
        {table.getRowModel().rows.map((row, rowIndex) => (
          <Tr
            key={row.id}
            data-drag
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', rowIndex.toString())}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(e, rowIndex);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {row.getVisibleCells().map((cell) => (
              <Td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </Tr>
        ))}
      </TBody>
    </Table>
  );
};

export default IndexTableView;
