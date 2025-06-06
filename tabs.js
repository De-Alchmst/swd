let renumberDelay = 750;

let tabId = 0;
let tabCounter = 0;
let currentTabIndex = null; // index in the tabs array

function setupTabs() {
  let draggedElement = null;
  let draggedIndex = null;

  const tabsContainer = document.getElementById('tab-container');
  const tabs = tabsContainer.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');


  // Add event listeners to each tab
  // JS is not happy with each tab being configured seperately
  // so I have to rewrite them all every time
  tabs.forEach((tab, index) => {

    // removes previous event listeners
    const newTab = tab.cloneNode(true);
    tabsContainer.replaceChild(newTab, tab);
    tab = newTab;

    // Click to switch tabs
    tab.addEventListener('click', (e) => {
      if (!tab.classList.contains('dragging')) {
        switchTab(tab.getAttribute('data-tab'));
        currentTabIndex = index;
        console.log(index)
      }
    });

    // other mouse buttons
    tab.addEventListener('auxclick', (e) => {
      switch (e.button) {
        case 1: // Middle click -> close tab
          removeTab(index);
          break;
      }
    });

    // Drag start
    tab.addEventListener('dragstart', (e) => {
      draggedElement = tab;
      draggedIndex = Array.from(tabsContainer.children).indexOf(tab);
      tab.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    // Drag end
    tab.addEventListener('dragend', (e) => {
      tab.classList.remove('dragging');
      // Remove drag-over class from all tabs
      tabs.forEach(t => t.classList.remove('drag-over'));
      draggedElement = null;
      draggedIndex = null;
    });

    // Drag over
    tab.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    // Drag enter
    tab.addEventListener('dragenter', (e) => {
      e.preventDefault();
      if (tab !== draggedElement) {
        tab.classList.add('drag-over');
      }
    });

    // Drag leave
    tab.addEventListener('dragleave', (e) => {
      tab.classList.remove('drag-over');
    });

    // Drop
    tab.addEventListener('drop', (e) => {
      e.preventDefault();
      tab.classList.remove('drag-over');

      if (tab !== draggedElement && draggedElement) {
        const targetIndex = Array.from(tabsContainer.children).indexOf(tab);

        // Reorder the tabs
        if (draggedIndex < targetIndex) {
          tabsContainer.insertBefore(draggedElement, tab.nextSibling);
        } else {
          tabsContainer.insertBefore(draggedElement, tab);
        }
      }

      renumberTabs(renumberDelay);
    });
  });
}


// renumber after a delay for visual feedback
async function renumberTabs(delay) {
  await new Promise(resolve => setTimeout(resolve, delay));

  const tabsContainer = document.getElementById('tab-container');
  const tabs = tabsContainer.querySelectorAll('.tab');

  tabs.forEach((tab, index) => {
    if (tab.classList.contains('active')) {
      currentTabIndex = index;
    }
    tab.innerHTML = `${index + 1}`;
  })
}


// Function to switch active tab
function switchTab(tabName) {
  // Remove active class from all tabs and contents
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  // Add active class to selected tab and content
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(tabName).classList.add('active');
}


function addTab() {
  const tabsContainer = document.getElementById('tab-container');
  const tabContentContainer = document.getElementById('tab-content-container');

  tabId++;
  tabCounter++;
  tabContentContainer.appendChild(newTabContentElement(tabId));
  tabsContainer.appendChild(newTabElement(tabId));
  setupTabs();
}


function newTabElement(id) {
  const tab = document.createElement('div');

  tab.className = 'tab';
  tab.draggable = 'true';
  tab.innerHTML = `${tabCounter}`;
  tab.setAttribute('data-tab', `tab-${id}`);

  return tab;
}


function newTabContentElement(id) {
  const content = document.createElement('div');
  const bg = document.createElement('div');

  content.className = 'tab-content';
  content.id        = `tab-${id}`;
  content.appendChild(bg); 

  bg.className = 'desktop-background';
  bg.addEventListener('click', (e) => {
    spawnWindow(
      content,
      `Tab ${id}`
    );
  });

  return content;
}


function scrollUp() {
  const tabsContainer = document.getElementById('tab-container');

  if (currentTabIndex === null) return;

  if (currentTabIndex > 0) {
    currentTabIndex--;
  } else {
    // -1 for the add button
    currentTabIndex = tabsContainer.children.length - 2;
  }

  console.log(currentTabIndex)

  switchTab(
    tabsContainer.children[currentTabIndex + 1].getAttribute('data-tab'));
}


function scrollDown() {
  const tabsContainer = document.getElementById('tab-container');

  if (currentTabIndex === null) return;

  if (currentTabIndex < tabsContainer.children.length - 2) {
    currentTabIndex++;
  } else {
    currentTabIndex = 0;
  }

  switchTab(curTabData());
}


function curTabData() {
  const tabsContainer = document.getElementById('tab-container');
  console.log(tabsContainer.children[currentTabIndex+1].getAttribute('data-tab'), 
    currentTabIndex)
  return tabsContainer.children[currentTabIndex+1].getAttribute('data-tab')
}


function removeTab(index) {
  const tabsContainer = document.getElementById('tab-container');
  const tabContents = document.querySelectorAll('.tab-content');

  // also contains the add button
  if (tabsContainer.children.length <= 2) return;

  tabCounter--;

  // again, contains the add button
  const tabToRemove = tabsContainer.children[index+1];
  const contextToRemove = document.getElementById(
    tabToRemove.getAttribute('data-tab'));

  if (tabToRemove) {
    tabsContainer.removeChild(tabToRemove);
    tabToRemove.remove();
    setupTabs();
    renumberTabs(0);
  }

  // Switch to the first tab if the removed tab was active
  if (currentTabIndex == index) {
    switchTab(tabsContainer.children[1].getAttribute('data-tab'));
  }
}


// Add new tab
document.getElementById('tab-adder').addEventListener('click', (e) => {
  e.preventDefault();
  addTab();
});


document.getElementById('tab-content-container')
  .addEventListener('wheel', (e) => {
    if (e.deltaY < 0) {
      scrollUp();
    } else {
      scrollDown();
    }
  }
);


addTab(); // Initialize with one tab
document.querySelector('.tab').dispatchEvent(new MouseEvent('click'));
