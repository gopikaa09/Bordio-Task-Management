import { useEffect } from 'react'
import classNames from 'classnames'
import Menu from '@/components/ui/Menu'
import Badge from '@/components/ui/Badge'
import ScrollBar from '@/components/ui/ScrollBar'
import Drawer from '@/components/ui/Drawer'
import useResponsive from '@/utils/hooks/useResponsive'

import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { groupList } from './constants'


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

    // const selectedCategory = useAppSelector(
    //     (state) => state.crmMail.data.selectedCategory
    // )

    const direction = useAppSelector((state) => state.theme.direction)

    const onMenuClick = (category: Group | Label) => {
        console.log('====================================');
        console.log(category);
        console.log('====================================');
        // dispatch(updateMailId(''))
        // dispatch(updateSelectedCategory(getCategory(category.value)))
        navigate(`/frontEndTeam/${category.value}`, { replace: true })
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const selected = getCategory(path)
        // dispatch(updateSelectedCategory(selected))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCategory = (value: string) => {
        const categories = [...groupList]
        let category = value
        if (category === 'mail') {
            category = 'inbox'
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
                        {groupList.map((menu) => (
                            <MenuItem
                                key={menu.value}
                                eventKey={menu.value}
                                // className={`mb-2 ${
                                //     selectedCategory.value === menu.value
                                //         ? 'bg-gray-100 dark:bg-gray-700'
                                //         : ''
                                // }`}
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
                <div className="mx-4 mb-4">
                    {/* <MainCompose /> */}
                </div>
            </div>
        </ScrollBar>
    )
}

const ToolBar = () => {
    // const sideBarExpand = useAppSelector(
    //     // (state) => state.crmMail.data.sideBarExpand
    // )

    // const mobileSideBarExpand = useAppSelector(
    //     // (state) => state.crmMail.data.mobileSideBarExpand
    // )

    const dispatch = useAppDispatch()

    const { smaller } = useResponsive()

    const onMobileSideBarClose = () => {
        // dispatch(toggleMobileSidebar(false))
    }

    return smaller.xl ? (
        <Drawer
            bodyClass="p-0"
            title="Mail"
            isOpen={true}
            placement="left"
            width={280}
            onClose={onMobileSideBarClose}
            onRequestClose={onMobileSideBarClose}
        >
            <ToolBarContent />
        </Drawer>
    ) : (
        <div
            className={classNames(
                'w-[280px] absolute top-0 bottom-0 ease-in-out duration-300 bg-white dark:bg-gray-800 ltr:border-r rtl:border-l border-gray-200 dark:border-gray-600 z-10',
                true
                    ? 'ltr:left-0 rtl:right-0'
                    : 'ltr:left-[-280px] rtl:right-[-280px]'
            )}
        >
            <ToolBarContent />
        </div>
    )
}

export default ToolBar
