function createOverlay() {
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
  
  // Prevent context menu
  overlay.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  
  return overlay;
}


function createOutline(styles = {}) {
  const outline = document.createElement('div');
  const defaultStyles = {
    position: 'fixed',
    zIndex: '8888',
    background: 'transparent',
    border: '4px solid crimson'
  };
  
  const finalStyles = { ...defaultStyles, ...styles };
  outline.style.cssText = Object.entries(finalStyles)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1')
                           .toLowerCase()}: ${value}`)
    .join('; ');
  
  return outline;
}


function setupOverlayMode(config) {
  const { 
    button, 
    events = {}, 
    createElements = () => ([]), 
    onComplete 
  } = config;
  
  const overlay = createOverlay();
  const elements = createElements();
  const allElements = [overlay, ...elements];
  
  // Cleanup function
  const cleanup = () => {
    // Remove all event listeners
    Object.entries(events).forEach(([eventName, handler]) => {
      overlay.removeEventListener(eventName, handler);
    });
    
    // Remove all elements from DOM
    allElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  };
  
  // Add event listeners
  Object.entries(events).forEach(([eventName, handler]) => {
    overlay.addEventListener(eventName, handler);
  });
  
  // Add elements to DOM
  elements.forEach(el => document.body.appendChild(el));
  document.body.appendChild(overlay);
  
  return cleanup;
}


function enterSelectionMode(button, onSelect) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button != button) return;
    
    // Clean up and call callback
    cleanup();
    if (onSelect) {
      onSelect(e.clientX, e.clientY);
    }
  };
  
  const cleanup = setupOverlayMode({
    button,
    events: {
      auxclick: handleClick
    },
    onComplete: onSelect
  });
  
  return cleanup;
}


function enterMoveMode(button, mouseX, mouseY, origX, origY,
                       width, height, onMove) {
  const offsetX = mouseX - origX;
  const offsetY = mouseY - origY;
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button != button) return;
    
    // Clean up and call callback
    cleanup();
    const dx = e.clientX - mouseX;
    const dy = e.clientY - mouseY;

    onMove(origX + dx, origY + dy);
  };

  const handleMove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    outline.style.top = `${e.clientY - offsetY}px`;
    outline.style.left = `${e.clientX - offsetX}px`;
  };
  
  let outline;
  
  const cleanup = setupOverlayMode({
    button,
    events: {
      auxclick: handleClick,
      mousemove: handleMove
    },
    createElements: () => {
      outline = createOutline({
        top: `${origY}px`,
        left: `${origX}px`,
        width: `calc(${width}px - 8px)`,
        height: `calc(${height}px - 8px)`
      });
      return [outline];
    },
    onComplete: onMove
  });
  
  return cleanup;
}


function enterSizeMode(button, onSize) {
  let point = null;
  let outline;
  
  const handleDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button != button) return;

    point = [e.clientX, e.clientY];
    outline.style.top = `${e.clientY}px`;
    outline.style.left = `${e.clientX}px`;
  };

  const handleUp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button != button) return;
    if (!point) return;

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

  const handleMove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!point) return;

    if (point[0] > e.clientX) {
      outline.style.left = `${e.clientX}px`;
      outline.style.width = `${point[0] - e.clientX}px`;
    } else {
      outline.style.left = `${point[0]}px`;
      outline.style.width = `${e.clientX - point[0]}px`;
    }

    if (point[1] > e.clientY) {
      outline.style.top = `${e.clientY}px`;
      outline.style.height = `${point[1] - e.clientY}px`;
    } else {
      outline.style.top = `${point[1]}px`;
      outline.style.height = `${e.clientY - point[1]}px`;
    }
  };
  
  const cleanup = setupOverlayMode({
    button,
    events: {
      mousedown: handleDown,
      mouseup: handleUp,
      mousemove: handleMove
    },
    createElements: () => {
      outline = createOutline({
        top: '-100px',
        left: '-100px',
        width: '0',
        height: '0'
      });
      return [outline];
    },
    onComplete: onSize
  });
  
  return cleanup;
}
