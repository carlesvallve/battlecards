declare module 'math/geom/Point' {
  export default class Point {
    x: number;
    y: number;

    constructor();
    constructor(pt: { x: number; y: number });
    constructor(x: number, y: number);

    rotate(r: number): this;

    add(pt: { x: number; y: number }): this;
    add(x: number, y: number): this;

    subtract(pt: { x: number; y: number }): this;
    subtract(x: number, y: number): this;

    scale(sx: number, sy?: number): this;

    setMagnitude(m: number): this;

    normalize(): this;
    addMagnitude(m: number): this;

    getMagnitude(): number;
    getSquaredMagnitude(): number;
    getAngle(): number;
    getDirection(): number;

    translate(pt: { x: number; y: number }): this;
    translate(x: number, y: number): this;

    static getPolarTheta(x: number, y: number): number;

    static add(a: { x: number; y: number }, b: { x: number; y: number }): Point;
    static add(a: { x: number; y: number }, x: number, y: number): Point;
    static add(x1: number, y1: number, x2: number, y2: number): Point;

    static translate(
      a: { x: number; y: number },
      b: { x: number; y: number },
    ): Point;
    static translate(a: { x: number; y: number }, x: number, y: number): Point;
    static translate(x1: number, y1: number, x2: number, y2: number): Point;

    static subtract(
      a: { x: number; y: number },
      b: { x: number; y: number },
    ): Point;
    static subtract(a: { x: number; y: number }, x: number, y: number): Point;
    static subtract(x1: number, y1: number, x2: number, y2: number): Point;

    static scale(a: { x: number; y: number }, scale: number): Point;
    static scale(x: number, y: number, scale: number): Point;

    static setMagnitude(a: { x: number; y: number }, m: number): Point;
    static setMagnitude(x: number, y: number, m: number): Point;

    static addMagnitude(a: { x: number; y: number }, m: number): Point;
    static addMagnitude(x: number, y: number, m: number): Point;

    static getMagnitude(): number;
    static getMagnitude(pt: { x: number; y: number }): number;
    static getMagnitude(x: number, y: number): number;

    static scale(a: { x: number; y: number }, r: number): Point;
    static scale(x: number, y: number, r: number): Point;

    static project(
      a: { x: number; y: number },
      b: { x: number; y: number },
    ): Point;
  }
}

declare module 'math/geom/Line' {
  import Point from 'math/geom/Point';

  export default class Line {
    start: Point;
    end: Point;

    constructor();
    constructor(a: {
      start: { x: number; y: number };
      end: { x: number; y: number };
    });
    constructor(start: { x: number; y: number }, end: { x: number; y: number });
    constructor(start: { x: number; y: number }, x: number, y: number);
    constructor(x1: number, y1: number, x2: number, y2: number);

    getLength(): number;
    getMagnitude(): number;
  }
}

declare module 'math/geom/Rect' {
  import Point from 'math/geom/Point';
  import Line from 'math/geom/Line';

  export const enum Sides {
    TOP = 1,
    BOTTOM = 2,
    LEFT = 3,
    RIGHT = 4,
  }
  export const enum Corners {
    TOP_LEFT = 1,
    TOP_RIGHT = 2,
    BOTTOM_RIGHT = 3,
    BOTTOM_LEFT = 4,
  }

  export default class Rect {
    x: number;
    y: number;
    width: number;
    height: number;

    static SIDES: {
      TOP: 1;
      BOTTOM: 2;
      LEFT: 3;
      RIGHT: 4;
      '1': 'TOP';
      '2': 'BOTTOM';
      '3': 'LEFT';
      '4': 'RIGHT';
    };
    static CORNERS: {
      TOP_LEFT: 1;
      TOP_RIGHT: 2;
      BOTTOM_RIGHT: 3;
      BOTTOM_LEFT: 4;
      '1': 'TOP_LEFT';
      '2': 'TOP_RIGHT';
      '3': 'BOTTOM_RIGHT';
      '4': 'BOTTOM_LEFT';
    };

    constructor();
    constructor(rect: { x: number; y: number; width: number; height: number });
    constructor(
      origin: { x: number; y: number },
      size: { x: number; y: number },
    );
    constructor(
      origin: { x: number; y: number },
      width: number,
      height: number,
    );
    constructor(x: number, y: number, width: number, height: number);

    normalize(): this;

    intersectRect(rect: {
      x: number;
      y: number;
      width: number;
      height: number;
    }): void;

    unionRect(rect: {
      x: number;
      y: number;
      width: number;
      height: number;
      normalize?: () => void;
    });
    getCorner(i: Corner): Point;

    getSide(i: Side): Line;

    getCenter(): Point;
  }
}
