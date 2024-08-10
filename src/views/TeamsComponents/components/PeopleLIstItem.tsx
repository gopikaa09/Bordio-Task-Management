import { Badge, Card } from '@/components/ui';
import React, { useEffect, useRef, useState } from 'react';
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getInitials } from '@/utils/getInitials';
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";

const PeopleListItem = ({ item }) => {
  const ref = useRef();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    const stopDraggable = draggable({
      element: el,
      getInitialData: () => ({ id: item.id }),
      onDragStart: () => {
        console.log(`Dragging started for item ID: ${item.id}`);
        setIsDragging(true);
      },
      onDrop: () => {
        console.log(`Dropped item ID: ${item.id}`);
        setIsDragging(false);
      },

      onGenerateDragPreview({ nativeSetDragImage }) {
        setCustomNativeDragPreview({
          render({ container }) {
            console.log(container);
            container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            container.style.color = 'white';
            container.style.padding = '8px';
            container.style.borderRadius = '4px';
            container.innerHTML = item.name;

            return () => setIsDragging(false);
          },
          nativeSetDragImage,
        });
      },
    });

    return () => stopDraggable();
  }, [item]);

  // const cardStyle = isDragging
  //   ? 'border-dashed border-2 border-blue-500 shadow-lg bg-red-200'
  //   : 'border border-gray-300';

  return (
    <div ref={ref}>
      <Card className={`p-1 `}>
        <div className='flex justify-between'>
          <div className='flex gap-2 items-center'>
            <div className="bg-gray-400 px-3 py-2 rounded-full text-white text-xs font-semibold">
              <span>{getInitials(item.name)}</span>
            </div>
            <span>{item?.name}</span>
          </div>
          <p>{item?.email}</p>
          <p>{item?.Role}</p>
          <Badge
            className="font-semibold p-2 px-3"
            content={item?.isActive}
            innerClass={`${item?.isActive === 'Active' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}
          />
        </div>
      </Card>
    </div>
  );
};

export default PeopleListItem;
