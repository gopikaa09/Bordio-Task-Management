import BadgeIcon from "@/components/common/BadgeIcon";
import { Calendar } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { LuCalendarClock } from "react-icons/lu";

const StartDateUpdate = ({ id, StartDate, DataURL, task }: any) => {
  const [startDate, setStartDate] = useState(StartDate);
  const [showCalender, setShowCalender] = useState(false);
  const dropdownProRef = useRef(null);
  const calendarRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Initial StartDate:", StartDate);
    console.log("Formatted Initial StartDate:", dayjs(StartDate).format('MM/DD/YYYY'));
  }, [StartDate]);

  const { mutateAsync: changeStartDate } = useMutation({
    mutationKey: ['changeStatus', id],
    mutationFn: async (data: any) => {
      console.log("Data sent to server:", data);
      // const url = `http://localhost:4000/taskList/${id}`;
      const url = `${DataURL}/${id}`;

      const response = await axios.put(url, { ...task, startDate: data.startDate });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    }
  });

  const OnUpdateDate = async (date: any) => {
    if (dayjs(date).format('YYYY-MM-DD') !== dayjs(startDate).format('YYYY-MM-DD')) {
      console.log("Updating date to:", dayjs(date).format('YYYY-MM-DD'));
      setStartDate(date);
      await changeStartDate({ id: id, startDate: date });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalender(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  const toggleCalender = () => {
    setShowCalender(!showCalender);
  };

  return (
    <div className="text-center w-full">
      <div className="relative" ref={dropdownProRef}>
        <div className="cursor-pointer flex items-center gap-1 group">
          <div onClick={toggleCalender}>
            <BadgeIcon icon={<LuCalendarClock />} text={dayjs(startDate).format('DD/MM/YYYY')} />
          </div>
        </div>
        {showCalender && (
          <div className="absolute top-full left-[-25px] mt-1 bg-white dark:bg-gray-700 dark:border rounded-md z-20 p-4 dark:border-none border border-gray-200" ref={calendarRef}>
            <Calendar
              value={dayjs(startDate).toDate()}
              onChange={OnUpdateDate}
              firstDayOfWeek='sunday'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StartDateUpdate;
