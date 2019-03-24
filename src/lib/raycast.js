/* eslint-disable no-use-before-define */

import View from 'ui/View';
import { debugPoint } from './utils';

// ======================== map

export const level = {
  mapData: [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  map: null,
  tileSize: 16,
};

const horizontalTileCount = level.mapData[0].length;
const verticalTileCount = level.mapData.length;
const tileSize = level.tileSize;

export const getTile = (x, y) => {
  return level.map[y][x] || null;
};

// ======================== map

// Find out if the given pixel is traversable.
// X and Y are the scene pixel coordinates
export const isPointTraversable = (x, y) => {
  // Get the tile coordinates from the pixel coord.
  const tileX = Math.floor(x / tileSize);
  const tileY = Math.floor(y / tileSize);

  // If the point is out of bound, we assume it's traversable
  if (tileX < 0) return true;
  if (tileX >= horizontalTileCount) return true;
  if (tileY < 0) return true;
  if (tileY >= verticalTileCount) return true;

  // Get the tile at tile coords
  const tile = getTile(tileX, tileY);

  // If the tile is blank the point is traversable
  if (tile == null) {
    return true;
  }

  // Get the coordinates of the point within the tile
  const localPointX = Math.floor(x % tileSize);
  const localPointY = Math.floor(y % tileSize);

  const solid = tile.solidityMap[localPointY][localPointX];

  // Return "true" if the pixel is not solid
  return solid === 0; // !tile.solidityMap[localPointX, localPointY];
};

// ======================== Bresenham algorithm

// Returns the list of points from p0 to p1
export const bresenhamLine = (p0, p1) => { // returns List<Point>
  // console.log('bresenhamLine', p0, p1);
  return bresenhamLine2(p0.x, p0.y, p1.x, p1.y);
  // return bresenhamLine3(p0.x, p0.y, p1.x, p1.y);
};


let bresenhamLine3 = (x1, y1, x2, y2) => {
  const result = []; // array of points

  // Iterators, counters required by algorithm
  let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;

  // Calculate line deltas
  dx = x2 - x1;
  dy = y2 - y1;

  // Create a positive copy of deltas (makes iterating easier)
  dx1 = Math.abs(dx);
  dy1 = Math.abs(dy);

  // Calculate error intervals for both axis
  px = 2 * dy1 - dx1;
  py = 2 * dx1 - dy1;

  // The line is X-axis dominant
  if (dy1 <= dx1) {

    // Line is drawn left to right
    if (dx >= 0) {
        x = x1; y = y1; xe = x2;
    } else { // Line is drawn right to left (swap ends)
        x = x2; y = y2; xe = x1;
    }

    // pixel(x, y); // Draw first pixel
    result.push({ x, y });

    // Rasterize the line
    for (i = 0; x < xe; i++) {
      x = x + 1;

      // Deal with octants...
      if (px < 0) {
        px = px + 2 * dy1;
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          y = y + 1;
        } else {
          y = y - 1;
        }
        px = px + 2 * (dy1 - dx1);
      }

      // Draw pixel from line span at currently rasterized position
      // pixel(x, y);
      result.push({ x, y });
    }

  } else { // The line is Y-axis dominant

    // Line is drawn bottom to top
    if (dy >= 0) {
      x = x1; y = y1; ye = y2;
    } else { // Line is drawn top to bottom
      x = x2; y = y2; ye = y1;
    }

    // pixel(x, y); // Draw first pixel
    result.push({ x, y });

    // Rasterize the line
    for (i = 0; y < ye; i++) {
      y = y + 1;

      // Deal with octants...
      if (py <= 0) {
          py = py + 2 * dx1;
      } else {
        if ((dx < 0 && dy<0) || (dx > 0 && dy > 0)) {
          x = x + 1;
        } else {
          x = x - 1;
        }
        py = py + 2 * (dx1 - dy1);
      }

      // Draw pixel from line span at currently rasterized position
      // pixel(x, y);
      result.push({ x, y });
    }
  }

  return result;
};

