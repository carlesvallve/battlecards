import Matter from 'src/lib/matter.js';

// import gameConfig from 'src/conf/gameConfig';

const Bodies = Matter.Bodies;
const Body = Matter.Body;
const World = Matter.World;
const Engine = Matter.Engine;

const CONTAINER_WIDTH = 400; //gameConfig.simulation.width;
const CONTAINER_HEIGHT = 600; // gameConfig.simulation.height;

const FAN_POSITION = { x: CONTAINER_WIDTH / 2, y: CONTAINER_HEIGHT };
const FAN_FORCE = { x: 0, y: -0.13 };

const FRICTION = 0.15;
const STATIC_FRICTION = 3.3;
const GRAVITY = 2.5;

export default class MatterSimulation {
  constructor () {
    this.engine = Engine.create();
    this.world = this.engine.world;

    this.gravity = GRAVITY;
    this.world.gravity.y = GRAVITY;
    this.engine.positionIterations = 12; // Very small impact on performance, default is 6
    this.engine.velocityIterations = 6; // Moderate impact on performance, default is 4
    // this.engine.enableSleeping = true; // Sleeping seems to affect performance negatively due to the nature of the game

    // Creation of the container
    var wallThickness = 70;
    var offsetX = CONTAINER_WIDTH / 10;
    var offsetY = 850 - CONTAINER_HEIGHT;
    var spacing = CONTAINER_WIDTH / 5;
    var bottomWallsLength = 200;
    World.add(this.world, [
        // top wall
        Bodies.rectangle(CONTAINER_WIDTH / 2, wallThickness / 2 + offsetY, CONTAINER_WIDTH, wallThickness, { isStatic: true, friction: FRICTION, frictionStatic: STATIC_FRICTION }),
        // left wall
        Bodies.rectangle(0 - wallThickness / 2, CONTAINER_HEIGHT / 2 + offsetY, wallThickness, 4 * CONTAINER_HEIGHT, { isStatic: true, friction: FRICTION, frictionStatic: STATIC_FRICTION }),
        // right wall
        Bodies.rectangle(CONTAINER_WIDTH + wallThickness / 2, CONTAINER_HEIGHT / 2 + offsetY, wallThickness, 4 * CONTAINER_HEIGHT, { isStatic: true, friction: FRICTION, frictionStatic: STATIC_FRICTION }),
        // bottom
        Bodies.rectangle(offsetX + spacing * 0, CONTAINER_HEIGHT + offsetY - 30, bottomWallsLength, wallThickness, { isStatic: true, friction: FRICTION, frictionStatic: STATIC_FRICTION, angle: Math.PI * 0.10 }),
        Bodies.rectangle(offsetX + spacing * 1, CONTAINER_HEIGHT + offsetY - 10, bottomWallsLength, wallThickness, { isStatic: true, friction: FRICTION, frictionStatic: STATIC_FRICTION, angle: Math.PI * 0.05 }),
        Bodies.rectangle(offsetX + spacing * 2, CONTAINER_HEIGHT + offsetY,      bottomWallsLength, wallThickness, { isStatic: true, friction: FRICTION, frictionStatic: STATIC_FRICTION, angle: 0 }),
        Bodies.rectangle(offsetX + spacing * 3, CONTAINER_HEIGHT + offsetY - 10, bottomWallsLength, wallThickness, { isStatic: true, friction: FRICTION, frictionStatic: STATIC_FRICTION, angle: -Math.PI * 0.05 }),
        Bodies.rectangle(offsetX + spacing * 4, CONTAINER_HEIGHT + offsetY - 30, bottomWallsLength, wallThickness, { isStatic: true, friction: FRICTION, frictionStatic: STATIC_FRICTION, angle: -Math.PI * 0.10 })
    ]);

    this.bodies = [];
  }

  createBody (radius, sides) {
    var body = Bodies.polygon(0, 0, sides, radius);
    body.friction = FRICTION;
    body.restitution = 0.2;
    body.frictionAir = 0.01;
    body.frictionStatic = STATIC_FRICTION;

    // var body = Bodies.circle(0, 0, radius);
    World.add(this.world, body);
    this.bodies.push(body);
    return body;
  }

  removeBody (body) {
    var idx = this.bodies.indexOf(body);
    if (idx !== -1) {
      this.bodies.splice(idx, 1);
      World.remove(this.world, body);
    }
  }

  setBodyScale (body, scale) {
    Body.scale(body, scale, scale);
  }

  resetBody (body, position) {
    Body.setPosition(body, {
      x: position.x,
      y: position.y
    });

    Body.setAngle(body, position.r);
  }

  useFan () {
    for (var b = 0; b < this.bodies.length; b += 1) {
      Body.applyForce(this.bodies[b], FAN_POSITION, FAN_FORCE);
    }
  }

  update (dt) {
    Engine.update(this.engine, dt);
  }
}
