import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const TaskList = () => {
    const TaskListUrl = 'http://localhost:4000/taskList'; // Ensure this is the correct URL

  const { data, error, isLoading } = useQuery({
    queryKey: ['tasklist'],
    queryFn: async () => {
      const response = await axios.get(TaskListUrl);
      return response.data;
    }
  });

  const[list,setList]=useState([])

const fetchLiost = async () => {
    const response = await fetch('../Bordio-Task Management/db.json');
    const data = await response.json();
    setList(data.results);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);

  return (
    <div>
      <p>Hello</p>
      {/* You can render your data here */}
      <ul>
        {data.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
