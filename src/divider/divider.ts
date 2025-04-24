export const dividerInit = (
  divider: HTMLElement,
  leftBlock: HTMLElement,
  rightBlock: HTMLElement
): void => {
  let isDragging = false;
  let container: HTMLElement | undefined = undefined;

  const handleMouseDown = (event: MouseEvent): void => {
    isDragging = true;
    if (divider.parentElement) container = divider.parentElement;
    document.body.style.cursor = 'col-resize';
    event.preventDefault();
  };

  const handleMouseMove = (event: MouseEvent): void => {
    if (!isDragging || !container) return;

    const containerWidth = container.clientWidth;
    const newLeftWidth = (event.clientX / containerWidth) * 100;
    const clampedWidth = Math.max(10, Math.min(90, newLeftWidth));

    leftBlock.style.width = `${clampedWidth}%`;
    rightBlock.style.flex = `1 1 ${100 - clampedWidth}%`;
  };

  const handleMouseUp = (): void => {
    isDragging = false;
    document.body.style.cursor = '';
  };

  divider.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};
