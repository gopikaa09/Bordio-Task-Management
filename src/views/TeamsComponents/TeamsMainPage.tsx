import { AdaptableCard } from "@/components/shared"
import ToolBar from "../SideBarComponents/Toolbar"
import TaskList from "./TaskList"



const Mail = () => {
    return (
        <AdaptableCard
            className="h-full overflow-hidden"
            bodyClass="p-0 h-full absolute inset-0 flex min-w-0 overflow-hidden"
        >
            <ToolBar/>
            <TaskList/>
        </AdaptableCard>
    )
}

export default Mail
