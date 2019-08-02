declare module 'event/input/InputEvent' {
  import Point from 'math/geom/Point';
  import View from 'ui/view';
  import InputEvent from 'event/input/InputEvent';

  export const enum EventType {
    START,
    MOVE,
    SELECT,
    SCROLL,
    CLEAR,
  }

  export default class InputEvent {
    id: string;
    type: EventType;

    point: Point;
    srcPoint: Point;

    root: View;
    target: View;
    trace: View[];

    cancelled: boolean;
    when: number;

    depth: number;

    constructor(
      id: string,
      evtType: EventType,
      x: number,
      y: number,
      root: View,
      target: View,
    );

    cancel(): void;
    clone(): InputEvent;
  }

  export type DragEvent = {
    id: string;
    type: 'input:drag';

    point: Point;
    srcPoint: Point;

    root: View;
    target: View;
    trace: View[];

    cancelled: boolean;
    when: number;

    depth: number;

    cancel(): void;
    clone(): InputEvent & { type: 'input:drag' };

    didDrag: boolean;
    radius: number;

    currPt: Point;
    localPt: Point;
  };
}

declare module 'event/input/InputHandler' {
  import View from 'ui/View';
  import InputEvent, { DragEvent } from 'event/input/InputEvent';
  import Point from 'math/geom/point';

  export type Opts = {
    canHandleEvents?: boolean;
    blockEvents?: boolean;
  };

  export type DragOpts = { radius: number } & (
    | { inputStartEvt: InputEvent }
    | { inputStartEvent: InputEvent });

  export default class InputHandler {
    startCount: number;
    dragCount: number;
    overCount: number;
    canHandleEvents: boolean;
    blockEvents: boolean;

    constructor(view: View, opts: Opts);

    update(opts: Opts): void;
    containsEvent(evt: InputEvent, localPt: Point): boolean;
    onEnter(id: string, atTarget: boolean): void;
    onLeave(id: string, atTarget: boolean, evt: InputEvent): void;
    resetOver(): void;

    startDrag(opts: DragOpts): void;
    isDragging(): boolean;
    onDragStart(dragEvt: DragEvent, moveEvt: InputEvent): void;
    onDrag(dragEvt: DragEvent, moveEvt: InputEvent): void;
    onDragStop(dragEvt: DragEvent, selectEvt: InputEvent): void;

    onInputStart(evt: InputEvent): void;
    onInputSelect(evt: InputEvent, localPt: Point): void;
    onGlobalInputSelect(): void;
  }
}
