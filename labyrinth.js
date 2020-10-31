// gridHeight X gridWidth
const gridHeight = 10;
const gridWidth = 10;

// Drawy Canva
const canv = document.getElementById('draw');
const context = canv.getContext('2d');
const gridSize = 50;
canv.height = gridSize * gridHeight;
canv.width = gridSize * gridWidth;

let start = {
  x: Math.round(Math.random() * (gridWidth - 1)),
  y: Math.round(Math.random() * (gridWidth - 1)),
};
let end = {
  x: Math.round(Math.random() * (gridHeight - 1)),
  y: Math.round(Math.random() * (gridHeight - 1)),
};

const grid = [];
function initGrid(grid) {
  for (let i = 0; i < gridWidth; i++) {
    grid[i] = [];
    for (let j = 0; j < gridHeight; j++) {
      grid[i][j] = 0;
    }
  }
  grid[start.x][start.y] = 1;
  grid[end.x][end.y] = 1;

  // Background
  context.fillStyle = 'lime';
  context.fillRect(0, 0, canv.width, canv.height);

  // Start
  context.fillStyle = 'red';
  drawRect(start);

  // End
  context.fillStyle = 'blue';
  drawRect(end);
}
initGrid(grid);

// 0 <= i <= 4
// 0 <= j <= 4
console.log({ start, end });

// BFS
const button = document.getElementById('start');
button.addEventListener('click', () => {
  initGrid(grid);
  bfs(start, end).then(async (path) => {
    context.fillStyle = 'black';
    for (const point of path) {
      await new Promise((res, rej) => {
        setTimeout(() => {
          res();
        }, 200);
      });
      drawRect(point);
    }
  });
  console.log(path);
});

async function bfs(start, end) {
  // Previous of each key
  let complete = false;
  const prev = {};
  const queue = [];
  if (!start) {
    return null;
  }
  prev[`${start.x},${start.y}`] = null;
  queue.push(start);
  while (queue.length > 0) {
    const current = queue.shift();
    const adjacents = getAdjacents(current);
    for (const child of adjacents) {
      if (found(child, end)) {
        prev[createId(child)] = current;
        complete = true;
        break;
      }
      if (!hasVisited(child)) {
        context.fillStyle = 'yellow';
        await new Promise((res, rej) => {
          setTimeout(() => {
            res();
          }, 200);
        });
        drawRect(child);
        prev[createId(child)] = current;
        grid[child.x][child.y] = 1;
        queue.push(child);
      }
    }
    if (complete) break;
  }
  const path = [];
  let previous = prev[createId(end)];
  while (previous) {
    path.unshift(previous);
    previous = prev[createId(previous)];
    if (previous === start) {
      break;
    }
  }
  return path;
}

function createId(point) {
  return point.x + ',' + point.y;
}

function hasVisited(point) {
  return grid[point.x][point.y];
}

function found(cand, target) {
  return cand.x === target.x && cand.y === target.y;
}

// x -1 + 1
// y -1 + 1
function getAdjacents(node) {
  const adjacents = [];
  // Bottom
  if (node.y !== gridHeight - 1) {
    adjacents.push({ x: node.x, y: node.y + 1 });
  }
  // Top
  if (node.y !== 0) {
    adjacents.push({ x: node.x, y: node.y - 1 });
  }
  // Left
  if (node.x !== 0) {
    adjacents.push({ y: node.y, x: node.x - 1 });
  }
  // Right
  if (node.x !== gridWidth - 1) {
    adjacents.push({ y: node.y, x: node.x + 1 });
  }
  return adjacents;
}

function drawRect(point) {
  context.fillRect(point.x * gridSize, point.y * gridSize, gridSize, gridSize);
}
