import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TaskStatus, LabelsEnum } from '@/@types/tasks';
import dayjs from 'dayjs';
import StatusUpdate from '../InlineEdits/StatusUpdate';

const TaskSettings = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [draggedColIndex, setDraggedColIndex] = useState(null);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const columnsResponse = await axios.get('http://localhost:4000/headers');
        const rowsResponse = await axios.get('http://localhost:4000/taskList');

        const columnsData = columnsResponse.data.map(col => col.name);
        const rowsData = rowsResponse.data.map(row => {
          console.log(row);
          return columnsData.map(col => {
            console.log(row[col.status]);
            switch (col) {
              case 'status':
                // return TaskStatus[row[col]];
                return <StatusUpdate task={row} id={row.id} taskStatus={row.status} />

              case 'label':
                return LabelsEnum[row[col]];
              case 'startDate':
                return dayjs(row[col]).format('MM/DD/YYYY')
              case 'dueDate':
                return dayjs(row[col]).format('MM/DD/YYYY')
              default:
                return row[col];
            }
          });
        });

        setColumns(columnsData);
        setRows(rowsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleColumnDragStart = (e, index) => {
    setDraggedColIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDragOver = (e) => {
    e.preventDefault();
  };

  const handleColumnDrop = (e, index) => {
    e.preventDefault();
    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(draggedColIndex, 1);
    newColumns.splice(index, 0, draggedColumn);

    const newRows = rows.map(row => {
      const reorderedRow = [];
      for (let i = 0; i < newColumns.length; i++) {
        const colIndex = columns.indexOf(newColumns[i]);
        reorderedRow.push(row[colIndex]);
      }
      return reorderedRow;
    });

    setColumns(newColumns);
    setRows(newRows);
    setDraggedColIndex(null);
  };

  const handleRowDragStart = (e, index) => {
    setDraggedRowIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleRowDragOver = (e) => {
    e.preventDefault();
  };

  const handleRowDrop = (e, index) => {
    e.preventDefault();
    const newRows = [...rows];
    const [draggedRow] = newRows.splice(draggedRowIndex, 1);
    newRows.splice(index, 0, draggedRow);
    setRows(newRows);
    setDraggedRowIndex(null);
  };

  return (
    <div>
      <table className='w-11/12 m-5'>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                className='bg-gray-200'
                key={index}
                draggable
                onDragStart={(e) => handleColumnDragStart(e, index)}
                onDragOver={handleColumnDragOver}
                onDrop={(e) => handleColumnDrop(e, index)}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              draggable
              onDragStart={(e) => handleRowDragStart(e, rowIndex)}
              onDragOver={handleRowDragOver}
              onDrop={(e) => handleRowDrop(e, rowIndex)}
            >
              {row.map((cell, colIndex) => (
                <td key={colIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskSettings;
