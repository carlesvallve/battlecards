import animate from 'animate';

export const blink = (elm, duration, iterations = 0) => {
  elm.hide();
  const anim = animate(elm)
    .clear()
    .wait(duration * 1).then(() => { elm.show(); })
    .wait(duration * 2).then(() => {
      elm.hide();
      blink(elm, duration);
    });

  return anim;
};
