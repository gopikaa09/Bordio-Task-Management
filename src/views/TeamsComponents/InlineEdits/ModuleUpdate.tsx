import { Dropdown } from '@/components/ui';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import axios from 'axios';
import { TaskStatus } from '@/@types/tasks';
import BadgeIcon from '@/components/common/BadgeIcon';
import { MdOutlineViewModule } from 'react-icons/md';

const ModuleUpdate = ({ id, moduleStatus, task, DataURL }: any) => {
  const [module, setModule] = useState(moduleStatus);
  const queryClient = useQueryClient()
  const { mutateAsync: changeStatusMutation } = useMutation({
    mutationKey: ['moduleStatus', id],
    mutationFn: async (data: any) => {
      // const url = `http://localhost:4000/taskList/${id}`;
      const url = `${DataURL}/${id}`;

      const response = await axios.put(url, { ...task, modules: data.modules });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    }
  });

  const handleStatusChange = async (selectedStatus: any) => {
    setModule(selectedStatus.value);
    await changeStatusMutation({ id: id, modules: selectedStatus.value });
  };


  const ModulesURL = 'http://localhost:4000/modules'; // Ensure this is the correct URL

  const { data: Modules } = useQuery({
    queryKey: ['Modules'],
    queryFn: async () => {
      const response = await axios.get(ModulesURL)
      return response.data
    }
  })

  const ModuleOptions =
    Modules &&
    Modules?.map((item: { uid: any; name: any; children: any }) => ({
      value: item.name,
      label: item.name,
    }))
  return (
    <div>
      <span className="flex items-center gap-2 indent-1">
        <Dropdown
          renderTitle={
            <BadgeIcon icon={<MdOutlineViewModule />} text={ModuleOptions?.find(option => option.value === module)?.label} />

          }
          menuStyle={{ minWidth: 130 }}
          placement="auto"

        >
          {ModuleOptions?.filter(option => option.value !== module).map(option => (
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

export default ModuleUpdate;
