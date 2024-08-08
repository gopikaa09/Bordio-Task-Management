import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TaskStatus, LabelsEnum } from '@/@types/tasks';
import dayjs from 'dayjs';
import StatusUpdate from '@/views/TeamsComponents/InlineEdits/StatusUpdate';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { MdDragIndicator } from 'react-icons/md';

const IndexTableView = ({ DataURL, headersURL }) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [draggedColIndex, setDraggedColIndex] = useState(null);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);

  useEffect(() => {
    // Fetch data from the server
    const fetchData = async () => {
      try {
        const columnsResponse = await axios.get(headersURL);
        const rowsResponse = await axios.get(DataURL);

        // Assuming columnsResponse.data is an array of column objects
        // and rowsResponse.data is an array of row objects
        const columnsData = columnsResponse.data.map(col => col); // Adjust based on actual structure
        const rowsData = rowsResponse.data.map(row => {
          return columnsData.map(col => {
            switch (col.name) {
              case 'status':
                return <StatusUpdate task={row} id={row.id} taskStatus={row.status} />;
              case 'label':
                return LabelsEnum[row[col.name]];
              case 'startDate':
                return dayjs(row[col.name]).format('MM/DD/YYYY');
              case 'dueDate':
                return dayjs(row[col.name]).format('MM/DD/YYYY');
              default:
                return row[col.name];
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
  }, [DataURL, headersURL]);

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

    // Rearrange rows according to the new column order
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

  const HeaderURL = headersURL;
  const TaskURL = DataURL;

  const addColumnMutation = useMutation({
    mutationFn: async (column) => {
      const response = await axios.post(HeaderURL, { name: column });
      return response.data;
    }
  });

  const updateTasksMutation = useMutation({
    mutationFn: async (tasks) => {
      const responses = await Promise.all(
        tasks.map(task => axios.put(`${TaskURL}/${task.id}`, task))
      );
      return responses.map(response => response.data);
    }
  });

  const deleteColumnMutation = useMutation({
    mutationFn: async (columnId) => {
      const response = await axios.delete(`${HeaderURL}/${columnId}`);
      return response.data;
    }
  });

  const handleAddColumn = async () => {
    const newColumnName = prompt('Enter the name for the new column:');

    if (newColumnName) {
      try {
        // Add the new column to the headers
        const newColumn = await addColumnMutation.mutateAsync(newColumnName);

        setColumns(prevColumns => [...prevColumns, newColumn]);
        setRows(prevRows =>
          prevRows.map(row => [...row, '']) // Add empty values for the new column in each row
        );

        // Fetch the current task list
        const rowsResponse = await axios.get(TaskURL);
        const tasks = rowsResponse.data;

        // Update each task with the new column name
        const updatedTasks = tasks.map(task => ({
          ...task,
          [newColumnName]: '' // Initialize the new column with an empty value
        }));

        // Update tasks on the server
        await updateTasksMutation.mutateAsync(updatedTasks);
        console.log('All tasks updated successfully');
      } catch (error) {
        console.error('Error adding column or updating tasks:', error);
      }
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      // Delete the column from the headers
      await deleteColumnMutation.mutateAsync(columnId);

      const columnName = columns.find(col => col.id === columnId).name;

      setColumns(prevColumns => prevColumns.filter(col => col.id !== columnId));
      setRows(prevRows =>
        prevRows.map(row => {
          const newRow = [...row];
          const colIndex = columns.findIndex(col => col.id === columnId);
          newRow.splice(colIndex, 1); // Remove the cell corresponding to the deleted column
          return newRow;
        })
      );

      // Fetch the current task list
      const rowsResponse = await axios.get(TaskURL);
      const tasks = rowsResponse.data;

      // Update each task to remove the deleted column name
      const updatedTasks = tasks.map(task => {
        const { [columnName]: _, ...rest } = task;
        return rest;
      });

      // Update tasks on the server
      await updateTasksMutation.mutateAsync(updatedTasks);
      console.log('All tasks updated successfully');
    } catch (error) {
      console.error('Error deleting column or updating tasks:', error);
    }
  };

  return (
    <div className='overflow-auto'>
      <table className='w-11/12 m-5'>
        <thead>
          <tr>
            <th className='bg-gray-200'></th>
            {columns.map((col, index) => (
              <th
                className='bg-gray-200 uppercase font-normal py-2 w-1/12'
                key={index}
                draggable
                onDragStart={(e) => handleColumnDragStart(e, index)}
                onDragOver={handleColumnDragOver}
                onDrop={(e) => handleColumnDrop(e, index)}
              >
                {col.name}
                <MdDragIndicator className='inline-table mx-2 cursor-grab' />
                <Button variant='danger' size='xs' onClick={() => handleDeleteColumn(col.id)}>
                  Delete
                </Button>
              </th>
            ))}
            <th className='bg-gray-200'>
              <Button variant='twoTone' size='xs' onClick={handleAddColumn}>
                Add Column
              </Button>
            </th>
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
              <td>
                <MdDragIndicator className='inline-table m-2 cursor-grab' />
              </td>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className='py-4'>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IndexTableView;
