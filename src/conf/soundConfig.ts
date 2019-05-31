export default {
  sfxPath: 'resources/sounds/sfx',
  musicPath: 'resources/sounds/music',

  music: {
    pirateSea: {
      volume: 0.0,
      background: true,
      loop: true,
      sources: ['pirateSea.mp3'],
    },
    dubesque: {
      volume: 0.0,
      background: true,
      loop: true,
      sources: ['dubesque.mp3'],
    },
    win: { volume: 0.5, background: true, loop: false, sources: ['win.mp3'] },
    loose: {
      volume: 0.5,
      background: true,
      loop: false,
      sources: ['loose.mp3'],
    },
  },

  sfx: {
    swap: { volume: 1, background: false, sources: ['swap.mp3'] },
    fall: { volume: 1, background: false, sources: ['fall.mp3'] },
    combo_x2: { volume: 1, background: false, sources: ['combo_x2.mp3'] },
    combo_x3: { volume: 1, background: false, sources: ['combo_x3.mp3'] },
    combo_x4: { volume: 1, background: false, sources: ['combo_x4.mp3'] },
    combo_x5: { volume: 1, background: false, sources: ['combo_x5.mp3'] },
    combo_x6: { volume: 1, background: false, sources: ['combo_x6.mp3'] },
    explode: { volume: 1, background: false, sources: ['explode.mp3'] },
    destroy: { volume: 1, background: false, sources: ['destroy.mp3'] },
    warning: { volume: 1, background: false, sources: ['warning.mp3'] },
  },
};
