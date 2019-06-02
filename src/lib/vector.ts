/*
 * @class Vector
 * @constructor
 * @param x {Number} position of the point
 * @param y {Number} position of the point
 */
export default class Vector {
  x: number;
  y: number;

  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  invert() {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  multiplyScalar(s: number) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  divideScalar(s: number) {
    if (s === 0) {
      this.x = 0;
      this.y = 0;
    } else {
      var invScalar = 1 / s;
      this.x *= invScalar;
      this.y *= invScalar;
    }
    return this;
  }

  dot(v: Vector) {
    return this.x * v.x + this.y * v.y;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  normalize() {
    return this.divideScalar(this.length());
  }

  distanceTo(v: Vector) {
    return Math.sqrt(this.distanceToSq(v));
  }

  distanceToSq(v: Vector) {
    var dx = this.x - v.x,
      dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  setX(x: number) {
    this.x = x;
    return this;
  }

  setY(y: number) {
    this.y = y;
    return this;
  }

  setLength(l: number) {
    var oldLength = this.length();
    if (oldLength !== 0 && l !== oldLength) {
      this.multiplyScalar(l / oldLength);
    }
    return this;
  }

  lerp(v: Vector, alpha: number) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    return this;
  }

  rad() {
    //return Math.atan2(this.x, this.y);
    return Math.atan2(this.y, this.x);
  }

  deg() {
    return (this.rad() * 180) / Math.PI;
  }

  equals(v: Vector) {
    return this.x === v.x && this.y === v.y;
  }

  rotate(theta: number) {
    var xtemp = this.x;
    this.x = this.x * Math.cos(theta) - this.y * Math.sin(theta);
    this.y = xtemp * Math.sin(theta) + this.y * Math.cos(theta);
    return this;
  }

  limit(maxLength: number) {
    const lengthSquared = this.lengthSq(); // this.x*x + y*y;
    if (lengthSquared > maxLength * maxLength && lengthSquared > 0) {
      const ratio = maxLength / Math.sqrt(lengthSquared);
      this.x *= ratio;
      this.y *= ratio;
    }
    return this;
  }
}
