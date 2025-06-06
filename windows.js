const windows = {};

function spawnWindow(root, name, tag) {
  const win = new WinBox(name, {
    root: root,
    class: ["no-animation"],
    border: 4,
    header: 25,

    onclose: function(force) {
      // remove from windows
      const id = this.id;
      console.log()
      windows[tag] = windows[tag].filter((w) => w.id != this.id);
    },
  })

  if (!windows[tag]) windows[tag] = [];

  windows[tag].push(win);

  console.log(windows[tag])
}


function pointInWindow(x, y, w) {
  return (w.x < x && w.x+w.width > x && w.y < y && w.y+w.height > y);
}


function applyWindowPos(x, y, tag, f) {
  const wins = windows[tag];
  if (!wins) return;

  // from highest index to lowest
  for (const w of wins.sort((a, b) => b.index-a.index)) {
    if (pointInWindow(x, y, w)) {
      f(w)
      return;
    }
  }
}


function killWindow(x, y, tag) {
  applyWindowPos(x, y, tag, (w) => {
    w.close();
  })
}


function minimizeWindow(x, y, tag) {
  applyWindowPos(x, y, tag, (w) => {
    w.minimize(!w.min);
  })
}


function maximizeWindow(x, y, tag) {
  applyWindowPos(x, y, tag, (w) => {
    w.maximize(!w.max);
  })
}


function fullscreenWindow(x, y, tag) {
  applyWindowPos(x, y, tag, (w) => {
    w.fullscreen(!w.full);
  })
}


function moveWindow(x, y, tag) {
  applyWindowPos(x, y, tag, (w) => {
    enterMoveMode(2, x, y, w)
  });
}
