import { Drawer } from "@/components/ui"
import { useEffect, useState } from "react"

const AddTask = () => {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => {
    setIsOpen(true)
  }

  const onDrawerClose = (e: MouseEvent) => {
    console.log('onDrawerClose', e)
    setIsOpen(false)
  }
  useEffect(() => {
    setIsOpen(true)
  }, [])
  return (
    <div>
      <Drawer
        title='Add Task'
        isOpen={isOpen}
        drawerClass={'w-full md:w-[650px]'}
        bodyClass='overflow-x-hidden p-0 editDrawer'
        className=''
      // onClose={onDrawerClose}
      // onRequestClose={onDrawerClose}
      >
        <div className="p-5">
          <p>TasksAdd</p>
        </div>

      </Drawer>

    </div>
  )
}
export default AddTask