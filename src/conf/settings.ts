export default {
  worldScale: 1.75,
  currentMapLevel: 1,

  slime: {
    turnOnScreenLimit: true,
    maxDistanceFromPlayer: 300,
    spawnDistance: { min: 60, max: 120 },
    spawnInterval: { min: 1000, max: 2000 },
    scorePoints: { min: 10, max: 20 },
    starProbability: { min: 30, max: 50 },
  },

  bat: {
    turnOnScreenLimit: true,
    maxDistanceFromPlayer: 300,
    spawnDistance: { min: 60, max: 120 },
    spawnInterval: { min: 1000, max: 2000 },
    scorePoints: { min: 10, max: 20 },
    starProbability: { min: 30, max: 50 },
  },

  player: {
    autoAttack: true,
    doubleJump: true,
  },

  user: {
    maxHearts: 1,
  },
};
