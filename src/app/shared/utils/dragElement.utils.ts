export const initializeDraggable = (element: HTMLElement) => {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  const dragMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    pos3 = event.clientX;
    pos4 = event.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  };

  const elementDrag = (event: MouseEvent) => {
    event.preventDefault();
    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;

    element.style.top = element.offsetTop - pos2 + 'px';
    element.style.left = element.offsetLeft - pos1 + 'px';
  };

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  element.onmousedown = dragMouseDown;
};
