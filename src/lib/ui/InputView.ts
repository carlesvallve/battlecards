import View from 'ui/View';

var INVALID = -2;
var DEFAULT_MAX_DOUBLE_CLICK_MS = 200;
var DEFAULT_DRAG_THRESHOLD = 15;

export default class InputView extends View {
  startEvents: any;
  startPoints: { x: number; y: number; lastX: number; lastY: number }[];
  lastStartID: number;
  lastStartTime: number;

  handlersForDrag: any;
  handlersForDragFinish: any;
  handlersForTouch: any;
  handlersForClick: any;
  handlersForDoubleClick: any;
  enableDoubleClick: boolean;
  maxDoubleClickMS: number;
  dragThreshold: number;

  constructor(opts) {
    super(opts);

    // keep a list of active inputs
    this.startEvents = [];
    this.startPoints = [];

    // track for clicks and double clicks
    this.lastStartID = INVALID;
    this.lastStartTime = INVALID;

    // handlers for high level input events
    this.handlersForDrag = [];
    this.handlersForDragFinish = [];
    this.handlersForTouch = [];
    this.handlersForClick = [];
    this.handlersForDoubleClick = [];

    // allow explicit enabling or disabling of double clicks
    this.enableDoubleClick =
      opts.enableDoubleClick !== undefined ? opts.enableDoubleClick : true;

    // max elapsed time between two clicks to be considered a double click
    this.maxDoubleClickMS =
      opts.maxDoubleClickMS !== undefined
        ? opts.maxDoubleClickMS
        : DEFAULT_MAX_DOUBLE_CLICK_MS;

    // required pixels dragged before the input is considered a real drag
    this.dragThreshold =
      opts.dragThreshold !== undefined
        ? opts.dragThreshold
        : DEFAULT_DRAG_THRESHOLD;
  }

  reset() {
    this.startEvents.length = 0;
    this.startPoints.length = 0;

    this.lastStartID = INVALID;
    this.lastStartTime = INVALID;

    this.handlersForDrag.length = 0;
    this.handlersForDragFinish.length = 0;
    this.handlersForTouch.length = 0;
    this.handlersForClick.length = 0;
    this.handlersForDoubleClick.length = 0;
  }

  /**
   * register handlers for significant input events
   */

  registerHandlerForDrag(handler) {
    this.handlersForDrag.push(handler);
  }

  registerHandlerForDragFinish(handler) {
    this.handlersForDragFinish.push(handler);
  }

  registerHandlerForTouch(handler) {
    this.handlersForTouch.push(handler);
  }

  registerHandlerForClick(handler) {
    this.handlersForClick.push(handler);
  }

  registerHandlerForDoubleClick(handler) {
    this.handlersForDoubleClick.push(handler);
  }

  /**
   * remove handler for significant input events
   */

  removeHandlerForDrag(handler) {
    var index = this.handlersForDrag.indexOf(handler);
    if (index === -1) return;
    this.handlersForDrag.splice(index, 1);
  }

  removeHandlerForTouch(handler) {
    var index = this.handlersForTouch.indexOf(handler);
    if (index === -1) return;
    this.handlersForTouch.splice(index, 1);
  }

  removeHandlerForClick(handler) {
    var index = this.handlersForClick.indexOf(handler);
    if (index === -1) return;
    this.handlersForClick.splice(index, 1);
  }

  removeHandlerForDoubleClick(handler) {
    var index = this.handlersForDoubleClick.indexOf(handler);
    if (index === -1) return;
    this.handlersForDoubleClick.splice(index, 1);
  }

  /**
   * devkit input
   */

  onInputStart(
    evt: any,
    pt: { x: number; y: number; lastX: number; lastY: number },
  ) {
    pt.lastX = pt.x;
    pt.lastY = pt.y;
    this.startEvents.push(evt);
    this.startPoints.push(pt);

    var elapsed = Date.now() - this.lastStartTime;
    var noActiveEvent = this.lastStartID === INVALID;
    var isDoubleClick = noActiveEvent && elapsed <= this.maxDoubleClickMS;
    if (this.enableDoubleClick && isDoubleClick) {
      this.handleDoubleClick(pt.x, pt.y);
    } else {
      this.handleTouch(pt.x, pt.y);
      this.lastStartID = evt.id;
      this.lastStartTime = Date.now();
    }
  }

