import { Dropdown } from '@/components/ui';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import axios from 'axios';
import { TaskStatus } from '@/@types/tasks';
import BadgeIcon from '@/components/common/BadgeIcon';
import { MdOutlineViewModule } from 'react-icons/md';
import { getInitials } from '@/utils/getInitials';

const AssigneeUpdate = ({ id, assigneName, task }: any) => {

  const [assignes, setAssigne] = useState(assigneName);
  const queryClient = useQueryClient()
  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationKey: ['moduleStatus', id],
    mutationFn: async (data: any) => {
      const url = `http://localhost:4000/taskList/${id}`;
      const response = await axios.put(url, { ...task, assignes: data.modules });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    }
  });

  const handleStatusChange = async (selectedStatus: any) => {
    setAssigne(selectedStatus.value);
    await changeStatusMutation({ id: id, assignes: selectedStatus.value });
  };

  const MembersURl = 'http://localhost:4000/peoples'; // Ensure this is the correct URL

  const { data: peoples } = useQuery({
    queryKey: ['Peoples'],
    queryFn: async () => {
      const response = await axios.get(MembersURl)
      return response.data
    }
  })

  const memberOPtions =
    peoples &&
    peoples?.map((item: { uid: any; name: any; children: any }) => ({
      value: item.name,
      label: item.name,
    }))
  return (
    <div>
      <span className="flex items-center gap-2 indent-1">
        <Dropdown
          renderTitle={
            memberOPtions >
            <div className="bg-gray-400 pl-1.5 pr-2 py-1.5 rounded-full text-white text-xs font-semibold">
              <span>{getInitials(task?.assignes)}</span>
            </div>
            // <BadgeIcon icon={<MdOutlineViewModule />} text={memberOPtions?.find(option => option.value === assignes)?.label} />
          }
          menuStyle={{ minWidth: 130 }}
          placement="auto"

        >
          {memberOPtions?.filter(option => option.value !== assignes).map(option => (
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

export default AssigneeUpdate;
