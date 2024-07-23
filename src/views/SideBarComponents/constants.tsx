import {  CgCheckR, CgNotes } from 'react-icons/cg'
import { HiOutlineUser } from 'react-icons/hi';
import { IoCalendarNumberOutline } from "react-icons/io5";

type MenuBase = {
    value: string
    label: string
}

type Group = MenuBase & {
    icon: JSX.Element
}

type Label = MenuBase & {
    dotClass: string
}

export const groupList: Group[] = [
    { value: 'tasks', label: 'Tasks', icon: <CgCheckR /> },
    { value: 'calender', label: 'Calender', icon: <IoCalendarNumberOutline   /> },
    { value: 'notes', label: 'Notes', icon: <CgNotes  /> },
    { value: 'people', label: 'People', icon: <HiOutlineUser /> },
]

// export const labelList: Label[] = [
//     { value: 'work', label: 'Work', dotClass: 'bg-blue-500' },
//     { value: 'private', label: 'Private', dotClass: 'bg-indigo-500' },
//     { value: 'important', label: 'Important', dotClass: 'bg-red-500' },
// ]
