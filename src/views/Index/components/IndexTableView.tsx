import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TaskStatus, LabelsEnum } from '@/@types/tasks';
import dayjs from 'dayjs';
import StatusUpdate from '@/views/TeamsComponents/InlineEdits/StatusUpdate';
import { useMutation } from '@tanstack/react-query';
import { Button, Dropdown } from '@/components/ui';
import { MdDragIndicator } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';

const IndexTableView = ({ DataURL, headersURL, addColume, tableStyles, columnDropDowm }) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [draggedColIndex, setDraggedColIndex] = useState(null);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);
  const [hoveredColIndex, setHoveredColIndex] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const columnsResponse = await axios.get(headersURL);
        const rowsResponse = await axios.get(DataURL);

        const columnsData = columnsResponse.data.map(col => col);
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

  const handleColumnDragOver = (e, index) => {
    e.preventDefault();
    setHoveredColIndex(index)
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
    setHoveredColIndex(index)
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
        const newColumn = await addColumnMutation.mutateAsync(newColumnName);

        setColumns(prevColumns => [...prevColumns, newColumn]);
        setRows(prevRows =>
          prevRows.map(row => [...row, ''])
        );

        const rowsResponse = await axios.get(TaskURL);
        const tasks = rowsResponse.data;

        const updatedTasks = tasks.map(task => ({
          ...task,
          [newColumnName]: ''
        }));

        await updateTasksMutation.mutateAsync(updatedTasks);
        console.log('All tasks updated successfully');
      } catch (error) {
        console.error('Error adding column or updating tasks:', error);
      }
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await deleteColumnMutation.mutateAsync(columnId);

      const columnName = columns.find(col => col.id === columnId).name;

      setColumns(prevColumns => prevColumns.filter(col => col.id !== columnId));
      setRows(prevRows =>
        prevRows.map(row => {
          const newRow = [...row];
          const colIndex = columns.findIndex(col => col.id === columnId);
          newRow.splice(colIndex, 1);
          return newRow;
        })
      );

      const rowsResponse = await axios.get(TaskURL);
      const tasks = rowsResponse.data;

      const updatedTasks = tasks.map(task => {
        const { [columnName]: _, ...rest } = task;
        return rest;
      });

      await updateTasksMutation.mutateAsync(updatedTasks);
      console.log('All tasks updated successfully');
    } catch (error) {
      console.error('Error deleting column or updating tasks:', error);
    }
  };
  const DropDownTitle = <Button variant='plain' size='xs' icon={<BsThreeDotsVertical />
  } className=''></Button>


  return (
    <div className='overflow-auto'>
      <table className={`${tableStyles} w-full`}>
        <thead>
          <tr>
            {
              columnDropDowm &&
              <th className='bg-gray-100'></th>
            }
            {columns.map((col, index) => (
              <th
                // className='bg-gray-200 uppercase font-normal py-2'
                className={`bg-gray-100 uppercase font-normal py-4 ${hoveredColIndex === index ? 'column-hover' : ''}`}
                key={index}
                draggable
                onDragStart={(e) => handleColumnDragStart(e, index)}
                onDragOver={handleColumnDragOver}
                onDrop={(e) => handleColumnDrop(e, index)}
              >
                {col.name}
                {
                  columnDropDowm &&
                  <Dropdown renderTitle={DropDownTitle}>
                    <Dropdown.Item eventKey="a" >Edit</Dropdown.Item>
                    <Dropdown.Item eventKey="b" onClick={() => handleDeleteColumn(col.id)}>Delete</Dropdown.Item>
                  </Dropdown>
                }
              </th>
            ))}
            {
              addColume &&
              <th className='bg-gray-100'>
                <Button variant='twoTone' size='xs' onClick={handleAddColumn}>
                  Add Column
                </Button>
              </th>
            }
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
              {
                columnDropDowm &&
                <td>
                  <MdDragIndicator className='inline-table m-2 cursor-grab' />
                </td>
              }
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
