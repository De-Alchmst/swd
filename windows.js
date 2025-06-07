const windows = {};

function spawnWindow(x, y, width, height, name, root, tag) {
  const win = new WinBox(name, {
    root: root,
    class: ["no-animation"],
    border: 4,
    header: 25,
    x: x,
    y: y,
    width: width,
    height: height,
    
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
  return win;
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
    enterMoveMode(2, x, y, w);
  });
}


function resizeWindow(x, y, tag) {
  applyWindowPos(x, y, tag, (w) => {
    enterSizeMode(2, (nx, ny, nw, nh) => {
      w.move(nx, ny);
      w.resize(nw, nh);
    });
  });
}


function newWindow(root, name, tag) {
  enterSizeMode(2, (x, y, w, h) => {
    spawnWindow(x, y, w, h, name, root, tag);
  });
}
