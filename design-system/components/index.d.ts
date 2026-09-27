// ExperimentKit — the Experiment Tool kit controls (vanilla JS, no framework).
// Every control is DOM markup + an init function: ExperimentKit.<Name>(root, options) → controller.
// The same functions are also globals: window.init<Name>.

type OnChange = () => void;

export interface ControlPanelController { element: HTMLElement; append(node: Node): void; setHTML(html: string): void; }
export declare function ControlPanel(root: Element): ControlPanelController;

export declare function Field(root: Element): { element: HTMLElement };

export interface InputWrapOptions { onChange?: OnChange; numeric?: boolean; isOpacity?: boolean; step?: number; }
export interface InputWrapController { element: HTMLElement; input: HTMLInputElement | null; getValue(): string; setValue(value: string): void; }
export declare function InputWrap(root: Element, options?: InputWrapOptions): InputWrapController;

export interface DimensionControlOptions { initialMode?: 'fixed' | 'hug'; measure?: () => number; onChange?: OnChange; }
export interface DimensionController {
  element: HTMLElement; getMode(): 'fixed' | 'hug';
  /** 'auto' in hug mode, else the fixed px string */ getValue(): string;
  setMode(mode: 'fixed' | 'hug', notify?: boolean): void; updateLabel(): void; closeMenu(): void;
}
export declare function DimensionControl(wrap: Element, options?: DimensionControlOptions): DimensionController;
/** Inits every .input-wrap--dimension under root whose data-dimension-id has a config. */
export declare function DimensionControlGroup(root: ParentNode, configs: Record<string, DimensionControlOptions>): Record<string, DimensionController>;

export interface ColorInputOptions { onChange?: (color: string) => void; }
export interface ColorInputController {
  element: Element; hexInput: HTMLInputElement; opacityInput: HTMLInputElement;
  /** rgba() string */ getColor(): string; /** '#RRGGBB' */ getHex(): string; updateUI(notify?: boolean): void;
}
export declare function ColorInput(root: Element, options?: ColorInputOptions): ColorInputController;

export interface SnippetOutputOptions { getContent?: () => string; /** default 'snippet.html' */ filename?: string; /** default true */ updateOnInit?: boolean; }
export declare function SnippetOutput(root: Element, options?: SnippetOutputOptions): { element: Element; output: HTMLTextAreaElement; update(): void };

export interface SliderOptions {
  /** default 0 */ min?: number; /** default 100 */ max?: number; /** default 1 */ step?: number;
  /** initial value and double-click reset target */ value?: number;
  /** ≥2 enables snap-to-tick */ tickCount?: number; onChange?: (value: number) => void;
}
export interface SliderController {
  element: Element; input: HTMLInputElement; track: HTMLElement;
  getValue(): number; setValue(raw: number | string, notify?: boolean): number;
  resetToDefault(): number; getDefaultValue(): number; getTickValues(): number[] | null;
}
export declare function Slider(root: Element, options?: SliderOptions): SliderController;
/** Slider with tickCount defaulting to the number of .slider-tick-mark elements (or 7). */
export declare function SliderTick(root: Element, options?: SliderOptions): SliderController;

export declare function Divider(root: Element): { element: HTMLElement };

export type OptionItem = string | { value: string; label?: string };
export interface OptionSelectorOptions { options?: OptionItem[]; value?: string; label?: string; onChange?: (value: string, item: { value: string; label: string }) => void; }
export interface OptionSelectorController {
  element: Element; input: HTMLInputElement; getValue(): string; getLabel(): string;
  setValue(value: string, notify?: boolean): void; openMenu(): void; closeMenu(): void;
}
export declare function OptionSelector(root: Element, options?: OptionSelectorOptions): OptionSelectorController;

