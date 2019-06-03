import View from 'ui/View';
import Vector from './vector';
import { point } from './types';

// handle swipes

export const onSwipe = (
  view: View,
  threshold: number,
  cb: (v: Vector) => void,
) => {
  // mouse-down inside element
  view.onInputStart = (evt: any, pt: point) => {
    view.dragStartPoint = pt;
  };

  // mouse-up inside element
  view.onInputSelect = (evt: any, pt: point) => {
    view.dragStartPoint = null;
  };

  // mouse-out-of-element
  view.onInputOut = (evt: any, pt: point) => {
    view.dragStartPoint = null;
  };

  // mouse-move-inside-element
  view.onInputMove = (evt: any, pt: point) => {
    if (!view.dragStartPoint) {
      return;
    }

    const v = new Vector(
      pt.x - view.dragStartPoint.x,
      pt.y - view.dragStartPoint.y,
    );

    if (v.length() > threshold) {
      // console.log('>>>', v);
      cb && cb(v);
      view.dragStartPoint = null;
    }
  };
};
