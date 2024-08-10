import { useEffect, useState } from 'react'
import classNames from 'classnames'
import ScrollBar from '@/components/ui/ScrollBar'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Loading from '@/components/shared/Loading'
import {
  HiMenu,
  HiMenuAlt2,
} from 'react-icons/hi'

import useResponsive from '@/utils/hooks/useResponsive'
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom'
import type { MouseEvent } from 'react'


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdWarningAmber } from 'react-icons/md'

import { Spinner } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { toggleMobileSidebar, toggleSidebar } from '@/views/store'
import axios from 'axios'
import TaskList from '../TaskList'
import TaskNotes from './TaskNotes'
import TaskPeople from './TaskPeoples'
import ListExample from './TasksCalender'
import DrawingExample from './TaskNotes'
import TaskSettings from './TaskSettings'


type ToggleButtonProps = {
  sideBarExpand: boolean
  mobileSidebarExpand: boolean
}

const htmlReg = /(<([^>]+)>)/gi

const ToggleButton = ({
  sideBarExpand,
  mobileSidebarExpand,
}: ToggleButtonProps) => {
  const dispatch = useAppDispatch()

  const { smaller } = useResponsive()

  const onSideBarToggle = () => {
    dispatch(toggleSidebar(!sideBarExpand))
  }

  const onMobileSideBar = () => {
    dispatch(toggleMobileSidebar(!mobileSidebarExpand))
  }

  return (
    <Button
      icon={
        smaller.xl ? (
          mobileSidebarExpand ? (
            <HiMenu />
          ) : (
            <HiMenuAlt2 />
          )
        ) : sideBarExpand ? (
          <HiMenu />
        ) : (
          <HiMenuAlt2 />
        )
      }
      size="sm"
      variant="plain"
      shape="circle"
      onClick={smaller.xl ? onMobileSideBar : onSideBarToggle}
    />
  )
}


const ToolbarList = () => {
  const { category } = useParams();
  // console.log(category)
  const [folder, setFolder] = useState('INBOX')

  const sideBarExpand = useAppSelector(
    (state) => state.toolBar.data.sideBarExpand
  )
  const mobileSidebarExpand = useAppSelector(
    (state) => state.toolBar.data.mobileSideBarExpand
  )
  const selectedCategory = useAppSelector(
    (state) => state.toolBar.data.selectedCategory
  )

  const direction = useAppSelector((state) => state.theme.direction)

  const TaskListUrl = 'http://localhost:4000/taskList';

  const { data: ToolbarListData, error, isPending } = useQuery({
    queryKey: ['tasklistQuery'],
    queryFn: async () => {
      const response = await axios.get(TaskListUrl);
      return response.data;
    }
  });
  return (
    <div
      className={classNames(
        'min-w-[360px] ease-in-out duration-300 relative flex flex-auto flex-col ltr:border-r rtl:border-l border-gray-200 dark:border-gray-600',
        sideBarExpand && 'ltr:xl:ml-[280px] rtl:xl:mr-[280px]',
      )}
    >
      <div className="relative flex flex-0 items-center justify-between min-h-[55px] border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-1">
          <ToggleButton
            sideBarExpand={sideBarExpand}
            mobileSidebarExpand={mobileSidebarExpand}
          />
          <h6>{selectedCategory?.label}</h6>
        </div>
      </div>
      <ScrollBar autoHide direction={direction}>

        <Loading
          type={ToolbarListData?.length > 0 ? 'cover' : 'default'}
          spinnerClass={ToolbarListData?.length > 0 ? 'hidden' : ''}
          loading={isPending}
        >
          {ToolbarListData?.length > 0 ? (
            <>
              {
                selectedCategory?.value === 'tasks' && <TaskList />
              }
              {
                selectedCategory?.value === 'calender' && <ListExample />

              }
              {
                selectedCategory?.value === 'notes' && <TaskNotes />
              }
              {
                selectedCategory?.value === 'people' && <TaskPeople />
              }
              {
                selectedCategory?.value === 'setting' && <TaskSettings />
              }
            </>
          ) : (
            <div className="emptyPageBlock w-[65%]">
              <h5 className="inline-flex gap-3 items-center ">
                <MdWarningAmber className="text-xl" />
                No Data Available
              </h5>
            </div>
          )}
          <Outlet />
        </Loading>
      </ScrollBar>
    </div>
  )
}

export default ToolbarList



