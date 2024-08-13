import React, { useEffect, useState } from 'react'
import MainDetails from './Components/MainDetails'
import { Card, Tabs } from '@/components/ui'
import TimeSheetsList from './Components/TimeSheetsList'
import { useNavigate, useParams } from 'react-router-dom'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import TimeEntry from './Components/TimeEntry'
import TasksProgress from './Components/TasksProgress'

const MyTimeSheets = () => {

  const navigate = useNavigate()
  const { id, tab } = useParams()

  const [currentTab, setCurrentTab] = useState(tab || 'timeSheets')

  useEffect(() => {
    if (tab) {
      setCurrentTab(tab)
    }
  }, [tab])

  const TabOptions = [
    { value: 'timeSheets', label: 'Time Sheets' },
    { value: 'timeEntry', label: 'Time Entry' }
  ]

  const content = {
    timeSheets: <TimeSheetsList />,
    timeEntry: <TimeEntry />
  }

  return (
    <div className='grid grid-cols-3 gap-5'>
      <div className=''>
        <MainDetails />
      </div>
      <Card className='col-span-2'>
        <TasksProgress />
      </Card>
      <div className='col-span-3'>
        <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
          <div className="md:block hidden">
            <TabList className="print:hidden">
              {TabOptions?.map((data, index) => (
                <TabNav key={index} value={data?.value}>
                  {data?.label}
                </TabNav>
              ))}
            </TabList>
          </div>
          <div className="bg-white p-4 dark:bg-gray-800 stickyPanel">
            {TabOptions?.map((data, index) => (
              <TabContent key={index} value={data?.value}>
                <div>{content[data?.value]}</div>
              </TabContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default MyTimeSheets
