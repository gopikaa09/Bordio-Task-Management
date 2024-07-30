import { Dropdown } from '@/components/ui';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import axios from 'axios';
import { statusOptions, TaskStatus } from '@/@types/tasks';

const StatusUpdate = ({ id, taskStatus, task }: any) => {
  const [status, setStatus] = useState(taskStatus);
  const queryClient = useQueryClient()
  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationKey: ['startDateUpdate', id],
    mutationFn: async (data: any) => {
      const url = `http://localhost:4000/taskList/${id}`;
      const response = await axios.put(url, { ...task, status: data.status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    }
  });

  const handleStatusChange = async (selectedStatus: any) => {
    setStatus(selectedStatus.value);
    await changeStatusMutation({ id: id, status: selectedStatus.value });
  };



  return (
    <div>
      <span className="flex items-center gap-2">
        <Dropdown
          renderTitle={
            <span className='cursor-pointer text-gray-400'>
              {statusOptions.find(option => option.value === status)?.label}
            </span>
          }
          menuStyle={{ minWidth: 180 }}
          placement="bottom-start"
        >
          {statusOptions.filter(option => option.value !== status).map(option => (
            <Dropdown.Item
              key={option.value}
              eventKey={option.label}
              onSelect={() => handleStatusChange(option)}
            >
              <div className="flex items-center">
                {option.label}
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown>
      </span>
    </div>
  );
};

export default StatusUpdate;
