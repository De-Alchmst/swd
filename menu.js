/*
example input data structure:
[
  {
    "name": itm1,
    "action": lambda,
  }, 
  {
    "name": itm2,
    "action": lambda,
  }, 
]
*/


function addMouseListeners(elem, button, contents) {
  let isMenuActive = false;
  let menu = null;
  let highlightedItem = null;

  elem.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if (isMenuActive) return;

    if (e.button === button) {
      isMenuActive = true;
      menu = createMenu(contents);
      elem.appendChild(menu);
      showMenu(menu, e.clientX, e.clientY);
    }
  });

  elem.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if (!isMenuActive) return;

    const underMouse = document.elementFromPoint(e.clientX, e.clientY);
    highlightedItem = highlightItem(underMouse);
  });

  elem.addEventListener('mouseup', (e) => {
    e.preventDefault();
    if (!isMenuActive) return;

    if (e.button === button) {
      isMenuActive = false;

      if (highlightedItem) {
        highlightedItem.action();
      }

      menu.remove();
      menu = null;
    }
  });

  elem.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}


function createMenu(contents) {
  const menu = document.createElement('div');
  menu.className = 'desktop-menu';

  contents.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'desktop-menu-item';
    menuItem.textContent = item.name;
    menuItem['action'] = item.action;

    menu.appendChild(menuItem);
  });

  return menu;
}


// Clear all highlights
function clearHighlight() {
  document.querySelectorAll('.desktop-menu-item').forEach(item => {
    item.classList.remove('highlighted');
  });
}


// Highlight menu item
function highlightItem(elem) {
  clearHighlight();
  if (elem && elem.classList.contains('desktop-menu-item')) {
    elem.classList.add('highlighted');
    return elem;
  }
  return null;
}


function showMenu(menu, x, y) {
  // Initially position off-screen to measure dimensions
  menu.style.left = '-9999px';
  menu.style.top = '-9999px';
  
  // Get menu dimensions
  const rect = menu.getBoundingClientRect();
  const menuWidth = rect.width;
  const menuHeight = rect.height;
  
  // Position so mouse is in the middle of the top edge
  let finalX = x - (menuWidth / 2);
  let finalY = y;
  
  // Adjust position if menu goes outside viewport
  if (finalX < 0) {
      finalX = 0;
  } else if (finalX + menuWidth > window.innerWidth) {
      finalX = window.innerWidth - menuWidth;
  }
  
  if (finalY + menuHeight > window.innerHeight) {
      finalY = y - menuHeight;
  }
  
  // Apply final position
  menu.style.left = finalX + 'px';
  menu.style.top = finalY + 'px';
}