  onInputMove(
    evt: any,
    pt: { x: number; y: number; lastX: number; lastY: number },
  ) {
    var startEvents = this.startEvents;
    var startPoints = this.startPoints;
    var activeCount = startEvents.length;
    if (!activeCount) {
      return;
    }

    // ignore events that aren't the most recent
    var activeIndex = activeCount - 1;
    var startEvt = startEvents[activeIndex];
    var startPt = startPoints[activeIndex];
    if (!startEvt || !startPt) {
      return;
    }

    var x = pt.x;
    var y = pt.y;

    if (startEvt.id !== evt.id) {
      // update lastX and lastY on any event that moves, safer multi-touch
      for (var i = activeIndex; i >= 0; i--) {
        var testEvt = startEvents[i];
        if (testEvt.id === evt.id) {
          var testPt = startPoints[i];
          testPt.lastX = x;
          testPt.lastY = y;
        }
      }
      return;
    }

    var dx = x - startPt.x;
    var dy = y - startPt.y;

    if (
      this.lastStartID === INVALID ||
      Math.sqrt(dx * dx + dy * dy) >= this.dragThreshold
    ) {
      this.handleDrag(x - startPt.lastX, y - startPt.lastY);
    }

    startPt.lastX = x;
    startPt.lastY = y;
  }

  onInputSelect(
    evt: any,
    pt: { x: number; y: number; lastX: number; lastY: number },
  ) {
    var startEvents = this.startEvents;
    var startPoints = this.startPoints;
    for (var i = startEvents.length - 1; i >= 0; i--) {
      var startEvt = startEvents[i];
      if (startEvt.id === evt.id) {
        startEvents.splice(i, 1);
        startPoints.splice(i, 1);
      }
    }

    if (evt.id === this.lastStartID) {
      this.handleClick(pt.x, pt.y);
    }
  }

  onDragStop(dragEvt: any, stopEvt: any) {
    var startEvents = this.startEvents;
    var startPoints = this.startPoints;
    var dx = 0;
    var dy = 0;

    for (var i = startEvents.length - 1; i >= 0; i--) {
      var startEvt = startEvents[i];
      var startPt = startPoints[i];
      if (startEvt.id === stopEvt.id) {
        startEvents.splice(i, 1);
        startPoints.splice(i, 1);

        dx = stopEvt.srcPt.x - startPt.x;
        dy = stopEvt.srcPt.y - startPt.y;
      }
    }

    this.handleDragFinish(dx, dy);
  }

  /**
   * significant input events
   */

  handleDrag(dx: number, dy: number) {
    for (var i = 0; i < this.handlersForDrag.length; i++) {
      this.handlersForDrag[i](dx, dy);
    }

    if (this.lastStartID !== INVALID) {
      this.startDrag();
      this.lastStartID = INVALID;
    }
  }

  handleDragFinish(dx: number, dy: number) {
    for (var i = 0; i < this.handlersForDragFinish.length; i++) {
      this.handlersForDragFinish[i](dx, dy);
    }
  }

  handleTouch(x: number, y: number) {
    for (var i = 0; i < this.handlersForTouch.length; i++) {
      this.handlersForTouch[i](x, y);
    }
  }

  handleClick(x: number, y: number) {
    for (var i = 0; i < this.handlersForClick.length; i++) {
      this.handlersForClick[i](x, y);
    }

    this.lastStartID = INVALID;
  }

  handleDoubleClick(x: number, y: number) {
    for (var i = 0; i < this.handlersForDoubleClick.length; i++) {
      this.handlersForDoubleClick[i](x, y);
    }

    this.lastStartID = INVALID;
    this.lastStartTime = INVALID;
  }
}
