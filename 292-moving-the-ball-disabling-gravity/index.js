const { Engine, Render, Runner, World, Bodies, Body } = Matter;
const cells = 20;
const width = 600;
const height = 600;

const unitLength = width / cells;
const engine = Engine.create();
// changing the gravity
engine.world.gravity.y = 0;
const { world } = engine; // world is a snapshot of the images we have on the screen
const render = Render.create({
  element: document.body, // this will be added to the body
  engine: engine,
  options: {
    showAngleIndicator: false,
    wireframes: true, // it's true by default
    width,
    height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }), // x 400 , y 600, width 800 , height 40
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }), // x 0 , y 300, width 40, height 600
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }) //x 800 , y 300, width 40, height 600
];

World.add(world, walls);

const shuffle = array => {
  let counter = array.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
};

const grid = Array(cells) // rows
  .fill(null)
  .map(() => Array(cells).fill(false)); // columns

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
  // if I have visited the cell at [row, column] return
  if (grid[row][column]) {
    /// same as saying if [row][column] ==="true"
    return;
  }
  // Mark this cell as being visited  update element to true
  grid[row][column] = true;
  // assemble randomly-order list of neighbors
  const neighbors = shuffle([
    [row - 1, column, 'up'],
    [row, column + 1, 'right'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left']
  ]);

  // for each neighbor see if it out of bounds to make sure we don't go where we can't
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
      continue; // if this condition is met , do nothing and move onto the next iteration
    }
    // if we have visited that neighbor , continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }

    // remove wall from  verticals

    if (direction === 'left') {
      verticals[row][column - 1] = true;
    } else if (direction === 'right') {
      verticals[row][column] = true;
    }
    // remove wall from either horizontals
    else if (direction === 'up') {
      horizontals[row - 1][column] = true;
    } else if (direction === 'down') {
      horizontals[row][column] = true;
    }

    stepThroughCell(nextRow, nextColumn); // recursion
  }
  // if we have passed both checks visit that cell and call stepThrough cell again
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      5,
      { isStatic: true }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      5,
      unitLength,
      { isStatic: true }
    );
    World.add(world, wall);
  });
});

//Goal
const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.7,
  unitLength * 0.7,
  { isStatic: true }
);
World.add(world, goal);

//Ball
const ball = Bodies.circle(unitLength / 2, unitLength / 2, (unitLength * 0.7) / 2, {
  isStatic: false
});

World.add(world, ball);

// document.addEventListener('keydown', event => {
//   const { x, y } = ball.velocity;

//   if (event.keyCode === 87) {
//     Body.setVelocity(ball, { x, y: y - 5 });
//   }

//   if (event.keyCode === 68) {
//     Body.setVelocity(ball, { x: x + 5, y });
//   }

//   if (event.keyCode === 83) {
//     Body.setVelocity(ball, { x, y: y + 5 });
//   }

//   if (event.keyCode === 65) {
//     Body.setVelocity(ball, { x: x - 5, y });
//   }
// });

document.addEventListener('keydown', e => {
  console.log(e);
  const { x, y } = ball.velocity;
  console.log(x, y);
  if (e.code === 'KeyW') {
    console.log('move ball up');
    Body.setVelocity(ball, { x, y: y - 5 });
  } else if (e.code === 'KeyD') {
    console.log('move ball right');
    Body.setVelocity(ball, { x: x + 5, y });
  } else if (e.code === 'KeyS') {
    console.log('move ball down');
    Body.setVelocity(ball, { x, y: y + 5 });
  } else if (e.code === 'KeyA') {
    console.log('move ball left');
    Body.setVelocity(ball, { x: x - 5, y });
  }
});
