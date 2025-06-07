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


function enterMoveMode(button, mouseX, mouseY,
                       origX, origY, width, height, onMove) {
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
    top: ${origY}px;
    left: ${origX}px;
    width: calc(${width}px - 8px);
    height: calc(${height}px - 8px);
    z-index: 8888;
    background: transparent;
    border: 4px solid crimson;
  `;

  // offset of mouse from window position
  const offsetX = mouseX - origX;
  const offsetY = mouseY - origY;
  
  // Click handler to capture selected element
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button != button) return;
    
    // Temporarily hide overlay to get element underneath
    overlay.style.display = 'none';
    
    // Clean up and call callback
    cleanup();
    const dx = e.clientX - mouseX;
    const dy = e.clientY - mouseY;

    onMove(origX + dx, origY + dy);
  };

  // move the outline
  const handleMove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    outline.style.top  = `${e.clientY - offsetY}px`;
    outline.style.left = `${e.clientX - offsetX}px`;
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


function enterSizeMode(button, onSize) {
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
    top: -100;
    left: -100;
    width: 0;
    height: 0;
    z-index: 8888;
    background: transparent;
    border: 4px solid crimson;
  `;

  let point = null;
  
  // Click handler to capture selected element
  const handleDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button != button) return;

    point = [e.clientX, e.clientY];

    outline.style.top  = `${e.clientY}px`;
    outline.style.left = `${e.clientX}px`;
  };

  const handleUp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button != button) return;
    if (!point) return;


    // Temporarily hide overlay to get element underneath
    overlay.style.display = 'none';

    // Clean up and call callback
    cleanup();
    let x, y, w, h;

    if (point[0] > e.clientX) {
      w = point[0] - e.clientX;
      x = e.clientX;
    } else {
      w = e.clientX - point[0];
      x = point[0];
    }

    if (point[1] > e.clientY) {
      h = point[1] - e.clientY;
      y = e.clientY;
    } else {
      h = e.clientY - point[1];
      y = point[1];
    }

    // minimal size
    if (w < 150) w = 150;
    if (h < 60) h = 60;

    onSize(x, y, w, h);
  };

  // move the outline
  const handleMove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!point) return;

    if (point[0] > e.clientX) {
      outline.style.left = `${e.clientX}px`;
      outline.style.width  = `${point[0] - e.clientX}px`;
    } else {
      outline.style.left = `${point[0]}px`;
      outline.style.width  = `${e.clientX - point[0]}px`;
    }

    if (point[1] > e.clientY) {
      outline.style.top = `${e.clientY}px`;
      outline.style.height = `${point[1] - e.clientY}px`;
    } else {
      outline.style.top = `${point[1]}px`;
      outline.style.height = `${e.clientY - point[1]}px`;
    }
  };

  
  // Cleanup function
  const cleanup = () => {
    overlay.removeEventListener('mousemove', handleMove);
    overlay.removeEventListener('mousedown', handleDown);
    overlay.removeEventListener('mouseup', handleUp);
    document.body.removeChild(outline);
    document.body.removeChild(overlay);
  };
  
  // Add event listeners
  overlay.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  overlay.addEventListener('mousemove', handleMove);
  overlay.addEventListener('mousedown', handleDown);
  overlay.addEventListener('mouseup', handleUp);
  
  // Add overlay to DOM
  document.body.appendChild(outline);
  document.body.appendChild(overlay);
  
  // Return cleanup function in case you want to cancel programmatically
  return cleanup;
}
