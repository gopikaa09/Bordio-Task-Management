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

const sidebarStyles = css({
  background: token('elevation.surface.overlay', '#FFF'),
  display: 'flex',
  padding: 16,
  gap: 16,
  position: 'absolute',
  bottom: 24,
  boxShadow: token(
    'elevation.shadow.overlay',
    '0px 8px 12px rgba(9, 30, 66, 0.15),0px 0px 1px rgba(9, 30, 66, 0.31)',
  ),
  borderRadius: 4,
  left: '50%',
  transform: 'translateX(-50%)',
  boxSizing: 'border-box',
  width: 'max-content',
});

const swatchBaseStyles = css({
  boxSizing: 'border-box',
  border: `2px solid ${token('color.border', 'rgba(9, 30, 66, 0.14)')}`,
  width: 32,
  height: 32,
  borderRadius: '50%',
  cursor: 'pointer',
  color: token('color.text.inverse', '#FFF'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const swatchColorMap = {
  red: token('color.background.accent.red.subtle', '#F87462'),
  orange: token('color.background.accent.orange.subtle', '#FAA53D'),
  yellow: token('color.background.accent.yellow.subtle', '#E2B203'),
  green: token('color.background.accent.green.subtle', '#4BCE97'),
  teal: token('color.background.accent.teal.subtle', '#60C6D2'),
  blue: token('color.background.accent.blue.subtle', '#579DFF'),
  purple: token('color.background.accent.purple.subtle', '#9F8FEF'),
  magenta: token('color.background.accent.magenta.subtle', '#E774BB'),
};

type SwatchColor = keyof typeof swatchColorMap;

function Swatch({
  color,
  isSelected = false,
  onSelect: onSelectProp,
}: {
  color: SwatchColor;
  isSelected?: boolean;
  onSelect: (color: SwatchColor) => void;
}) {
  const onSelect = useCallback(() => {
    onSelectProp(color);
  }, [color, onSelectProp]);

  return (
    <button
      css={swatchBaseStyles}
      onClick={onSelect}
      style={{ backgroundColor: swatchColorMap[color] }}
    >
      {/* {isSelected && <CheckIcon label="" size="medium" />} */}
    </button>
  );
}

const canvasStyles = css({
  width: '100%',
  height: '100%',
  background: 'lightgray', // Ensure visibility with a distinct color
});

const dividerStyles = css({
  width: 1,
  height: token('space.400', '32px'),
  background: token('color.border', '#091E4224'),
  display: 'flex',
});

export default function TaskNotes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    invariant(canvas);

    const ctx = canvas.getContext('2d');
    invariant(ctx);

    // Log canvas dimensions for debugging
    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);

    // Draw an initial rectangle to check visibility
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

        // Adjust drawing context settings
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

          ctx.beginPath();
          ctx.lineTo(clientX - rect.x, clientY - rect.y);
          ctx.stroke();
          ctx.closePath();

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
  }, []);

  const [selectedColor, setSelectedColor] = useState<SwatchColor>('red');

  useEffect(() => {
    const canvas = canvasRef.current;
    invariant(canvas);

    const ctx = canvas.getContext('2d');
    invariant(ctx);

    // Set stroke and shadow colors
    ctx.strokeStyle = swatchColorMap[selectedColor];
    ctx.shadowColor = swatchColorMap[selectedColor];
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
      <div css={sidebarStyles}>
        <Inline space="space.100">
          {(Object.keys(swatchColorMap) as SwatchColor[]).map((color) => (
            <Swatch
              key={color}
              color={color}
              isSelected={color === selectedColor}
              onSelect={setSelectedColor}
            />
          ))}
        </Inline>
        <div css={dividerStyles} />
        <Button variant="solid" onClick={clearCanvas} className='my-4'>
          Reset
        </Button>
      </div>
    </div>
  );
}
