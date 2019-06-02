/* eslint-disable no-use-before-define */

import View from 'ui/View';
import { mapWidth, mapHeight, tileSize, getTile } from 'src/conf/levels/index';
import { point, debugLine } from './types';

// ======================== global point to tile point

// Find out if the given pixel is traversable.
// X and Y are the scene pixel coordinates
export const isPointTraversable = (x: number, y: number, offset: point) => {
  x -= offset.x;
  y -= offset.y;

  // Get the tile coordinates from the pixel coord.
  const tileX = Math.floor(x / tileSize);
  const tileY = Math.floor(y / tileSize);

  // If the point is out of bound, we assume it's traversable
  if (tileX < 0) return true;
  if (tileX >= mapWidth) return true;
  if (tileY < 0) return true;
  if (tileY >= mapHeight) return true;

  // Get the tile at tile coords
  const tile = getTile(tileX, tileY);

  // If the tile is blank the point is traversable
  if (tile == null) {
    return true;
  }

  // if the tile is not walkablepoint is traversable
  if (!tile.data.walkable) {
    return true;
  }

  // Get the coordinates of the point within the tile
  const localPointX = Math.floor(x % tileSize);
  const localPointY = Math.floor(y % tileSize);

  // Return "true" if the pixel is not solid
  const solid = tile.solidityMap[localPointY][localPointX];
  return solid === 0;
};

// ======================== Bresenham algorithm

// Returns the list of points from p0 to p1
export const bresenhamLineBetweenPoints = (p0: point, p1: point) => {
  // returns List<Point>
  return bresenhamLine(p0.x, p0.y, p1.x, p1.y);
};

// Returns the list of points from (x0, y0) to (x1, y1) : List<Point>
export const bresenhamLine = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) => {
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

// ======================== Raycast algorithm

export const normalize = (point: point, scale: number = 1) => {
  const norm = Math.sqrt(point.x * point.x + point.y * point.y);
  if (norm != 0) {
    // as3 return 0,0 for a point of zero length
    point.x = (scale * point.x) / norm;
    point.y = (scale * point.y) / norm;
  }

  return point;
};

export const rayCast = (
  position: point,
  direction: point,
  rayLength: number,
  offset: point,
  debugOpts: debugLine = {
    enabled: false,
    debugView: null,
    duration: 100,
  },
) => {
  // set result defaults
  const result = {
    doCollide: false,
    position: null,
    distance: null,
  };

  // Exit the function now if the ray length is 0
  if (rayLength == 0) {
    result.doCollide = isPointTraversable(position.x, position.y, offset);
    result.position = position;
    drawNode(position.x, position.y, 'pink', 4);
    return result;
  }

  // const dir = normalize(direction);
  const dir = normalize(direction, rayLength);
  const pos2 = { x: position.x + dir.x, y: position.y + dir.y };

  // Get the list of points from the Bresenham algorithm
  const rayLine = bresenhamLineBetweenPoints(position, pos2);

  if (rayLine.length > 0) {
    const startingAtPos =
      rayLine[0].x === position.x && rayLine[0].y === position.y;

    // get starting point, normal or reversed
    let rayPointIndex = startingAtPos ? 0 : rayLine.length - 1;

    // Loop through all the points starting from 'position'
    const ok = true;
    while (ok) {
      let rayPoint = rayLine[rayPointIndex];
      if (!isPointTraversable(rayPoint.x, rayPoint.y, offset)) {
        result.position = rayPoint; // Vector.FromPoint(rayPoint);
        result.doCollide = true;
        drawNode(result.position.x, result.position.y, 'cyan', 2, debugOpts);
        break;
      } else {
        drawNode(rayPoint.x, rayPoint.y, 'grey', 1, debugOpts);
      }

      // iterate on ray points
      if (startingAtPos) {
        // iterate in forward direction
        rayPointIndex++;
        if (rayPointIndex >= rayLine.length) {
          break;
        }
      } else {
        // iterate on reversed direction
        rayPointIndex--;
        if (rayPointIndex < 0) {
          break;
        }
      }
    }
  }

  drawNode(position.x, position.y, 'pink', 2, debugOpts);

  // we didnt find any non transversable hit
  if (!result.doCollide) {
    return null;
  }

  // calculate distance to hit point from cast origin
  const a = Math.abs(result.position.x - position.x);
  const b = Math.abs(result.position.y - position.y);
  result.distance = Math.hypot(a, b);

  // return hit result
  return result;
};

export const drawNode = (
  x: number,
  y: number,
  color: string,
  size: number = 1,
  opts: debugLine = { enabled: false, debugView: null, duration: 100 },
) => {
  const { enabled, debugView, duration } = opts;
  if (!enabled || !debugView || duration === 0) {
    return;
  }

  let point = new View({
    superview: debugView,
    backgroundColor: color,
    x: x - size / 2,
    y: y - size / 2,
    width: size,
    height: size,
    zIndex: 9998,
  });

  setTimeout(() => {
    point.removeFromSuperview();
    point = null;
  }, duration);
};

// =========================================
// Alternative bresenham algorithm
// =========================================

// let bresenhamLine3 = (x1, y1, x2, y2) => {
//   const result = []; // array of points

//   // Iterators, counters required by algorithm
//   let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;

//   // Calculate line deltas
//   dx = x2 - x1;
//   dy = y2 - y1;

//   // Create a positive copy of deltas (makes iterating easier)
//   dx1 = Math.abs(dx);
//   dy1 = Math.abs(dy);

//   // Calculate error intervals for both axis
//   px = 2 * dy1 - dx1;
//   py = 2 * dx1 - dy1;

//   // The line is X-axis dominant
//   if (dy1 <= dx1) {

//     // Line is drawn left to right
//     if (dx >= 0) {
//         x = x1; y = y1; xe = x2;
//     } else { // Line is drawn right to left (swap ends)
//         x = x2; y = y2; xe = x1;
//     }

//     // pixel(x, y); // Draw first pixel
//     result.push({ x, y });

//     // Rasterize the line
//     for (i = 0; x < xe; i++) {
//       x = x + 1;

//       // Deal with octants...
//       if (px < 0) {
//         px = px + 2 * dy1;
//       } else {
//         if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
//           y = y + 1;
//         } else {
//           y = y - 1;
//         }
//         px = px + 2 * (dy1 - dx1);
//       }

//       // Draw pixel from line span at currently rasterized position
//       // pixel(x, y);
//       result.push({ x, y });
//     }

//   } else { // The line is Y-axis dominant

//     // Line is drawn bottom to top
//     if (dy >= 0) {
//       x = x1; y = y1; ye = y2;
//     } else { // Line is drawn top to bottom
//       x = x2; y = y2; ye = y1;
//     }

//     // pixel(x, y); // Draw first pixel
//     result.push({ x, y });

//     // Rasterize the line
//     for (i = 0; y < ye; i++) {
//       y = y + 1;

//       // Deal with octants...
//       if (py <= 0) {
//           py = py + 2 * dx1;
//       } else {
//         if ((dx < 0 && dy<0) || (dx > 0 && dy > 0)) {
//           x = x + 1;
//         } else {
//           x = x - 1;
//         }
//         py = py + 2 * (dx1 - dy1);
//       }

//       // Draw pixel from line span at currently rasterized position
//       // pixel(x, y);
//       result.push({ x, y });
//     }
//   }

//   return result;
// };
