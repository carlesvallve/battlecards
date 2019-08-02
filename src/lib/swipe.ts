import View from 'ui/View';
import Vector from './vector';
import { Point } from '../types/customTypes';

// handle swipes

export const onSwipe = (
  view: View,
  threshold: number,
  cb: (v: Vector) => void,
) => {
  // mouse-down inside element
  view.onInputStart = (evt: any, pt: Point) => {
    view.dragStartPoint = pt;
  };

  // mouse-up inside element
  view.onInputSelect = (evt: any, pt: Point) => {
    view.dragStartPoint = null;
  };

  // mouse-out-of-element
  view.onInputOut = (evt: any, pt: Point) => {
    view.dragStartPoint = null;
  };

  // mouse-move-inside-element
  view.onInputMove = (evt: any, pt: Point) => {
    if (!view.dragStartPoint) {
      return;
    }

    const v = new Vector(
      pt.x - view.dragStartPoint.x,
      pt.y - view.dragStartPoint.y,
    );

    if (v.length() > threshold) {
      cb && cb(v);
      view.dragStartPoint = null;
    }
  };
};
