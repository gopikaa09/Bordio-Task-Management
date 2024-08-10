import { useCallback, useEffect, useRef, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import invariant from 'tiny-invariant';

import CheckIcon from '@atlaskit/icon/glyph/check';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { Button } from '@/components/ui';

const containerStyles = css({
  boxShadow: token(
    'elevation.shadow.raised',
    '0px 1px 1px rgba(9, 30, 66, 0.25),0px 0px 1px rgba(9, 30, 66, 0.31)',
  ),
  borderRadius: token('border.radius.100', '4px'),
  overflow: 'hidden',
  display: 'flex',
  height: 400,
  position: 'relative',
  background: token('elevation.surface.raised', '#FFF'),
});




const Colors = [
  { name: 'red', color: 'red' },
  { name: 'green', color: 'green' },
  { name: 'black', color: 'black' },
  { name: 'blue', color: 'blue' },
];

const canvasStyles = css({
  width: '100%',
  height: '100%',
  background: 'lightgray',
});

const dividerStyles = css({
  width: 1,
  height: token('space.400', '32px'),
  background: token('color.border', '#091E4224'),
  display: 'flex',
});

export default function TaskNotes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('red');

  useEffect(() => {
    const canvas = canvasRef.current;
    invariant(canvas);

    const ctx = canvas.getContext('2d');
    invariant(ctx);

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);

    ctx.fillStyle = 'blue';
    ctx.fillRect(10, 10, 100, 100);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const { borderBoxSize } of entries) {
        if (!borderBoxSize) {
          return;
        }

        const [{ inlineSize, blockSize }] = borderBoxSize;

        canvas.width = inlineSize;
        canvas.height = blockSize;

        Object.assign(ctx, {
          strokeStyle: ctx.strokeStyle,
          shadowColor: ctx.shadowColor,
          lineCap: 'round',
          lineJoin: 'round',
          lineWidth: 2,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 2,
        });
      }
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    invariant(canvas);

    const ctx = canvas.getContext('2d');
    invariant(ctx);

    let prevPoint: { x: number; y: number } | null = null;

    return combine(
      bind(canvas, {
        type: 'pointerdown',
        listener(event) {
          const { clientX, clientY } = event;
          const rect = canvas.getBoundingClientRect();

          ctx.strokeStyle = selectedColor;
          ctx.beginPath();
          ctx.moveTo(clientX - rect.x, clientY - rect.y);
          prevPoint = { x: clientX, y: clientY };
        },
      }),
      draggable({
        element: canvas,
        onGenerateDragPreview({ nativeSetDragImage }) {
          disableNativeDragPreview({ nativeSetDragImage });
        },
        onDragStart() {
          preventUnhandled.start();
        },
        onDrag({ location }) {
          const { clientX, clientY } = location.current.input;
          const rect = canvas.getBoundingClientRect();

          invariant(prevPoint);
          const { x, y } = prevPoint;

          ctx.beginPath();
          ctx.moveTo(x - rect.x, y - rect.y);
          ctx.lineTo(clientX - rect.x, clientY - rect.y);
          ctx.stroke();

          prevPoint = { x: clientX, y: clientY };
        },
        onDrop() {
          preventUnhandled.stop();
          ctx.closePath();
        },
      }),
    );
  }, [selectedColor]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    invariant(canvas);

    const ctx = canvas.getContext('2d');
    invariant(ctx);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div css={containerStyles} className="m-4 overflow-x-auto">
      <canvas
        className='bg-gray-100 border-1'
        ref={canvasRef}
        css={canvasStyles}
        width='900'
        height="400"
      />

      <div className='flex gap-2 items-center justify-center'>
        {
          Colors.map((value) => (
            <div
              key={value.name}
              className={`bg-${value.color}-700 rounded-3xl w-8 h-8`}
              onClick={() => setSelectedColor(value.color)}
            />
          ))
        }
        <div />
        <Button variant="solid" onClick={clearCanvas} className='my-4'>
          Reset
        </Button>
      </div>
    </div>
  );
}