export interface ToggleOptions { label?: string; rowLabel?: string; checked?: boolean; disabled?: boolean; onChange?: (checked: boolean, row: HTMLButtonElement, index: number) => void; }
export interface ToggleRow { element: HTMLButtonElement; getChecked(): boolean; setChecked(checked: boolean, notify?: boolean): void; setDisabled(disabled: boolean): void; }
export declare function Toggle(root: Element, options?: ToggleOptions): ToggleRow & { element: Element; rows: ToggleRow[] };

export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';
export interface CheckboxOptions {
  label?: string; rowLabel?: string; state?: CheckboxState; checked?: boolean; disabled?: boolean;
  /** click cycles unchecked → checked → indeterminate */ cycleIndeterminate?: boolean;
  onChange?: (state: CheckboxState, row: HTMLButtonElement, index: number) => void;
}
export interface CheckboxRow {
  element: HTMLButtonElement; getState(): CheckboxState; getChecked(): boolean;
  setState(state: CheckboxState, notify?: boolean): void; setChecked(checked: boolean, notify?: boolean): void; setDisabled(disabled: boolean): void;
}
export declare function Checkbox(root: Element, options?: CheckboxOptions): CheckboxRow & { element: Element; rows: CheckboxRow[] };

export interface CubicBezierInputOptions { /** '0.7, 0, 0.25, 1' or 'cubic-bezier(...)' */ value?: string; onChange?: (css: string) => void; }
export interface CubicBezierController {
  element: Element; textInput: HTMLInputElement | null;
  getRaw(): string; /** 'cubic-bezier(x1, y1, x2, y2)' */ getValue(): string; getValues(): [number, number, number, number];
  setRaw(raw: string, notify?: boolean): boolean; setValues(x1: number, y1: number, x2: number, y2: number): void; updateUI(notify?: boolean): void;
}
export declare function CubicBezierInput(root: Element, options?: CubicBezierInputOptions): CubicBezierController;

// ---- Intentional additions (hand-written, not in the repository) ----

export type UploadError = 'type' | 'size' | 'max';

export interface FileUploadOptions {
  /** native accept syntax: '.html,.css', 'image/*' */ accept?: string; /** bytes */ maxSize?: number;
  /** empty-state text; default from markup ('Choose file') */ placeholder?: string; label?: string;
  onChange?: (file: File | null) => void; onError?: (reason: UploadError, file: File) => void;
}
export interface FileUploadController {
  element: Element; input: HTMLInputElement; getFile(): File | null;
  setFile(file: File | null, notify?: boolean): boolean; clear(notify?: boolean): void; setDisabled(disabled: boolean): void;
}
export declare function FileUpload(root: Element, options?: FileUploadOptions): FileUploadController;

export interface ImageUploadOptions {
  /** default 'image/*' */ accept?: string; maxSize?: number; /** object-fit, default 'cover' */ fit?: string;
  /** seed URL (data: / blob:) */ value?: string; name?: string; label?: string;
  onChange?: (file: File | null, url: string) => void; onError?: (reason: UploadError, file: File) => void;
}
export interface ImageUploadController {
  element: Element; input: HTMLInputElement; getFile(): File | null; /** object URL or seeded URL; '' when empty */ getURL(): string;
  setFile(file: File | null, notify?: boolean): boolean; setURL(url: string, name?: string, notify?: boolean): void; clear(notify?: boolean): void;
}
export declare function ImageUpload(root: Element, options?: ImageUploadOptions): ImageUploadController;

export interface UploadItem { file: File | null; url: string; name: string; }
export interface MultiImageUploadOptions {
  /** default 'image/*' */ accept?: string; /** default unlimited; add tile hides at max */ max?: number; maxSize?: number;
  /** seed images */ value?: Array<{ url: string; name?: string }>; label?: string;
  onChange?: (files: File[], items: UploadItem[]) => void; onError?: (reason: UploadError, file: unknown) => void;
}
export interface MultiImageUploadController {
  element: Element; input: HTMLInputElement; getFiles(): File[]; getItems(): UploadItem[];
  /** returns how many were added */ add(list: Array<File | { url: string; name?: string }>, notify?: boolean): number;
  remove(index: number, notify?: boolean): void; clear(notify?: boolean): void;
}
export declare function MultiImageUpload(root: Element, options?: MultiImageUploadOptions): MultiImageUploadController;