// Returns the list of points from (x0, y0) to (x1, y1) : List<Point>
export const bresenhamLine2 = (x0, y0, x1, y1)  => {
  const result = []; // array of points

  const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
  if (steep) {
    [x0, y0] = [y0, x0]; // swap values
    [x1, y1] = [y1, x1]; // swap values
  }
  if (x0 > x1) {
    [x0, x1] = [x1, x0]; // swap values
    [y0, y1] = [y1, y0]; // swap values
  }

  const deltax = x1 - x0;
  const deltay = Math.abs(y1 - y0);

  const increment = 1;

  let y = y0;
  let error = 0;
  let ystep;
  if (y0 < y1) {
    ystep = increment;
  } else {
    ystep = -increment;
  }

  for (let x = x0; x <= x1; x += increment) {
    if (steep) {
      result.push({ x: y, y: x });
    } else {
      result.push({ x: x, y: y });
    }

    error += deltay;
    if (2 * error >= deltax) {
      y += ystep;
      error -= deltax;
    }
  }

  return result;
};


// ======================== Raycast algorithm -> returns RayCastingResult

export const normalize = (point, scale = 1) => {
  var norm = Math.sqrt(point.x * point.x + point.y * point.y);
  if (norm != 0) { // as3 return 0,0 for a point of zero length
    point.x = scale * point.x / norm;
    point.y = scale * point.y / norm;
  }

  return point;
};

export const rayCast = (position, direction, rayLength, debugOpts = { debugView: null , duration: 100 }) =>  {
  // const debugView = debug ? debug.debugView : null;

  // set result defaults
  const result = {
    doCollide: false,
    position: null,
    distance: null,
  };

  // Exit the function now if the ray length is 0
  if (rayLength == 0) {
    result.doCollide = isPointTraversable(position.x, position.y);
    result.position = position;
    drawNode(position.x, position.y, 'pink', 4);
    return result;
  }

  // const dir = normalize(direction);
  const dir = normalize(direction, rayLength);
  const pos2 = { x: position.x + dir.x, y: position.y + dir.y };

  // Get the list of points from the Bresenham algorithm -> List<Point>
  const rayLine = bresenhamLine(position, pos2);

  if (rayLine.length > 0) {
    let rayPointIndex = 0;

    // note: this made the ray to function reversed...
    // if (rayLine[0] !== position) {
    //   rayPointIndex = rayLine.length - 1;
    // }

    // Loop through all the points starting from "position"
    const ok = true;
    while (ok) {
      let rayPoint = rayLine[rayPointIndex]; // Point
      if (!isPointTraversable(rayPoint.x, rayPoint.y)) {
        result.position = rayPoint; // Vector.FromPoint(rayPoint);
        result.doCollide = true;
        drawNode(result.position.x, result.position.y, 'cyan', 2, debugOpts);
        break;
      } else {
        drawNode(rayPoint.x, rayPoint.y, 'grey', 1, debugOpts);
      }

      // note: this made the ray function in the right direction
      rayPointIndex++;
      if (rayPointIndex >= rayLine.length) { break; }

      // note: this made the ray to function reversed...
      // if (rayLine[0] != position) {
      //   rayPointIndex--;
      //   if (rayPointIndex < 0) { break; }
      // } else {
      //   rayPointIndex++;
      //   if (rayPointIndex >= rayLine.length) { break; }
      // }
    }
  }

  drawNode(position.x, position.y, 'pink', 2, debugOpts);

  if (!result.doCollide) {
    return null;
  }

  const a = Math.abs(result.position.x - position.x);
  const b = Math.abs(result.position.y - position.y);
  result.distance = Math.hypot(a, b);
  // console.log(result.distance);
  return result;
};


export const drawNode = (x, y, color, size = 1, opts = { debugView: null, duration: 100 }) => {
  const { debugView, duration }  = opts;

  if (!debugView) { return; }

  const point = new View({
    superview: debugView,
    backgroundColor: color,
    x: x - size / 2, y: y - size / 2, width: size, height: size,
    zIndex: 9998,
  });

  setTimeout(() => {
    point.removeFromSuperview();
  }, duration);
};




