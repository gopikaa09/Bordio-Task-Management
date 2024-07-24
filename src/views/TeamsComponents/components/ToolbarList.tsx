import { useEffect, useState } from 'react'
import classNames from 'classnames'
import ScrollBar from '@/components/ui/ScrollBar'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Loading from '@/components/shared/Loading'
import {
  HiOutlineFlag,
  HiStar,
  HiPaperClip,
  HiMenu,
  HiMenuAlt2,
  HiOutlineTrash,
} from 'react-icons/hi'

import useResponsive from '@/utils/hooks/useResponsive'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import type { MouseEvent } from 'react'


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdWarningAmber } from 'react-icons/md'
// import { getConfirmation } from '@/components/common/CommonDialogProvider';
// import globalOptions from '@/configs/globalOptions';
import { Spinner } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { toggleMobileSidebar, toggleSidebar } from '@/views/store'
import axios from 'axios'


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

export const getMessageAddress = (mail, name) => {

  let add = mail?.emailAccountMessageAddresses?.find(x => x.addressType == name)
  if (add === undefined) add = {
    "address": "notfound",
    "name": "Not Found",
    "addressType": name
  }
  return add
}

export const getMessageToAddresses = (mail) => {

  let add = mail?.emailAccountMessageAddresses?.filter(x => x.addressType == 'to')

  return add
}

