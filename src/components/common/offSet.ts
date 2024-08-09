export function offsetFromPointer(event: DragEvent, offsetX: number, offsetY: number) {
  return {
    x: event.clientX + offsetX,
    y: event.clientY + offsetY,
  };
}
