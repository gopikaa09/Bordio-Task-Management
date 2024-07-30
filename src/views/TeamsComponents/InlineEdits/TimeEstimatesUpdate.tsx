import BadgeIcon from "@/components/common/BadgeIcon";
import { Dropdown, Input } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { FaRegCircle } from "react-icons/fa"; // Assuming you are using react-icons for FaRegCircle
import { MdOutlineAccessTime, MdOutlineViewModule } from "react-icons/md";

const TimeEstimatesUpdate = ({ task, id, timeEstimates }: any) => {
  const [estimates, setTimeEstimates] = useState(timeEstimates);
  const queryClient = useQueryClient();

  const { mutateAsync: TimeChange } = useMutation({
    mutationKey: ['startDateUpdate', id],
    mutationFn: async (data) => {
      const url = `http://localhost:4000/taskList/${id}`;
      const response = await axios.put(url, { ...task, estimates: data });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    }
  });

  const handleChange = async (option) => {
    setTimeEstimates(option.value);
    await TimeChange(option.value);
  };

  const timeArray = [];
  for (let i = 1; i <= 25; i++) {
    timeArray.push({ label: i, value: i });
  }

  return (
    <span className="flex items-center gap-2">
      <Dropdown
        renderTitle={
          <BadgeIcon icon={<MdOutlineAccessTime />} text={timeArray?.find(option => option.value === estimates)?.label} />

        }

        menuStyle={{ minWidth: 80, maxHeight: 200, overflowY: 'auto' }}
        placement="bottom-start"
      >
        {timeArray.map((option) => (
          <Dropdown.Item
            key={option.value}
            eventKey={option.label}
            onSelect={() => handleChange(option)}
          >
            <div className="flex items-center">
              {option.label}
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown>
    </span>
  );
};

export default TimeEstimatesUpdate;
