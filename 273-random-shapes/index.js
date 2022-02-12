const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;
const width = 800;
const height = 600;
const engine = Engine.create();
const { world } = engine; // world is a snapshot of the images we have on the screen
const render = Render.create({
  element: document.body, // this will be added to the body
  engine: engine,
  options: {
    showAngleIndicator: true,
    wireframes: false,  // it's true by default
    width,
    height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
  })
);
// const rectangle = Bodies.rectangle(200, 200, 50, 50, {
//   isStatic: true
// });

// World.add(world, rectangle);

// Walls
const walls = [
  Bodies.rectangle(400, 0, 800, 40, {
    // x 400, y 0 , width 800 , height 40
    isStatic: true
  }),
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true}), // x 400 , y 600, width 800 , height 40
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }), // x 0 , y 300, width 40, height 600
  Bodies.rectangle(800, 300, 40, 600, { isStatic: true }) //x 800 , y 300, width 40, height 600
];

World.add(world, walls);
World.add(world, Bodies.rectangle(200, 200, 50, 50, { isStatic: true }));

// random shapes
for (let i = 0; i < 45; i++) {
  if (Math.random() > 0.5) {
    World.add(
      world,
      Bodies.rectangle(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 100,
        Math.random() * 100
      )
    );
  } else {
    World.add(
      world,
      Bodies.circle(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 45 // x, y, radius
        ,{
          render: {
            fillStyle: 'magenta'
          }
        }
      )
    );
  }
}
