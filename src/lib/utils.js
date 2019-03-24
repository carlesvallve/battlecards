import device from 'device';
import animate from 'animate';
import View from 'ui/View';

export const getScreenDimensions = () => {
  const scale = device.width / 320;
  const w = parseInt(device.screen.width / scale, 10);
  const h = parseInt(device.screen.height / scale, 10);
  return { width: w, height: h };
};

export const getRandomFloat = (min, max) => {
  return min + Math.random() * (max - min);
};

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomItemFromArray = (arr) => {
  return arr[getRandomInt(0, arr.length - 1)];
};

export const getRandomPos = (min, max) => {
  const screen  = getScreenDimensions();
  const x = getRandomInt(20, screen.width - 20);
  const y = getRandomInt(20, -4 + screen.height / 2);
  return { x, y };
};

export const getDistanceBetweenViews = (view1, view2) => {
  const a = Math.abs(view2.style.x - view1.style.x);
  const b = Math.abs(view2.style.y - view1.style.y);
  const d = Math.sqrt(a * a + b * b) / 2;
  return d;
};

export const debugPoint = (parent, display = true, color = 'yellow') => {
  if (!display) {
    return null;
  }

  // create debug origin point
  return new View({
    parent,
    width: 1,
    height: 1,
    centerOnOrigin: true,
    centerAnchor: true,
    backgroundColor: color,
  });
};

