import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { draggable, monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Table } from "../../ui";
import Rows from "./Rows";

const { Tr, Th, Td, THead, TBody } = Table

const DraggableTable = () => {
  // console.log(data);

  useEffect(() => {
    const stopMonitoring = monitorForElements({
      onDrop: async ({ source, location }) => {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const destinationStatus = destination.data.status;
        const sourceTaskId = source.data.id;
        console.log(destinationStatus);
        return () => stopMonitoring()
      }
    })
  }, [])
  return (
    <div className="m-4">
      <Table>
        <THead>
          <Tr>
            <Rows />
            <Rows />
            <Rows />
            <Rows />

          </Tr>
        </THead>
      </Table>
    </div>
  )
}

export default DraggableTable