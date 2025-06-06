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
  overlay.addEventListener('auxclick', handleClick);
  overlay.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  
  // Add overlay to DOM
  document.body.appendChild(overlay);
  
  // Return cleanup function in case you want to cancel programmatically
  return cleanup;
}
