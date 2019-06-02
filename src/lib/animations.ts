import animate from 'animate';
import View from 'ui/View';

export const blink = (elm: View, duration: number, iterations: number = 0) => {
  elm.hide();
  const anim = animate(elm)
    .clear()
    .wait(duration * 1)
    .then(() => {
      elm.show();
    })
    .wait(duration * 2)
    .then(() => {
      elm.hide();
      blink(elm, duration);
    });

  return anim;
};
