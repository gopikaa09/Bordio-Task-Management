import { Dropdown } from '@/components/ui';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import axios from 'axios';
import { statusOptions, TaskStatus } from '@/@types/tasks';
import BadgeIcon from '@/components/common/BadgeIcon';
import { FaRegCircle } from 'react-icons/fa';
import { TbAlarm } from 'react-icons/tb';
import { LuCircleDashed } from 'react-icons/lu';
import { FaRegCircleCheck } from 'react-icons/fa6';

const StatusUpdate = ({ id, taskStatus, task }: any) => {
  const { view } = useAppSelector((state) => state.indexPage?.data['tasklist'])
  console.log(view);
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
            <BadgeIcon icon={
              task?.status === 10 ?
                <FaRegCircle /> : task?.status === 20 ? <TbAlarm /> : task?.status === 30 ? <LuCircleDashed /> : <FaRegCircleCheck />} text={statusOptions.find(option => option.value === status)?.label}></BadgeIcon>
          }
          menuStyle={{ minWidth: 120 }}
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
