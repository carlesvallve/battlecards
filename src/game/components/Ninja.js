import animate from 'animate';
import View from 'ui/View';
import SpriteView from 'ui/SpriteView';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';
import { Actions } from 'src/lib/enums.js';
import sounds from 'src/lib/sounds';


export default class Ninja extends View {
  constructor (opts) {
    super(opts);
    this.screen = getScreenDimensions();
    this.scale = opts.scale;
    this.game = opts.parent.game;

    this.createSprite();

    this.on('ninja:start', this.init.bind(this));
    this.on('ninja:idle', this.idle.bind(this));
    this.on('ninja:run', this.run.bind(this));
    this.on('ninja:jump', this.jump.bind(this));
    this.on('ninja:attack', this.attack.bind(this));
    this.on('ninja:die', this.die.bind(this));
    this.on('ninja:moveTo', this.moveTo.bind(this));
    this.on('ninja:jumpTo', this.jumpTo.bind(this));
  }


  createSprite () {
    this.sprite = new SpriteView({
      parent: this,
      width: 16,
      height: 16,
      url: 'resources/images/8bit-ninja/ninja',
      defaultAnimation: 'idle',
      frameRate: 5,
      delay: 0,
      autoStart: true,
      loop: true,
      scale: 1.0,
    });

    this.sprite.style.offsetX = -8;
    this.sprite.style.offsetY = -16;

    debugPoint(this);
  }

  init () {
    this.action = Actions.Idle;
    this.respawning = false;
    this.dir = 1;
    this.speed = 0.1;
    this.color = 'black';
    this.style.x = this.game.world.center;
    this.style.y = this.screen.height / 2;

    this.game.world.init(this);

    animate(this).clear();

    this.setDirection(this.dir);
    this.idle();
    this.show();

    // this.respawn();
  }

  setDirection (dir) {
    this.dir = dir;
    this.style.flipX = dir === -1;
  }

  idle () {
    if (this.action === Actions.Idle) { return; }
    this.action = Actions.Idle;
    this.sprite.setFramerate(6);
    this.sprite.startAnimation('idle', { loop: true });
    animate(this).clear();
  }

  run () {
    if (this.action === Actions.Die) { return; }
    if (this.action === Actions.Run) { return; }
    this.action = Actions.Run;
    this.sprite.setFramerate(10);
    this.sprite.startAnimation('run', { loop: true });
    this.setDirection(1);
  }

  jump () {
    if (this.action === Actions.Die) { return; }
    if (this.action === Actions.Jump) { return; }
    this.action = Actions.Jump;
    this.setDirection(1);
    this.sprite.setFramerate(12);
    this.sprite.startAnimation('roll', {
      loop: false,
      callback: () => {
        this.idle();
      }
    });
  }

  attack ({ target }) {
    if (this.action === Actions.Die || target.action === Actions.Attack) { return; }

    animate(this).clear();

    this.action = Actions.Attack;
    this.sprite.setFramerate(12);
    this.sprite.startAnimation('attack', {
      loop: false,
      callback: () => {
        this.idle();
      }
    });

    // play attack sfx
    animate(this)
      .clear()
      .wait(0).then(() => { sounds.playSound('swap'); })
      .wait(150).then(() => { sounds.playSound('fall', 1); })
      .wait(100).then(() => {
        // sounds.playSound('combo_x' + getRandomInt(2, 6), 0.25);
      });
  }

  die () {
    if (this.action === Actions.Die || this.respawning) { return; }
    this.idle();
    this.action = Actions.Die;

    this.game.hud.emit('hud:removeHeart');

    // sounds.playSound('explode');
    // this.game.emit('game:explosion', { slime: this });
    // this.hide();

    // wait and die
    const anim = animate(this)
    .clear()
    .wait(100).then(() => {
      sounds.playSound('explode');
      this.game.emit('game:explosion', { slime: this });
      this.hide();
    })
    .wait(500).then(() => {
      // if no more hearts, gameover!
      if (this.game.hud.hearts.length === 0) {
        anim.clear();
        this.game.emit('game:gameover');
      }
    })
    .wait(500).then(() => {
      // respawn ninja if we have hearts left
      this.respawn();
    });
  }

  respawn () {
    sounds.playSound('destroy');
    this.respawning = true;
    this.style.opacity = 0.6;
    this.show();
    this.idle();

    animate({})
      .wait(1300)
      .then(() => {
        // end of respawning phase
        this.respawning = false;
        this.style.opacity = 1;
        // this.idle();
      });
    }

  moveTo ({ x, y }) {
    if (this.action === Actions.Attack) { return; }
    if (this.action === Actions.Die && !this.style.visible) { return; }
    this.setDirection(x >= this.style.x ? 1 : -1);

    if (x < this.game.world.left) {
      x = this.game.world.left;
    }

    if (x > this.game.world.right) {
      x = this.game.world.right;
    }

    const speed = 10; // bigger is slower
    const d = Math.abs(x - this.style.x);
    const duration = d * speed;

    this.action = Actions.Run;
    this.sprite.setFramerate(12);
    this.sprite.startAnimation('run', { loop: true });

    animate(this).clear()
    .now({ x: this.style.x }, 0, animate.linear)
    .then({ x: x }, duration, animate.linear)
    .then(() => {
      this.idle();
    });
  }

  jumpTo ({ x, y }) {
    if (this.action === Actions.Die) { return; }
    const d = Math.abs(x - this.style.x);
    const duration = d * 8;

    this.action = Actions.Jump;
    this.sprite.setFramerate(12);
    this.sprite.startAnimation('roll', { loop: true });
    this.setDirection(x >= this.style.x ? 1 : -1);

    this.targetX = x;

    animate(this).clear()
    .now({ x: this.style.x }, 0, animate.linear)
    .then({ x: x }, duration, animate.linear)
    .then(() => {
      this.idle();
    });
  }
}