import { useEffect } from 'react'
import CalendarView from '@/components/shared/CalendarView'
import Container from '@/components/shared/Container'


const Calendar = () => {


  return (
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
