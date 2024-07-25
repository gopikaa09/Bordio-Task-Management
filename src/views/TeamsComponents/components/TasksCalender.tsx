import { useEffect } from 'react'
import CalendarView from '@/components/shared/CalendarView'
import Container from '@/components/shared/Container'
// import EventDialog, { EventParam } from './components/EventDialog'

import { injectReducer } from '@/store'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import type {
  EventDropArg,
  EventClickArg,
  DateSelectArg,
} from '@fullcalendar/core'

// injectReducer('crmCalendar', reducer)

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
