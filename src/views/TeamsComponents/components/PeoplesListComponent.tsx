import { Card } from '@/components/ui';
import React, { useEffect, useState } from 'react';
import PeopleLIstItem from './PeopleLIstItem';
import { monitorForElements, dropTargetForElements, draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

const PeoplesListComponent = ({ data: initialPeoples }) => {
  const [peoples, setPeoples] = useState(initialPeoples);

  useEffect(() => {
    const stopMonitoring = monitorForElements({
      onDrop: async ({ source, location }) => {
        const dropTargets = location.current.dropTargets;

        console.log('Drop targets:', dropTargets);

        if (dropTargets.length === 0) {
          console.error('No drop targets found.');
          return;
        }

        const dropTargetData = dropTargets[0]?.data;
        if (!dropTargetData || typeof dropTargetData.index !== 'number') {
          console.error('Invalid drop target data.');
          return;
        }

        const dropTargetIndex = dropTargetData.index;

        const newPeoples = [...peoples];
        const draggedItemIndex = newPeoples.findIndex(item => item.id === source.data.id);
        if (draggedItemIndex === -1) return;

        const [movedItem] = newPeoples.splice(draggedItemIndex, 1);
        newPeoples.splice(dropTargetIndex, 0, movedItem);

        setPeoples(newPeoples);
        console.log(`Item ID: ${source.data.id} moved to position: ${dropTargetIndex}`);

      },
    });

    const dropTargets = document.querySelectorAll('.drop-target');
    dropTargets.forEach((target, index) => {
      dropTargetForElements({
        element: target,
        getData: () => ({ index })
      });
    });

    return () => stopMonitoring();
  }, [peoples]);

  return (
    <div className='flex flex-col gap-2'>
      {
        peoples?.map((item, index) => (
          <div key={item.id} className='drop-target' data-index={index}>
            <PeopleLIstItem item={item} />
          </div>
        ))
      }
    </div>
  );
};

export default PeoplesListComponent;
