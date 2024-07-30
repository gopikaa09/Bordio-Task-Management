import BadgeIcon from "@/components/common/BadgeIcon"
import { Calendar } from "@/components/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"
import { BsXCircle } from "react-icons/bs"
import { LuCalendarClock } from "react-icons/lu"

const StartDateUpdate = ({ id, StartDate, task }: any) => {
  const [startDate, setStartDate] = useState(StartDate)
  const [showProductFilters, setShowProductFilters] = useState(false)
  const dropdownProRef = useRef(null)
  const calendarRef = useRef(null);
  const queryClient = useQueryClient()


  const { mutateAsync: changeStartDate } = useMutation({
    mutationKey: ['changeStatus', id],
    mutationFn: async (data: any) => {
      console.log("data", data);
      const url = `http://localhost:4000/taskList/${id}`;
      const response = await axios.put(url, { ...task, startDate: data.startDate });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasklistQuery']);
    }
  })
  const OnUpdateDate = async (date: any) => {
    if (
      dayjs(date).format('YYYY-MM-DD') !==
      dayjs(startDate).format('YYYY-MM-DD')
    ) {
      console.log(dayjs(date).format('YYYY-MM-DD'));
      setStartDate(date)
      changeStartDate({ id: id, startDate: date })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowProductFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  const toggleProductFilters = () => {
    setShowProductFilters(!showProductFilters);
  }


  return (
    <>
      <div className="text-center w-full">
        <div className="relative" ref={dropdownProRef}>

          <div className="cursor-pointer flex items-center gap-1 group" >
            <div onClick={toggleProductFilters}>
              <BadgeIcon icon={<LuCalendarClock />} text={dayjs(startDate).format(
                'MM/DD/YYYY'
              )} />
            </div>
          </div>
          {showProductFilters && (
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
    </>
  )
}
export default StartDateUpdate