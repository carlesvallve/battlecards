export default {
  worldScale: 1.75,
  currentMapLevel: 1,

  slime: {
    maxSpawned: 6,
    turnOnScreenLimit: true,
    maxDistanceFromPlayer: 300,
    spawnDistance: { min: { x: 60, y: 0 }, max: { x: 120, y: 100 } },
    spawnInterval: { min: 1000, max: 2000 },
    scorePoints: { min: 10, max: 20 },
    starProbability: { min: 30, max: 50 },
  },

  bat: {
    maxSpawned: 3,
    turnOnScreenLimit: true,
    maxDistanceFromPlayer: 300,
    spawnDistance: { min: { x: 60, y: 0 }, max: { x: 120, y: 200 } },
    spawnInterval: { min: 1000, max: 2000 },
    flyInterval: { min: 500, max: 1000 },
    scorePoints: { min: 10, max: 20 },
    starProbability: { min: 30, max: 50 },
  },

  player: {
    autoAttack: true,
    doubleJump: true,
  },

  user: {
    maxHearts: 3,
  },
};
