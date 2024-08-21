import { useState, useMemo } from 'react';
import { Button, Card, Segment } from '@/components/ui';
import { IoChevronBackOutline, IoChevronForward } from 'react-icons/io5';
import CustomTable from './CustomTable';

type TimeSheet = {
  id: string;
  projectName: string;
  task: string;
  [key: string]: any;
};

const timeSheetData: Record<string, { week: string; entries: TimeSheet[] }> = {
  '2024-W32': {
    week: '2024-W32',
    entries: [
      // { id: '1', date: '5 Aug 2024', hours: '9:00' },
      // { id: '2', date: '6 Aug 2024', hours: '9:00' },
      // { id: '3', date: '7 Aug 2024', hours: '9:00' },
      // { id: '4', date: '8 Aug 2024', hours: '9:00' },
      // { id: '5', date: '9 Aug 2024', hours: '9:00' },
      // { id: '6', date: '10 Aug 2024', hours: '9:00' },
      // { id: '7', date: '11 Aug 2024', hours: '9:00' },

    ],
  },
  '2024-W33': {
    week: '2024-W33',
    entries: [
      // { id: '1', date: '12 Aug 2024', hours: '9:00' },
      // { id: '2', date: '13 Aug 2024', hours: '9:00' },
      // { id: '3', date: '14 Aug 2024', hours: '9:00' },
      // { id: '4', date: '15 Aug 2024', hours: '9:00' },
      // { id: '5', date: '16 Aug 2024', hours: '9:00' },
      // { id: '6', date: '16 Aug 2024', hours: '9:00' },
      // { id: '7', date: '16 Aug 2024', hours: '9:00' },
    ],
  },
};

function TimeSheetTableView() {
  const [currentWeek, setCurrentWeek] = useState<string>('2024-W32');

  // Generate headers dynamically based on the current week's entries
  const headers = useMemo(() => {
    const entries = timeSheetData[currentWeek]?.entries || [];
    const dates = Array.from(new Set(entries.map(entry => entry.date)));
    return dates.map(date => ({ date, hours: '0:00' }));
  }, [currentWeek]);

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const weeks = Object.keys(timeSheetData);
    const currentIndex = weeks.indexOf(currentWeek);
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentWeek(weeks[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < weeks.length - 1) {
      setCurrentWeek(weeks[currentIndex + 1]);
    }
  };

  return (
    <>
      <div className='flex justify-between my-4'>
        <div></div>
        <div className='flex justify-between items-center gap-2'>
          <Segment size='xs'>
            <Segment.Item onClick={() => handleWeekChange('prev')} className='cursor-pointer' ><IoChevronBackOutline /></Segment.Item>
            <Segment.Item>{timeSheetData[currentWeek].week}</Segment.Item>
            <Segment.Item onClick={() => handleWeekChange('next')} className='cursor-pointer' ><IoChevronForward /></Segment.Item>
          </Segment>
          <Button size='xs'>Report</Button>
        </div >

      </div>
      <CustomTable
        renderRowSubComponent={({ row }) => (
          <Card>
            <p>Details for {row.original.id}</p>
          </Card>
        )}
        getRowCanExpand={(row) => row.original.projectName !== 'Excluded'}
        initialData={timeSheetData[currentWeek].entries}
        headers={headers}
      />
    </>
  );
}

export default TimeSheetTableView;
