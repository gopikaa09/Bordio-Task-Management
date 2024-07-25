import { useEffect } from 'react'
import classNames from 'classnames'
import Menu from '@/components/ui/Menu'
import Badge from '@/components/ui/Badge'
import ScrollBar from '@/components/ui/ScrollBar'
import Drawer from '@/components/ui/Drawer'
import useResponsive from '@/utils/hooks/useResponsive'

import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { toggleMobileSidebar, updateSelectedCategory } from '../store/toolBarSlice'
import { CgCheckR, CgNotes } from 'react-icons/cg'
import { IoCalendarNumberOutline } from 'react-icons/io5'
import { HiOutlineUser } from 'react-icons/hi'
import { MdOutlineSettings } from 'react-icons/md'


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

const { MenuItem, MenuGroup } = Menu

const ToolBarContent = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const dispatch = useAppDispatch()

    const selectedCategory = useAppSelector(
        (state) => state.toolBar.data.selectedCategory
    )

    const ToolBarList = [
        {
            "name": "Tasks",
            "id": "tasks",
            "isDisplay": true
        },
        {
            "name": "Calender",
            "id": "calender",
            "isDisplay": true
        },
        {
            "name": "Notes",
            "id": "notes",
            "isDisplay": true
        },
        {
            "name": "People",
            "id": "people",
            "isDisplay": true
        },
        {
            "name": "Settings",
            "id": "setting",
            "isDisplay": true
        },
    ]

    const ToolsIcon = {
        "tasks": <CgCheckR />,
        "calender": <IoCalendarNumberOutline />,
        "notes": <CgNotes />,
        "people": <HiOutlineUser />,
        "setting": <MdOutlineSettings />
    }
    const defaultIcon = <CgCheckR size={20} />;

    const ToolsList = ToolBarList
        ?.filter(folder => folder.isDisplay)
        .map(role => ({
            label: role.name,
            value: role.id,
            icon: ToolsIcon[role.id] || defaultIcon
        }));
    const direction = useAppSelector((state) => state.theme.direction)

    const onMenuClick = (category: Group | Label) => {
        // dispatch(updateMailId(''))
        dispatch(updateSelectedCategory(getCategory(category.value)))
        navigate(`/frontEndTeam/${category.value}`, { replace: true })
    }

    useEffect(() => {
        const newUrl = window.location.origin + window.location.pathname;

        const path = newUrl.substring(
            newUrl.lastIndexOf('/') + 1
        )
        const selected = getCategory(path)
        dispatch(updateSelectedCategory(selected))
        navigate(`/frontEndTeam/${selected.value}`, { replace: true })

    }, [])

    const getCategory = (value: string) => {
        const categories = [...ToolsList]
        let category = value
        if (category === 'frontEndTeam') {
            category = 'tasks'
        }
        return {
            value: category,
            label: categories.find((cat) => cat.value === category)?.label,
        }
    }

    return (
        <ScrollBar direction={direction}>
            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="my-8 mx-6">
                        <h3>Tools</h3>
                    </div>
                    <Menu variant="transparent" className="mx-2 mb-10">
                        {ToolsList.map((menu) => (
                            <MenuItem
                                key={menu.value}
                                eventKey={menu.value}
                                className={`mb-2 ${selectedCategory.value === menu.value
                                    ? 'bg-gray-100 dark:bg-gray-700'
                                    : ''
                                    }`}
                                onSelect={() => onMenuClick(menu)}
                            >
                                <span className="text-2xl ltr:mr-2 rtl:ml-2">
                                    {menu.icon}
                                </span>
                                <span>{menu.label}</span>
                            </MenuItem>
                        ))}
                    </Menu>
                </div>

            </div>
        </ScrollBar>
    )
}

const ToolBar = () => {
    const sideBarExpand = useAppSelector(
        (state) => state.toolBar.data.sideBarExpand
    )

    const mobileSideBarExpand = useAppSelector(
        (state) => state.toolBar.data.mobileSideBarExpand
    )

    const dispatch = useAppDispatch()

    const { smaller } = useResponsive()

    const onMobileSideBarClose = () => {
        dispatch(toggleMobileSidebar(false))
    }

    return smaller.xl ? (
        <Drawer
            bodyClass="p-0"
            title="Tools"
            isOpen={mobileSideBarExpand}
            placement="left"
            drawerClass={'w-full md:w-[300px]'}
            onClose={onMobileSideBarClose}
            onRequestClose={onMobileSideBarClose}
        >
            <ToolBarContent />
        </Drawer>
    ) : (
        <div
            className={classNames(
                'w-[280px] absolute top-0 bottom-0 ease-in-out duration-300 bg-white dark:bg-gray-800 ltr:border-r rtl:border-l border-gray-200 dark:border-gray-600 z-10',
                sideBarExpand
                    ? 'ltr:left-0 rtl:right-0'
                    : 'ltr:left-[-280px] rtl:right-[-280px]'
            )}
        >
            <ToolBarContent />
        </div>
    )
}

export default ToolBar
