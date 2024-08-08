import { Dropdown } from '@/components/ui';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import axios from 'axios';
import BadgeIcon from '@/components/common/BadgeIcon';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { MdOutlineBarChart } from 'react-icons/md';
import { FaRegCircle } from 'react-icons/fa';
import { PriorityOptions } from '@/@types/tasks';

const PriorityUpdate = ({ id, priorityStatus, task, DataURL }: any) => {
  const [priority, setPriority] = useState(priorityStatus);
  const queryClient = useQueryClient()
  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationKey: ['priorityStatus', id],
    mutationFn: async (data: any) => {
      // const url = `http://localhost:4000/taskList/${id}`;
      const url = `${DataURL}/${id}`;

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


  return (
    <div>
      <span className="flex items-center gap-2">
        <Dropdown
          renderTitle={
            <BadgeIcon icon={task?.priority === 1 ? <HiOutlineExclamationCircle />
              : task?.priority === 2 ? <MdOutlineBarChart /> : task?.priority === 3 ? <MdOutlineBarChart /> :
                task?.priority === 4 ? <MdOutlineBarChart /> : <FaRegCircle />
            }
              text={PriorityOptions.find(option => option.value === priority)?.label}
            />

          }
          menuStyle={{ minWidth: 100 }}
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
