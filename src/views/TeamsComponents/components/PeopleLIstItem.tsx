import { Badge, Button, Card } from '@/components/ui';
import React, { useEffect, useRef } from 'react';
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getInitials } from '@/utils/getInitials';

const PeopleLIstItem = ({ item }) => {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    const stopDraggable = draggable({
      element: el,
      getInitialData: () => ({ id: item.id }),
      onDragStart: () => console.log(`Dragging started for item ID: ${item.id}`),
      onDrop: () => console.log(`Dropped item ID: ${item.id}`),
    });

    return () => stopDraggable();
  }, [item]);
  console.log(item);
  const keys = Object.keys(item)
  const Keys = keys.filter((value) => value !== 'id')
  console.log(Keys);

  return (
    <div ref={ref}>
      {/* The code without knowing the keys  */}
      {/* <Card>
        <div className='flex justify-between'>
          {
            Keys.map((value) => (
              <>
                <p>{item[value]}</p>
              </>
            ))
          }
        </div>
      </Card> */}
      {/* The code knows the keys of the object */}
      <Card>
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

export default PeopleLIstItem;
