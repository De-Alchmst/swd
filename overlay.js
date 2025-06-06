function enterSelectionMode(button, onSelect) {
  // Create overlay to capture all clicks and change cursor
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: crosshair;
    z-index: 9999;
    background: transparent;
  `;
  
  // Click handler to capture selected element
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button != button) return;
    
    // Temporarily hide overlay to get element underneath
    overlay.style.display = 'none';
    
    // Clean up and call callback
    cleanup();
    if (onSelect) {
      onSelect(e.clientX, e.clientY);
    }
  };
  
  // Cleanup function
  const cleanup = () => {
    overlay.removeEventListener('auxclick', handleClick);
    document.body.removeChild(overlay);
  };
  
  // Add event listeners
  overlay.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  overlay.addEventListener('auxclick', handleClick);
  
  // Add overlay to DOM
  document.body.appendChild(overlay);
  
  // Return cleanup function in case you want to cancel programmatically
  return cleanup;
}


function enterMoveMode(button, x, y, win) {
  // Create overlay to capture all clicks and change cursor
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: crosshair;
    z-index: 9999;
    background: transparent;
  `;

  const outline = document.createElement('div');
  outline.style.cssText = `
    position: fixed;
    top: ${win.y}px;
    left: ${win.x}px;
    width: calc(${win.width}px - 8px);
    height: calc(${win.height}px - 8px);
    z-index: 8888;
    background: transparent;
    border: 4px solid crimson;
  `;
  
  // Click handler to capture selected element
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button != button) return;
    
    // Temporarily hide overlay to get element underneath
    overlay.style.display = 'none';
    
    // Clean up and call callback
    cleanup();
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    win.move(win.x + dx, win.y + dy);
  };

  // move the outline
  const handleMove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    outline.style.top  = `calc(${outline.style.top}  + ${e.movementY}px)`;
    outline.style.left = `calc(${outline.style.left} + ${e.movementX}px)`;
  }

  
  // Cleanup function
  const cleanup = () => {
    overlay.removeEventListener('mousemove', handleMove);
    overlay.removeEventListener('auxclick', handleClick);
    document.body.removeChild(outline);
    document.body.removeChild(overlay);
  };
  
  // Add event listeners
  overlay.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  overlay.addEventListener('mousemove', handleMove);
  overlay.addEventListener('auxclick', handleClick);
  
  // Add overlay to DOM
  document.body.appendChild(outline);
  document.body.appendChild(overlay);
  
  // Return cleanup function in case you want to cancel programmatically
  return cleanup;
}
