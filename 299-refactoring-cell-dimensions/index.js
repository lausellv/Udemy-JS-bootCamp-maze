const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
const cellsHorizontal = 3;
const cellsVertical = 3;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
// changing the gravity
engine.world.gravity.y = 0;
const { world } = engine; // world is a snapshot of the images we have on the screen
const render = Render.create({
  element: document.body, // this will be added to the body
  engine: engine,
  options: {
    showAngleIndicator: false,
    wireframes: false, // it's true by default
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

const grid = Array(cellsVertical) // rows
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false)); // columns

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
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
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      { label: 'wall', isStatic: true, render: { fillStyle: 'green' } }
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
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      { label: 'wall', isStatic: true, render: { fillStyle: 'red' } }
    );
    World.add(world, wall);
  });
});

//Goal
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  { isStatic: true, label: 'goal', render: { fillStyle: 'blue' } }
);
World.add(world, goal);

//Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 3;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  isStatic: false,
  label: 'ball',
  render: { fillStyle: 'magenta' }
});

World.add(world, ball);

document.addEventListener('keydown', e => {
  const { x, y } = ball.velocity;

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

// win condition
Events.on(engine, 'collisionStart', e => {
  e.pairs.forEach(collision => {
    const labels = ['ball', 'goal'];
    if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
      document.querySelector('.winner').classList.remove('hidden');
      world.gravity.y = 1;
      world.bodies.forEach(body => {
        if (body.label === 'wall') {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
