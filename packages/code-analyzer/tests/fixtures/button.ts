import { DtIcon } from '@dynatrace/angular-components/icon';
import { ButtonVariant } from './button-dependency';

export class DtButtonBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtButtonMixinBase = mixinDisabled(mixinColor(DtButtonBase, 'main'));

const defaultVariant = 'primary';

/**
 * Dynatrace design button.
 * @design-clickable
 * @design-hoverable
 * @design-unrelated
 */
@Component({
  moduleId: module.id,
  selector: `button[dt-button], button[dt-icon-button]`,
  exportAs: 'dtButton',
  host: {
    'class': 'dt-button',
    '[disabled]': 'disabled || null',
  },
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  inputs: ['disabled', 'color'],
})
export class DtButton extends _DtButtonMixinBase implements CanColor, HasElementRef {

  @Input()
  get variant(): ButtonVariant { return this._variant; }
  set variant(value: ButtonVariant) {
    const variant = value || defaultVariant;
    this._variant = variant;
  }
  private _variant: ButtonVariant;
  private _iconChangesSub: Subscription = NEVER.subscribe();

  @ContentChildren(DtIcon) _icons: QueryList<DtIcon>;

  constructor(
    elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef);

    // Set the default variant to trigger the setters.
    this.variant = defaultVariant;

    // For each of the variant selectors that is prevent in the button's host
    // attributes, add the correct corresponding class.
    for (const attr of BUTTON_HOST_ATTRIBUTES) {
      if (this._hasHostAttributes(attr)) {
        (elementRef.nativeElement as HTMLElement).classList.add(attr);
      }
    }

    this._focusMonitor.monitor(this._elementRef.nativeElement, true);
  }
  /** Focuses the button. */
  focus(): void {
    this._getHostElement().focus();
  }

  /** Retrieves the native element of the host. */
  private _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
