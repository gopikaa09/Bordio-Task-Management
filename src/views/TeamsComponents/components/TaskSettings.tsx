import React, { useState } from 'react';

const TaskSettings = () => {
  const [columns, setColumns] = useState(['Company', 'Contact', 'Country']);
  const [rows, setRows] = useState([
    ['Alfreds Futterkiste', 'Maria Anders', 'Germany'],
    ['Centro comercial Moctezuma', 'Francisco Chang', 'Mexico'],
    ['Ernst Handel', 'Roland Mendel', 'Austria'],
    ['Island Trading', 'Helen Bennett', 'UK'],
    ['Laughing Bacchus Winecellars', 'Yoshi Tannamuri', 'Canada'],
    ['Magazzini Alimentari Riuniti', 'Giovanni Rovelli', 'Italy']
  ]);
  const [draggedColIndex, setDraggedColIndex] = useState(null);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);

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

  return (
    <div>
      <table className='w-full'>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
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
