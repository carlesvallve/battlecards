import device from 'device';
import animate from 'animate';
import View from 'ui/View';
import { point } from './types';

export const waitForIt = (cb: any, duration: number = 300, it?: View) => {
  animate(it || {})
    .clear()
    .wait(duration)
    .then(cb);
};

export const waitForItPromise = async (duration: number = 300) => {
  return new Promise((resolve) => waitForIt(resolve, duration));
};

export const getScreenDimensions = (): { width: number; height: number } => {
  const scale = device.width / 320;
  const w = Math.round(device.screen.width / scale);
  const h = Math.round(device.screen.height / scale);
  return { width: w, height: h };
};

export const getRandomFloat = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomItemFromArray = (arr: any[]) => {
  return arr[getRandomInt(0, arr.length - 1)];
};

export const getRandomPos = (min: number, max: number): point => {
  const screen = getScreenDimensions();
  const x = getRandomInt(20, screen.width - 20);
  const y = getRandomInt(20, -4 + screen.height / 2);
  return { x, y };
};

export const getDistanceBetweenViews = (view1: View, view2: View): number => {
  const a = Math.abs(view2.style.x - view1.style.x);
  const b = Math.abs(view2.style.y - view1.style.y);
  const d = Math.sqrt(a * a + b * b) / 2;
  return d;
};

export const debugPoint = (
  parent: View,
  color: string = 'yellow',
  display: boolean = false,
): View => {
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
