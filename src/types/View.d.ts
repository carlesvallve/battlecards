declare module 'lib/PubSub' {
  export default class PubSub {
    _subscribers: { [signal: string]: unknown[] };
    _listeningTo: { [id: string]: PubSub };

    _maxListeners: number;

    constructor();

    publish(signal: string): this;
    subscribe(signal: string, ctx, method: Function): this;
    subscribeOnce(signal: string, ctx, method: Function): this;
    unsubscribe(signal: string, ctx, method: Function): this;
    listeners(type: string): Function[];
    on(type: string, f: Function): this;
    once(type: string, f: Function): this;
    removeListener(type: string, f: Function): this;
    removeAllListeners(type: string): this;

    emit(type: string): boolean;
    setMaxListeners(_maxListeners: number): void;
    hasListeners(type: string): boolean;
    listenTo(obj: PubSub, name: string, callback: Function): this;
    stopListening(obj: PubSub, name: string, callback: Function);
  }
}

declare module 'ui/View' {
  import PubSub from 'lib/PubSub';
  import InputEvent, { DragEvent } from 'event/input/InputEvent';
  import InputHandler, {
    Opts as InputOpts,
    DragOpts,
  } from 'event/input/InputHandler';

  // import ViewBacking from 'ui/backend/canvas/ViewBacking';
  // import BoxLayout from 'ui/layout/BoxLayout';

  import Point from 'math/geom/Point';
  import Rect from 'math/geom/Rect';

  // import { Engine } from 'ui/engine';
  // import filter from 'ui/filter';

  export type Opts = InputOpts & {
    infinite?: boolean;
    visible?: boolean;
    clip?: boolean;
    filter?: filter.Filter;
    compositeOperation?:
      | ''
      | 'color'
      | 'color-burn'
      | 'color-dodge'
      | 'darken'
      | 'difference'
      | 'exclusion'
      | 'hard-light'
      | 'hue'
      | 'lighten'
      | 'luminosity'
      | 'multiply'
      | 'overlay'
      | 'saturation'
      | 'screen'
      | 'soft-light'
      | 'copy'
      | 'lighter'
      | 'destination-atop'
      | 'destination-in'
      | 'destination-out'
      | 'destination-over'
      | 'source-atop'
      | 'source-in'
      | 'source-out'
      | 'source-over'
      | 'xor';
    x?: number;
    y?: number;
    offsetX?: number;
    offsetY?: number;
    anchorX?: number;
    anchorY?: number;
    centerAnchor?: boolean;
    width?: number;
    height?: number;
    opacity?: number;
    zIndex?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    flipX?: boolean;
    flipY?: boolean;
    backgroundColor?: string;
    fixedAspectRatio?: boolean;
    aspectRatio?: number;

    tag?: string;
    centerOnOrigin?: boolean;
    r?: number;

    superview?: View;
    parent?: View; // deprecated

    Backing?: new (view: View, opts: Opts) => ViewBacking;

    layout?: 'linear' | 'box' | '';

    debug?: unknown | false;

    // HACK allow other opts:
    [key: string]: unknown;
  };

  export default class View extends PubSub {
    uid: number;
    debug: unknown | false;
    tag: string;
    style: ViewBacking;
    _opts: Opts;
    _tick: (dt: number, engine: Engine) => void;
    _CustomBacking: ViewBacking;
    _layout: BoxLayout;
    _layoutName: 'linear' | 'box' | '';
    _autoSize: boolean;
    _filter: filter.Filter;
    _loaded: boolean;
    _infinite: boolean;
    _inputOverCount: number;
    _boundingShape: Rect;
    __root: View;
    __anims: null;
    __input: InputHandler;
    __subs: View[];
    __tagClassName: string;
    __hasSubviewListener: boolean; // from BoxLayout

    constructor(opts: Opts);

    setTick(tick: (dt: number, engine: Engine) => void): void;
    getAssets(): string[];
    updateOpts(opts: Opts): Opts;
    getFilters(): filter.Filter[]; // deprecated
    getFilter(): filter.Filter;
    addFilter(filter: filter.Filter): void; // deprecated
    setFilter(filter: filter.Filter): void;
    removeFilter(): void;
    isDragging(): boolean;
    startDrag(opts: DragOpts): void;
    getInput(): InputHandler;
    isInputOver(): boolean;
    getInputOverCount(): number;
    canHandleEvents(handleEvents?: boolean, ignoreSubviews?: boolean): void;
    setIsHandlingEvents(canHandleEvents: boolean): void;
    isHandlingEvents(): boolean;
    needsRepaint(): void; // abstract
    needsReflow(): void;
    reflowSync(): void;
    localizePoint(pt: Point): Point;
    getSubview(i: number): View;
    getSubviews(): View[];
    getVisibleViewBackings(): ViewBacking[];
    getSuperview(): View;
    connectEvent(): View;
    disconnectEvent(src: View): void;
    addSubview(view: View): View;
    removeSubview(view: View): View;
    removeFromSuperview(): void;
    removeAllSubviews(): View;
    getApp(): View;
    getSuperviews(): View[];
    buildView(): View;
    containsLocalPoint(pt: Point): boolean;
    getBoundingShape(simple?: boolean): Rect | true;
    getRelativeRegion(
      region: {
        src: View;
        x: number;
        y: number;
        width: number;
        height: number;
      },
      parent: View,
    ): Rect;
    getPosition(
      relativeTo: View,
    ): {
      x: number;
      y: number;
      r: number;
      width: number;
      height: number;
      scale: number;
      anchorX: number;
      anchorY: number;
    };
    show(): void;
    hide(): void;
    getTag(): string;
    DEFAULT_REFLOW(): void;
    reflow(): void;
    setHandleEvents(handleEvents?: boolean, ignoreSubviews?: boolean): void;
    getEngine(): View;
    getParents(): View[];

    // input handling
    onInputStart: (
      event: InputEvent,
      point: Point,
      isLocalPoint: boolean,
    ) => void;
    onInputMove: (
      event: InputEvent,
      point: Point,
      isLocalPoint: boolean,
    ) => void;
    onInputSelect: (
      event: InputEvent,
      point: Point,
      isLocalPoint: boolean,
    ) => void;
    onInputScroll: (
      event: InputEvent,
      point: Point,
      isLocalPoint: boolean,
    ) => void;
    onInputClear: (
      event: InputEvent,
      point: Point,
      isLocalPoint: boolean,
    ) => void;
    onInputOver: (
      over: { [id: number]: boolean },
      overCount: number,
      atTarget: boolean,
    ) => void;
    onInputOut: (
      over: { [id: number]: boolean },
      overCount: number,
      atTarget: boolean,
      event: InputEvent,
    ) => void;
    onDragStart: (dragEvent: DragEvent) => void;
    onDrag: (dragEvent: DragEvent, moveEvent: InputEvent, delta: Point) => void;
    onDragStop: (dragEvent: DragEvent, selectEvent: InputEvent) => void;
    //

    _addAssetsToList(assetURLs: string[]): void; // virtual
    _getAssets(assetURLs: string[]): void;
    _forceLoad(): void;
    _setLayout(layoutName: 'linear' | 'box'): void;
    _onEventPropagate(evt, pt: Point, atTarget: boolean): void;
    _connectEvents(): void;
    _disconnectEvents(): void;
    _wrapRender(ctx, transform, opacity): void;

    static addExtension(ext: new (view: View, opts: Opts) => ViewBacking): void;
    static setDefaultViewBacking(
      ViewBackingCtor: new (view: View, opts: Opts) => ViewBacking,
    ): void;
  }
}
