import { Dropdown } from '@/components/ui';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import axios from 'axios';
import { TaskStatus } from '@/@types/tasks';

const PriorityUpdate = ({ id, priorityStatus, task }: any) => {
  const [priority, setPriority] = useState(priorityStatus);
  const queryClient = useQueryClient()
  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationKey: ['priorityStatus', id],
    mutationFn: async (data: any) => {
      const url = `http://localhost:4000/taskList/${id}`;
      const response = await axios.put(url, { ...task, priority: data.priority });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    }
  });

  const handleStatusChange = async (selectedStatus: any) => {
    setPriority(selectedStatus.value);
    await changeStatusMutation({ id: id, priority: selectedStatus.value });
  };

  const PriorityOptions = [
    { value: 1, label: 'Urgent' },
    { value: 2, label: 'High' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'Low' },
    { value: 5, label: 'None' },
  ]

  return (
    <div>
      <span className="flex items-center gap-2">
        <Dropdown
          renderTitle={
            <span className='cursor-pointer text-gray-400'>
              {PriorityOptions.find(option => option.value === priority)?.label}
            </span>
          }
          menuStyle={{ minWidth: 180 }}
          placement="bottom-start"
        >
          {PriorityOptions.filter(option => option.value !== priority).map(option => (
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

export default PriorityUpdate;
