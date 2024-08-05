import { useEffect, useRef } from "react";
import Th from "../ui/Table/Th";
import THead from "../ui/Table/THead";
import Tr from "../ui/Table/Tr";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";



const Table = () => {
  // console.log(data);
  const ref = useRef()

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    const stopDraggable = draggable({
      element: el,
      // getInitialData: () => ({ id: task.id, status: task.status }),
      onDragStart: () => console.log('Dragging started for:'),
      onDrop: () => console.log('Dropped task:'),
    });

    return () => stopDraggable();
  }, []);
  return (
    <>
      {/* <Table>
        <THead>
          <Tr>
            <Th ref={ref}>Title</Th>
            <Th>Title</Th>
            <Th>Title</Th>
          </Tr>
        </THead>

      </Table> */}
    </>
  )
}

export default Table