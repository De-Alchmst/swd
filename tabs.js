function initTabs() {
  let draggedElement = null;
  let draggedIndex = null;

  const tabsContainer = document.getElementById('tabs-container');
  const tabs = tabsContainer.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const tabAdder = document.getElementById('tab-adder');

  let tabCounter = tabs.length;


  // Add event listeners to each tab
  tabs.forEach((tab, index) => {
    // Click to switch tabs
    tab.addEventListener('click', (e) => {
      if (!tab.classList.contains('dragging')) {
        switchTab(tab.dataset.tab);
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

      if (tab !== draggedElement) {
        const targetIndex = Array.from(tabsContainer.children).indexOf(tab);

        // Reorder the tabs
        if (draggedIndex < targetIndex) {
          tabsContainer.insertBefore(draggedElement, tab.nextSibling);
        } else {
          tabsContainer.insertBefore(draggedElement, tab);
        }
      }
    });
  });


  // Add new tab
  tabAdder.addEventListener('click', (e) => {
    e.preventDefault();

    tabCounter++;
    tabsContainer.appendChild(newTabElement(tabCounter));
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


function newTabElement(id) {
  const tab = document.createElement('div');

  tab.className   = 'tab';
  tab.draggable   = 'true';
  tab['tab-data'] = `${id}`;
  tab.innerHTML   = `${id}`;

  return tab;
}


initTabs();