const ToolbarList = () => {
  const dispatch = useAppDispatch()

  const [folder, setFolder] = useState('INBOX')


  const mailId = useAppSelector((state) => state.crmMail.data.selectedMailId)
  const loading = useAppSelector(
    (state) => state.toolBar.data.ToolbarListLoading
  )
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

  const navigate = useNavigate()
  const location = useLocation()

  // const messageQuery = new MailsQuery().messages

  // const useMessgeQuery = new MailsQuery()

  // console.log(selectedCategory, 'selectedCategory')

  const params = {
    folders: selectedCategory?.value
  }

  // const { isPending, data: ToolbarListData } = useQuery({
  //   queryKey: ['mailMessages', selectedCategory?.value],
  //   queryFn: async () => {
  //     // const paramsString = `folders[0]=${selectedCategory?.value}`;

  //     await useMessgeQuery.getFolderData(selectedCategory?.value || 'INBOX')
  //     return await messageQuery.getAll({ folder: selectedCategory?.value })

  //   },
  //   keepPreviousData: true,
  // })

  useEffect(() => {
    const path = location.pathname.substring(
      location.pathname.lastIndexOf('/') + 1
    )

    const category = { category: path }

    if (path === 'mail') {
      category.category = 'INBOX'
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])



  // const onMailClick = (e: MouseEvent<HTMLDivElement>, id: number) => {
  //   e.stopPropagation()
  //   dispatch(updateMailId(id))
  //   dispatch(updateReply(false))
  //   navigate(`${location.pathname}?mail=${id}`, { replace: true })
  // }



  // function formatDate(date) {
  //   const today = moment();
  //   const isToday = today.isSame(date, 'day');
  //   if (isToday) return moment(date).format('H:mm A')

  //   const currentYear = moment().year();
  //   if (currentYear) return moment(date).format('MM-DD')
  //   return moment(date).format('YY-MM-DD')
  // }


  const queryClient = useQueryClient()



  //For event Delete code

  // const { isPending: deleteActivityLoad, mutateAsync: deleteActivityMutation } = useMutation({
  //     mutationFn: (uid) => {
  //         return useMessgeQuery.deleteSingleMail(uid)
  //     },
  //     onSettled: () => {
  //         // queryClient.invalidateQueries(['getCalendarDisplayDataData'])
  //         queryClient.invalidateQueries({ queryKey: ['mailMessages',selectedCategory?.value] })
  //     },
  // })
  // const { isPending: deleteActivityLoad, mutateAsync: deleteActivityMutation } = useMutation({
  //   mutationFn: async (uid) => {
  //     // Perform the delete request
  //     await useMessgeQuery.deleteSingleMail(uid);
  //     // Return the UID that was deleted to facilitate optimistic update
  //     return uid;
  //   },
  //   onMutate: (deletedNotesUid: any) => {


  //     // Chat
  //     dispatch(updateMailId(''));
  //     // Remove the query parameter from the URL
  //     navigate(location.pathname, { replace: true });


  //     queryClient.setQueryData(['mailMessages', selectedCategory?.value], (prevData: any) => {
  //       return {
  //         ...prevData,
  //         data: prevData?.data?.filter(
  //           (note: any) => note.remoteId !== deletedNotesUid
  //         ),
  //       }
  //     })

  //     return { prevNotes: queryClient.getQueryData(['mailMessages', selectedCategory?.value]) }
  //   },
  //   // onSettled: () => {
  //   //     // Invalidate the query to refetch the updated data
  //   //     queryClient.invalidateQueries({ queryKey: ['mailMessages',selectedCategory?.value] });
  //   // },
  //   onSettled: (data, error, variables, context: any) => {
  //     if (error) {
  //       queryClient.setQueryData(['mailMessages', selectedCategory?.value], context.prevNotes)
  //     }
  //     queryClient.invalidateQueries({ queryKey: ['mailMessages', selectedCategory?.value] });
  //   },
  // });

  // const onDeleteEventData = async (data: any) => {

  //   globalOptions.showDeleteConfirmation = false
  //   const response = await getConfirmation({
  //     title: 'Are you sure you want to delete',
  //     confirmText: 'Proceed to DELETE',
  //     confirmButtonColor: 'red',
  //     type: 'danger',
  //   })
  //   if (!response) return

  //   // await deleteActivityMutation(data)

  //   // Chat
  //   if (!response) return await deleteActivityMutation(data);
  //   await deleteActivityMutation(data);
  //   // Clear the mailId state to remove the selected mail content
  //   dispatch(updateMailId(''));
  //   // Remove the query parameter from the URL
  //   navigate(location.pathname, { replace: true });
  // }


  const [showContent, setShowContent] = useState({});
  const TaskListUrl = 'http://localhost:4000/taskList'; // Ensure this is the correct URL

  const { data, error, isLoading } = useQuery({
    queryKey: ['tasklist'],
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
        mailId ? 'hidden xl:flex' : 'xs:flex'
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
          type={ToolbarListData?.data?.length > 0 ? 'cover' : 'default'}
          spinnerClass={ToolbarListData?.data?.length > 0 ? 'hidden' : ''}
          loading={isPending}
        >
          {ToolbarListData?.data?.length > 0 ? (
            <>
              {ToolbarListData?.data?.map((message) => (
                <div
                  key={message?.uid}
                  className="relative flex border-b border-gray-200 dark:border-gray-600 last:border-0 hover:bg-hover"
                >
                  <div
                    className={`${mailId === message?.uid ? 'bg-gray-50 dark:bg-gray-700' : ''} w-full py-6 pr-4 pl-5 cursor-pointer select-none hover:bg-gray-50 hover:dark:bg-gray-700 flex`}
                    onClick={(e) => onMailClick(e, message?.uid)} // Moved onClick handler here
                    onMouseEnter={() => setShowContent(prevState => ({ ...prevState, [message?.uid]: true }))}
                    onMouseLeave={() => setShowContent(prevState => ({ ...prevState, [message?.uid]: false }))}
                  >
                    <div className="ltr:mr-2 rtl:ml-2">
                      <Avatar
                        shape="circle"
                        size={25}
                        src={message?.avatar}
                      />
                    </div>
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2 relative">
                        <div
                          className="flex items-center"
                          onClick={(e) => onMailClick(e, message?.uid)}
                        >
                          <span className="font-semibold truncate max-w-[200px]  text-gray-900 dark:text-gray-100">
                            {
                              selectedCategory?.label === 'SENT'
                                ?
                                getMessageAddress(message, 'to')?.name
                                :
                                getMessageAddress(message, 'from')?.name

                            }
                            {/* {getMessageAddress(message, 'from')?.name} */}
                          </span>
                          {message?.flagged && (
                            <span className="ltr:ml-2 rtl:mr-2">
                              <HiOutlineFlag className="text-red-500" />
                            </span>
                          )}
                        </div>
                        {showContent[message?.uid] && (
                          <div className="absolute top-0 right-0 p-2">
                            <div className="flex items-center text-lg gap-2">
                              {message?.attachment?.length <= 0 && <HiPaperClip />}
                              {message?.starred && (
                                <HiStar size={20} className="text-amber-500 ltr:ml-1 rtl:mr-1" />
                              )}
                              <HiOutlineTrash
                                size={16}
                                className="text-red-600 cursor-pointer"
                                onClick={() => onDeleteEventData(message?.remoteId)}
                              />
                              {/* {deleteActivityLoad ? (
                                                            <Spinner size={20} color="red-500" />
                                                        ) : (
                                                        )}  */}
                              {/* <Button
                                                            variant="twoTone" shape="circle" color="red-700" size="xs"
                                                            icon={<HiOutlineTrash size={14} />}
                                                            loading={deleteActivityLoad} className="-mt-1"
                                                            onClick={() => onDeleteEventData(message?.remoteId)}
                                                        /> */}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-auto w-full justify-between">
                        <p>{message?.subject}</p>
                        <div className="ltr:ml-2 rtl:mr-2">
                          <span className="whitespace-nowrap">{formatDate(message?.receivedDate)}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="emptyPageBlock w-[65%]">
              <h5 className="inline-flex gap-3 items-center ">
                <MdWarningAmber className="text-xl" />
                No Data Available
              </h5>
            </div>
          )}
        </Loading>
      </ScrollBar>
    </div>
  )
}

export default ToolbarList



