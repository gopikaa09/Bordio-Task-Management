import { AdaptableCard } from "@/components/shared"
import ToolBar from "../SideBarComponents/Toolbar"
import TaskList from "./TaskList"
import { injectReducer } from "@/store"
import reducer from "../store"
import ToolbarList from "./components/ToolbarList"


injectReducer('toolBar', reducer)



const TeamMainPage = () => {

    return (
        <AdaptableCard
            className="h-full overflow-hidden"
            bodyClass="p-0 h-full absolute inset-0 flex min-w-0 overflow-hidden"
        >
            {/* <ToolBar /> */}
            <ToolbarList />
            <TaskList />
        </AdaptableCard>
    )
}

export default TeamMainPage
