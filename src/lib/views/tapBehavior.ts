/**
 * "InputSelect" handlers, simplified.
 *
 * 1 - Call addTapBehavior on your class
 * 2 - Call initTapBehavior(this) in your constructor
 * 3 - Define a method "onTap()" to receive the taps
 *
 * If you have a method "setPressed(true/false)", it will be called when appropriate.
 */

export function addTapBehavior(viewSubclass) {
  addToPrototype(viewSubclass, 'onInputStart', onInputStart);
  addToPrototype(viewSubclass, 'onInputSelect', onInputSelect);
  addToPrototype(viewSubclass, 'onInputOut', onInputOut);

  // onTap must be defined - this is the whole point
  if (!viewSubclass.prototype.onTap) {
    throw new Error(
      `tapBehavior: ${viewSubclass.name} must define method onTap`,
    );
  }

  // setPressed method is optional - if not there we add a default one
  if (!viewSubclass.prototype.setPressed) {
    viewSubclass.prototype.setPressed = setPressed;
  }
}

export function initTapBehavior(viewInstance) {
  viewInstance.pressed = false;
  viewInstance._inputOutTime = 0;
}

function addToPrototype(aClass, funcName, func) {
  if (aClass.prototype[funcName]) {
    throw new Error(`tapBehavior: ${aClass.name} already defines ${funcName}`);
  }
  aClass.prototype[funcName] = func;
}

/**
 * The catch is: due to how it is done "upstream" events may come in 2 ways:
 * - START, SELECT, OUT (you would expect this)
 * - START, OUT, SELECT: because clearOverState also calls the View currently getting a "select"
 */
function onInputStart(evt) {
  if (this.preventDefault && evt) evt.cancel();

  if (this.disabled) return;

  this.setPressed(true);
}

function onInputSelect(evt) {
  if (this.disabled) return;

  if (this.pressed || Date.now() - this._inputOutTime < 50) {
    // pass the tap point inside the tapped element
    const pt =
      evt.point[Object.keys(evt.point)[Object.keys(evt.point).length - 1]];
    this.onTap(pt);
  }
}

function onInputOut() {
  if (this.pressed) {
    this._inputOutTime = Date.now();
    this.setPressed(false);
  }
}

function setPressed(isPressed) {
  this.pressed = isPressed;
}
