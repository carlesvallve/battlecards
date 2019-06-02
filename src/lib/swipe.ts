import View from 'ui/View';
import Vector from './vector';

export const onSwipe = (
  view: View,
  threshold: number,
  cb: (v: Vector) => void,
) => {
  // handle swipes

  // mouse-down inside element
  view.onInputStart = (evt, pt) => {
    view.dragStartPoint = pt;
  };

  // mouse-up inside element
  view.onInputSelect = (evt, pt) => {
    view.dragStartPoint = null;
  };

  // mouse-out-of-element
  // view.onInputOut = (evt, pt) => {
  //   view.dragStartPoint = null;
  // };

  // mouse-move-inside-element
  view.onInputMove = (evt, pt) => {
    if (!view.dragStartPoint) {
      return;
    }

    // const dx = view.dragStartPoint.x - pt.x;
    // const dy = view.dragStartPoint.y - pt.y;

    const v = new Vector(
      pt.x - view.dragStartPoint.x,
      pt.y - view.dragStartPoint.y,
    );
    const dist = v.length();
    // console.log('>>>', dist);
    if (dist > threshold) {
      cb && cb(v);
      view.dragStartPoint = null;
    }
  };
};
