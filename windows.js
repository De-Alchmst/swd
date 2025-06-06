const windows = {};

function spawnWindow(root, name, tag) {
  const win = new WinBox(name, {
    root: root,
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

function killWindow(x, y, tag) {
  const wins = windows[tag];
  if (!wins) return;

  console.log(wins)

  // from highest to lowest
  for (const w of wins.sort((a, b) => b.index-a.index)) {
    if (w.x < x && w.x+w.width > x && w.y < y && w.y+w.height > y) {
      w.close();
      return;
    }
  }
}
