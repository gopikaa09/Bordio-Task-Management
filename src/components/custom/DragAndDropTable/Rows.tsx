import { useEffect, useRef } from "react";
import { draggable, monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import Td from "@/components/ui/Table/Td";
import Th from "@/components/ui/Table/Th";

const Rows = () => {
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
    <Th ref={ref}>
      <p>text</p>
    </Th>
  )
}
export default Rows