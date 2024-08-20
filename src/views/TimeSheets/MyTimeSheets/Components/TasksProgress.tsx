import { Chart } from '@/components/shared';
import { Badge, Segment } from '@/components/ui'
import React from 'react'
import { IoChevronBackOutline, IoChevronForward } from 'react-icons/io5';

const TasksProgress = () => {


  const handleWeekChange = (direction: 'prev' | 'next') => {
    // const weeks = Object.keys(timeSheetData);
    // const currentIndex = weeks.indexOf(currentWeek);
    // if (direction === 'prev' && currentIndex > 0) {
    //   setCurrentWeek(weeks[currentIndex - 1]);
    // } else if (direction === 'next' && currentIndex < weeks.length - 1) {
    //   setCurrentWeek(weeks[currentIndex + 1]);
    // }
  };
  return (
    <div>
      <div className="flex justify-between">
        <div></div>
        <div className="flex justify-between items-center">
          <Segment size="xs">
            <Segment.Item onClick={() => handleWeekChange('prev')} className="cursor-pointer">
              <IoChevronBackOutline />
            </Segment.Item>
            <Segment.Item>2024-W32</Segment.Item>
            <Segment.Item onClick={() => handleWeekChange('next')} className="cursor-pointer">
              <IoChevronForward />
            </Segment.Item>
          </Segment>
        </div>
      </div>
      <div className="flex justify-between items-center mt-7">
        <div>
          <table className='w-[300px]'>
            <tr>
              <td>Working Hours</td>
              <td>8 hrs</td>
            </tr>
            <tr>
              <td>OverTime</td>
              <td>8 hrs</td>
            </tr>
            <tr>
              <td>Unpayable/Salaried</td>
              <td>8 hrs</td>
            </tr>
            <tr>
              <td>Sick</td>
              <td>8 hrs</td>
            </tr>
            <tr>
              <td>PTO</td>
              <td>8 hrs</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TasksProgress
