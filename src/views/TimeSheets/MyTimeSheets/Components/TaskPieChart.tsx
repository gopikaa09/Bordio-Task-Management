import { Chart } from '@/components/shared'
import { Badge, Segment } from '@/components/ui'
import React from 'react'
import { IoChevronBackOutline, IoChevronForward } from 'react-icons/io5'

const TaskPieChart = () => {
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
    <>
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
      <div className='flex justify-center items-center mt-2 '>
        <Chart
          donutText={'100 hrs'}
          series={[25, 65, 50]}
          height={200}
          type="donut"
          customOptions={{
            colors: ['#02967A', '#EEA082', '#3C7E97'],
            labels: ['Task1', 'Task2', 'Task3'],
          }}
        />
        <div>
          <div className="flex items-center">
            <Badge
              badgeStyle={{
                backgroundColor: '#02967A',
              }}
            />
            <span className="font-semibold ml-2">Task1</span>
          </div>
          <div className="flex items-center">
            <Badge
              badgeStyle={{
                backgroundColor: '#EEA082',
              }}
            />
            <span className="font-semibold ml-2">Task2</span>
          </div>
          <div className="flex items-center">
            <Badge
              badgeStyle={{
                backgroundColor: '#3C7E97',
              }}
            />
            <span className="font-semibold ml-2">Task3</span>
          </div>
        </div>
      </div>
    </>

  )
}

export default TaskPieChart
