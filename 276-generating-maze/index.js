const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;
const engine = Engine.create();
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
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }), // x 400 , y 600, width 800 , height 40
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }), // x 0 , y 300, width 40, height 600
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }) //x 800 , y 300, width 40, height 600
];

World.add(world, walls);

// let grid = Array(3).fill(null);

// grid.map(item => {
//   grid = Array(3).fill(false);
// });

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

const stepThroughCell = (row, column)=>{
// if I have visited the cell at [row, column] return

// Mark this cell as being visited  update element to true

// assemble randomly-order list of neighbors

// for each neighbor see if it out of bounds to make sure we don't go where we can't

// if we have visited that neighbor , continue to next neighbor

// remove wall 

// if we have passed both checks visit that cell and call stepThrough cell again

}

stepThroughCell(startRow, startColumn)

console.log(grid);
console.log(verticals);
console.log(horizontals);
console.log(startRow, startColumn)