export interface ColorSelectorOptions {
  /** hex, with or without '#'; default from markup */ value?: string; /** 0–100 */ opacity?: number;
  label?: string;
  onChange?: (color: string, detail: { hex: string; opacity: number }) => void;
}
export interface ColorSelectorController {
  element: Element; hexInput: HTMLInputElement; opacityInput: HTMLInputElement | null;
  /** rgba() string, same as ColorInput */ getColor(): string; /** '#RRGGBB' */ getHex(): string; /** 0–100 */ getOpacity(): number;
  setValue(hex: string, opacity?: number, notify?: boolean): void; open(): void; close(): void;
  /** Ends any eyedropper pick and removes document listeners; call before removing the element. */ destroy(): void;
}
/** Ends the page's eyedropper pick, if any (safe to call anytime). Also window.cancelKitEyedropper. */
export declare function cancelEyedropper(): void;
export declare function ColorSelector(root: Element, options?: ColorSelectorOptions): ColorSelectorController;

/** Shows a black tooltip for every [data-tooltip] under root (default document). Call once. */
export interface TooltipOptions { /** ms before the first tooltip shows; default 400 */ delay?: number; }
export interface TooltipController {
  element: Element; attach(el: Element, text: string, placement?: 'top' | 'bottom' | 'left' | 'right'): Element;
  show(el: Element): void; hide(): void;
}
export declare function Tooltip(root?: ParentNode, options?: TooltipOptions): TooltipController;

export interface SizeValue { width: number; height: number; locked: boolean; }
export interface SizeControlOptions {
  width?: number; height?: number; /** start locked */ locked?: boolean;
  /** default 0 */ min?: number; /** default Infinity */ max?: number; /** decimals, default 0 */ precision?: number;
  /** arrow-key step, default 1 */ step?: number; label?: string;
  onChange?: (value: SizeValue) => void;
}
export interface SizeControlController {
  element: Element; widthInput: HTMLInputElement; heightInput: HTMLInputElement; lockButton: HTMLButtonElement;
  getValue(): SizeValue; /** width / height captured when locked; null if unknown */ getRatio(): number | null;
  setValue(width?: number | null, height?: number | null, notify?: boolean): void;
  getLocked(): boolean; setLocked(locked: boolean, notify?: boolean): void;
}
/** W + H inputs side by side with a lock aspect ratio button (chain / broken chain). */
export declare function SizeControl(root: Element, options?: SizeControlOptions): SizeControlController;

/** window.ComponentUtils */
export declare const utils: {
  parsePx(value: unknown, fallback: number): number; parseMs(value: unknown, fallback: number): number;
  parseOpacity(value: unknown, fallback?: number): number; normalizeHex(value: string): string;
  hexToRgba(hex: string, alpha: number): string; colorWithOpacity(color: string, opacity: unknown): string;
  escapeHtml(value: string): string; bindInputBehavior(input: HTMLInputElement): void; bindInputWrapInputs(root?: ParentNode): void;
  /** ↑/↓ step 1 (Shift 8); options.step or data-arrow-step for fractional */
  bindNumericArrowKey(input: HTMLInputElement, onChange?: OnChange, options?: { isOpacity?: boolean; step?: number }): void;
  loadStylesheet(href: string, id: string): void; loadScript(src: string, id: string): Promise<void>;
};
/** window.ComponentIcons — data-URI SVGs used via <img data-icon="…"> */
export declare const icons: { chevron: string; check: string; 'check-indeterminate': string; /** additions */ upload: string; file: string; image: string; close: string; plus: string; eyedropper: string; link: string; 'link-broken': string };
