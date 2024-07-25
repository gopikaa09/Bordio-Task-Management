import { AdaptableCard } from "@/components/shared"
import ToolBar from "../SideBarComponents/Toolbar"
import TaskList from "./TaskList"
import { injectReducer, useAppSelector } from "@/store"
import reducer from "../store"
import ToolbarList from "./components/ToolbarList"
import { Outlet } from "react-router-dom"


injectReducer('toolBar', reducer)



const TeamMainPage = () => {
    const selectedCategory = useAppSelector(
        (state) => state.toolBar.data.selectedCategory
    )


    return (
        <AdaptableCard
            className="h-full overflow-hidden"
            bodyClass="p-0 h-full absolute inset-0 flex min-w-0 overflow-hidden"
        >
            <ToolBar />
            <ToolbarList />
            {/* <TaskList /> */}
            <Outlet />
        </AdaptableCard>
    )
}

export default TeamMainPage
