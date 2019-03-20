export type Constructor<T> = new(...args: any[]) => T;

export interface CanDisable {
  /** Whether the component is disabled. */
  disabled: boolean;
}

/** Mixin to augment a directive with a `disabled` property. */
export function mixinDisabled<T extends Constructor<{}>>(base: T): Constructor<CanDisable> & T {
  return class extends base {
    private _disabled = false;

    get disabled(): boolean { return this._disabled; }
    set disabled(value: boolean) { this._disabled = coerceBooleanProperty(value); }

    // tslint:disable-next-line
    constructor(...args: any[]) { super(...args); }
  };
}

export interface CanColor<P extends Partial<DtThemePalette>> {
  /** Theme color palette for the component. */
  color: P;
}

export interface HasElementRef {
  _elementRef: ElementRef;
}

/** Possible color palette values. */
export type DtThemePalette = 'main' | 'accent' | 'warning' | 'error' | 'cta' | 'recovered' | 'neutral' | undefined;

/** Mixin to augment a directive with a `color` property. */
export function mixinColor<T extends Constructor<HasElementRef>>(
  base: T, defaultColor?: DtThemePalette): Constructor<CanColor<DtThemePalette>> & T;
export function mixinColor<T extends Constructor<HasElementRef>, P extends Partial<DtThemePalette>>(
  base: T, defaultColor?: P): Constructor<CanColor<P>> & T;
export function mixinColor<T extends Constructor<HasElementRef>, P extends Partial<DtThemePalette>>(
  base: T, defaultColor?: P): Constructor<CanColor<P>> & T {
  return class extends base {
    private _color: P;

    get color(): P { return this._color; }
    set color(value: P) {
      const colorPalette = value || defaultColor as P;

      if (colorPalette !== this._color) {
        setComponentColorClasses(this, colorPalette);
        this._color = colorPalette;
      }
    }

    // tslint:disable-next-line:no-any
    constructor(...args: any[]) {
      super(...args);

      // Set the default color that can be specified from the mixin.
      this.color = defaultColor as P;
    }
  };
}
type DtButtonThemePalette = 'main' | 'warning' | 'cta';

class DtButtonBase {
  constructor(public _elementRef: ElementRef) { }
}
export type ButtonVariant = 'primary' | 'secondary' | 'nested';
const defaultVariant = 'primary';


const _DtButtonMixinBase = mixinDisabled(mixinColor<Constructor<DtButtonBase>, DtButtonThemePalette>(DtButtonBase, 'main'));

@Component({
  moduleId: module.id,
  selector: `button[dt-button], button[dt-icon-button]`,
  exportAs: 'dtButton',
  host: {
    'class': 'dt-button',
    '[class.dt-icon-button]': '_isIconButton',
    '[disabled]': 'disabled || null',
  },
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  inputs: ['disabled', 'color' ],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtButton extends _DtButtonMixinBase
  implements OnDestroy, AfterContentInit, CanDisable, CanColor<DtButtonThemePalette>, HasElementRef {

  @Input()
  get variant(): ButtonVariant { return this._variant; }
  set variant(value: ButtonVariant) {
    const variant = value || defaultVariant;
    if (variant !== this._variant) {
      this._replaceCssClass(variant, this._variant);
      this._variant = variant;
    }
  }
  private _variant: ButtonVariant;
  private _iconChangesSub: Subscription = NEVER.subscribe();

  @ContentChildren(DtIcon) _icons: QueryList<DtIcon>;

  /** @internal Whether the button is icon only. */
  _isIconButton = false;

  constructor(
    elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef);

    // Set the default variant to trigger the setters.
    this.variant = defaultVariant;

    this._isIconButton = this._getHostElement().hasAttribute('dt-icon-button');

    this._focusMonitor.monitor(this._elementRef.nativeElement, true);
  }

  ngAfterContentInit(): void {
    // We need to set markForCheck manually on every icons change
    // so that the template can determine if the icon container
    // should be shown or not
    this._iconChangesSub = this._icons.changes
      .subscribe(() => { this._changeDetectorRef.markForCheck(); });
  }

  /**
   * @internal
   */
  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
    this._iconChangesSub.unsubscribe();
  }

  /** Focuses the button. */
  focus(): void {
    this._getHostElement().focus();
  }

  /** Retrieves the native element of the host. */
  private _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  private _replaceCssClass(newClass?: string, oldClass?: string): void {
    replaceCssClass(this._elementRef, `dt-button-${oldClass}`, `dt-button-${newClass}`, this._renderer);
  }

}
