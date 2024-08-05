
import Table from '@/components/custom/DragAndDropTable/DraggableTable'
import { CalendarView, Container } from '@/components/shared';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

// injectReducer('crmCalendar', reducer)

const Calendar = () => {

  const TaskListUrl = 'http://localhost:4000/taskList';

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['tasklist'],
    queryFn: async () => {
      const response = await axios.get(TaskListUrl);
      return response.data;
    }
  });


  return (
    // <Table />
    <Container className="h-full m-12">
      <CalendarView
        editable
        selectable
      // events={events}
      // eventClick={onEventClick}
      // select={onCellSelect}
      // eventDrop={onEventChange}
      />
      {/* <EventDialog submit={onSubmit} /> */}
    </Container>
  )
}

export default Calendar
