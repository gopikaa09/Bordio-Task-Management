// import { Loading } from "@/components/shared";
// import { Avatar, ScrollBar } from "@/components/ui"
// import { useAppSelector } from "@/store";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { useState } from "react";
// import { HiOutlineFlag, HiOutlineTrash, HiPaperClip, HiStar } from "react-icons/hi";
// import { MdWarningAmber } from "react-icons/md";

// const TaskNotes = () => {
//   const TaskListUrl = 'http://localhost:4000/notes'; // Ensure this is the correct URL

//   const { data: NotesList, error, isPending } = useQuery({
//     queryKey: ['tasknotes'],
//     queryFn: async () => {
//       const response = await axios.get(TaskListUrl);
//       return response.data;
//     }
//   });
//   console.log(NotesList);
//   // const navigate = useNavigate()

//   // const direction = useAppSelector((state) => state.theme.direction)

//   // const [showContent, setShowContent] = useState({});


//   // const onMailClick = (e: MouseEvent<HTMLDivElement>, id: number) => {
//   //   e.stopPropagation()
//   //   dispatch(updateMailId(id))
//   //   dispatch(updateReply(false))
//   //   navigate(`${location.pathname}?mail=${id}`, { replace: true })
//   // }
//   return (
//     <>
//       <ScrollBar autoHide direction={direction}>

//         <Loading
//           type={NotesList?.length > 0 ? 'cover' : 'default'}
//           spinnerClass={NotesList?.length > 0 ? 'hidden' : ''}
//           loading={isPending}
//         >
//           {NotesList?.length > 0 ? (
//             <>
//               {NotesList?.map((message) => (
//                 <div
//                   key={message?.id}
//                   className="relative flex border-b border-gray-200 dark:border-gray-600 last:border-0 hover:bg-hover"
//                 >
//                   <div
//                     className={`${true ? 'bg-gray-50 dark:bg-gray-700' : ''} w-full py-6 pr-4 pl-4 cursor-pointer select-none hover:bg-gray-50 hover:dark:bg-gray-700 flex`}
//                     onClick={(e) => onMailClick(e, message?.id)} // Moved onClick handler here
//                     onMouseEnter={() => setShowContent(prevState => ({ ...prevState, [message?.id]: true }))}
//                     onMouseLeave={() => setShowContent(prevState => ({ ...prevState, [message?.id]: false }))}
//                   >

//                     <div className="w-full">
//                       <div className="ltr:mr-2 rtl:ml-2">
//                         {message?.id && (
//                           <Avatar
//                             shape="circle"
//                             size={25}
//                             src={message?.avatar}
//                           />
//                         )}
//                       </div>
//                       <div className="flex items-center justify-between mb-2 relative">
//                         <div
//                         >
//                           <h2>Gopika</h2>
//                         </div>

//                         {showContent[message?.id] && (
//                           <div className="absolute top-0 right-0 p-2">
//                             <div className="flex items-center text-lg gap-2">
//                               {message?.attachment?.length <= 0 && <HiPaperClip />}
//                               {message?.starred && (
//                                 <HiStar size={20} className="text-amber-500 ltr:ml-1 rtl:mr-1" />
//                               )}
//                               <HiOutlineTrash
//                                 size={16}
//                                 className="text-red-600 cursor-pointer"
//                               // onClick={() => onDeleteEventData(message?.remoteId)}
//                               />
//                               {/* {deleteActivityLoad ? (
//                                             <Spinner size={20} color="red-500" />
//                                         ) : (
//                                         )}  */}
//                               {/* <Button
//                                             variant="twoTone" shape="circle" color="red-700" size="xs"
//                                             icon={<HiOutlineTrash size={14} />}
//                                             loading={deleteActivityLoad} className="-mt-1"
//                                             onClick={() => onDeleteEventData(message?.remoteId)}
//                                         /> */}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex flex-auto w-full justify-between">
//                         <p>{message?.title}</p>
//                         <div className="ltr:ml-2 rtl:mr-2">
//                           {/* <span className="whitespace-nowrap">{formatDate(message?.receivedDate)}</span> */}
//                         </div>
//                       </div>

//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </>
//           ) : (
//             <div className="emptyPageBlock w-[65%]">
//               <h5 className="inline-flex gap-3 items-center ">
//                 <MdWarningAmber className="text-xl" />
//                 No Data Available
//               </h5>
//             </div>
//           )}
//         </Loading>
//       </ScrollBar>
//     </>
//   )
// }
// export default TaskNotes


const TaskNotes = () => {
  return (
    <>
      <h3>Notes</h3>
    </>
  )
}
export default TaskNotes