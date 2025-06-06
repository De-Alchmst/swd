let renumberDelay = 750;

let tabCounter = 0;         // used as ID
let currentTabIndex = null; // index in the tabs array

function setupTabs() {
  let draggedElement = null;
  let draggedIndex = null;

  const tabsContainer = document.getElementById('tab-container');
  const tabs = tabsContainer.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabCounter = tabs.length;


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

      renumberTabs();
    });
  });
}


// renumber after a delay for visual feedback
async function renumberTabs() {
  await new Promise(resolve => setTimeout(resolve, renumberDelay));

  const tabsContainer = document.getElementById('tab-container');
  const tabs = tabsContainer.querySelectorAll('.tab');

  tabs.forEach((tab, index) => {
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

  tabContentContainer.appendChild(newTabContentElement(tabCounter+1));
  tabsContainer.appendChild(newTabElement(tabCounter+1));
  setupTabs();
}


function newTabElement(id) {
  const tab = document.createElement('div');

  tab.className = 'tab';
  tab.draggable = 'true';
  tab.innerHTML = `${id}`;
  tab.setAttribute('data-tab', `tab-${id}`);

  return tab;
}


function newTabContentElement(id) {
  const content = document.createElement('div');

  content.className = 'tab-content';
  content.id        = `tab-${id}`;
  content.innerHTML = `<h2>Tab ${id} Content</h2><p>This is the content for tab ${id}.</p>`;

  return content;
}


// Add new tab
document.getElementById('tab-adder').addEventListener('click', (e) => {
  e.preventDefault();
  addTab();
});


addTab(); // Initialize with one tab
document.querySelector('.tab').dispatchEvent(new MouseEvent('click'));
