/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, InjectionToken, OnChanges, OnDestroy, QueryList, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CdkStepLabel } from './step-label';
/**
 * Position state of the content of each step in stepper that is used for transitioning
 * the content into correct position upon step selection change.
 */
import * as ɵngcc0 from '@angular/core';
export declare type StepContentPositionState = 'previous' | 'current' | 'next';
/** Possible orientation of a stepper. */
export declare type StepperOrientation = 'horizontal' | 'vertical';
/** Change event emitted on selection changes. */
export declare class StepperSelectionEvent {
    /** Index of the step now selected. */
    selectedIndex: number;
    /** Index of the step previously selected. */
    previouslySelectedIndex: number;
    /** The step instance now selected. */
    selectedStep: CdkStep;
    /** The step instance previously selected. */
    previouslySelectedStep: CdkStep;
}
/** The state of each step. */
export declare type StepState = 'number' | 'edit' | 'done' | 'error' | string;
/** Enum to represent the different states of the steps. */
export declare const STEP_STATE: {
    NUMBER: string;
    EDIT: string;
    DONE: string;
    ERROR: string;
};
/** InjectionToken that can be used to specify the global stepper options. */
export declare const STEPPER_GLOBAL_OPTIONS: InjectionToken<StepperOptions>;
/**
 * InjectionToken that can be used to specify the global stepper options.
 * @deprecated Use `STEPPER_GLOBAL_OPTIONS` instead.
 * @breaking-change 8.0.0.
 */
export declare const MAT_STEPPER_GLOBAL_OPTIONS: InjectionToken<StepperOptions>;
/** Configurable options for stepper. */
export interface StepperOptions {
    /**
     * Whether the stepper should display an error state or not.
     * Default behavior is assumed to be false.
     */
    showError?: boolean;
    /**
     * Whether the stepper should display the default indicator type
     * or not.
     * Default behavior is assumed to be true.
     */
    displayDefaultIndicatorType?: boolean;
}
export declare class CdkStep implements OnChanges {
    private _stepper;
    private _stepperOptions;
    _showError: boolean;
    _displayDefaultIndicatorType: boolean;
    /** Template for step label if it exists. */
    stepLabel: CdkStepLabel;
    /** Template for step content. */
    content: TemplateRef<any>;
    /** The top level abstract control of the step. */
    stepControl: AbstractControlLike;
    /** Whether user has seen the expanded step content or not. */
    interacted: boolean;
    /** Plain text label of the step. */
    label: string;
    /** Error message to display when there's an error. */
    errorMessage: string;
    /** Aria label for the tab. */
    ariaLabel: string;
    /**
     * Reference to the element that the tab is labelled by.
     * Will be cleared if `aria-label` is set at the same time.
     */
    ariaLabelledby: string;
    /** State of the step. */
    state: StepState;
    /** Whether the user can return to this step once it has been marked as completed. */
    get editable(): boolean;
    set editable(value: boolean);
    private _editable;
    /** Whether the completion of step is optional. */
    get optional(): boolean;
    set optional(value: boolean);
    private _optional;
    /** Whether step is marked as completed. */
    get completed(): boolean;
    set completed(value: boolean);
    _completedOverride: boolean | null;
    private _getDefaultCompleted;
    /** Whether step has an error. */
    get hasError(): boolean;
    set hasError(value: boolean);
    private _customError;
    private _getDefaultError;
    /** @breaking-change 8.0.0 remove the `?` after `stepperOptions` */
    constructor(_stepper: CdkStepper, stepperOptions?: StepperOptions);
    /** Selects this step component. */
    select(): void;
    /** Resets the step to its initial state. Note that this includes resetting form data. */
    reset(): void;
    ngOnChanges(): void;
    static ngAcceptInputType_editable: BooleanInput;
    static ngAcceptInputType_hasError: BooleanInput;
    static ngAcceptInputType_optional: BooleanInput;
    static ngAcceptInputType_completed: BooleanInput;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CdkStep>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CdkStep, "cdk-step", ["cdkStep"], {
    "editable": "editable";
    "optional": "optional";
    "completed": "completed";
    "hasError": "hasError";
    "stepControl": "stepControl";
    "label": "label";
    "errorMessage": "errorMessage";
    "ariaLabel": "aria-label";
    "ariaLabelledby": "aria-labelledby";
    "state": "state";
}, {}, ["stepLabel"]>;
}
export declare class CdkStepper implements AfterViewInit, OnDestroy {
    private _dir;
    private _changeDetectorRef;
    private _elementRef?;
    /** Emits when the component is destroyed. */
    protected _destroyed: Subject<void>;
    /** Used for managing keyboard focus. */
    private _keyManager;
    /**
     * @breaking-change 8.0.0 Remove `| undefined` once the `_document`
     * constructor param is required.
     */
    private _document;
    /**
     * The list of step components that the stepper is holding.
     * @deprecated use `steps` instead
     * @breaking-change 9.0.0 remove this property
     */
    _steps: QueryList<CdkStep>;
    /** The list of step components that the stepper is holding. */
    get steps(): QueryList<CdkStep>;
    /**
     * The list of step headers of the steps in the stepper.
     * @deprecated Type to be changed to `QueryList<CdkStepHeader>`.
     * @breaking-change 8.0.0
     */
    _stepHeader: QueryList<FocusableOption>;
    /** Whether the validity of previous steps should be checked or not. */
    get linear(): boolean;
    set linear(value: boolean);
    private _linear;
    /** The index of the selected step. */
    get selectedIndex(): number;
    set selectedIndex(index: number);
    private _selectedIndex;
    /** The step that is selected. */
    get selected(): CdkStep;
    set selected(step: CdkStep);
    /** Event emitted when the selected step has changed. */
    selectionChange: EventEmitter<StepperSelectionEvent>;
    /** Used to track unique ID for each stepper component. */
    _groupId: number;
    protected _orientation: StepperOrientation;
    constructor(_dir: Directionality, _changeDetectorRef: ChangeDetectorRef, _elementRef?: ElementRef<HTMLElement> | undefined, _document?: any);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Selects and focuses the next step in list. */
    next(): void;
    /** Selects and focuses the previous step in list. */
    previous(): void;
    /** Resets the stepper to its initial state. Note that this includes clearing form data. */
    reset(): void;
    /** Returns a unique id for each step label element. */
    _getStepLabelId(i: number): string;
    /** Returns unique id for each step content element. */
    _getStepContentId(i: number): string;
    /** Marks the component to be change detected. */
    _stateChanged(): void;
    /** Returns position state of the step with the given index. */
    _getAnimationDirection(index: number): StepContentPositionState;
    /** Returns the type of icon to be displayed. */
    _getIndicatorType(index: number, state?: StepState): StepState;
    private _getDefaultIndicatorLogic;
    private _getGuidelineLogic;
    private _isCurrentStep;
    /** Returns the index of the currently-focused step header. */
    _getFocusIndex(): number | null;
    private _updateSelectedItemIndex;
    _onKeydown(event: KeyboardEvent): void;
    private _anyControlsInvalidOrPending;
    private _layoutDirection;
    /** Checks whether the stepper contains the focused element. */
    private _containsFocus;
    static ngAcceptInputType_editable: BooleanInput;
    static ngAcceptInputType_optional: BooleanInput;
    static ngAcceptInputType_completed: BooleanInput;
    static ngAcceptInputType_hasError: BooleanInput;
    static ngAcceptInputType_linear: BooleanInput;
    static ngAcceptInputType_selectedIndex: NumberInput;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CdkStepper>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<CdkStepper, "[cdkStepper]", ["cdkStepper"], {
    "linear": "linear";
    "selectedIndex": "selectedIndex";
    "selected": "selected";
}, {
    "selectionChange": "selectionChange";
}, ["_steps", "_stepHeader"]>;
}
/**
 * Simplified representation of an "AbstractControl" from @angular/forms.
 * Used to avoid having to bring in @angular/forms for a single optional interface.
 * @docs-private
 */
interface AbstractControlLike {
    asyncValidator: ((control: any) => any) | null;
    dirty: boolean;
    disabled: boolean;
    enabled: boolean;
    errors: {
        [key: string]: any;
    } | null;
    invalid: boolean;
    parent: any;
    pending: boolean;
    pristine: boolean;
    root: AbstractControlLike;
    status: string;
    statusChanges: Observable<any>;
    touched: boolean;
    untouched: boolean;
    updateOn: any;
    valid: boolean;
    validator: ((control: any) => any) | null;
    value: any;
    valueChanges: Observable<any>;
    clearAsyncValidators(): void;
    clearValidators(): void;
    disable(opts?: any): void;
    enable(opts?: any): void;
    get(path: (string | number)[] | string): AbstractControlLike | null;
    getError(errorCode: string, path?: (string | number)[] | string): any;
    hasError(errorCode: string, path?: (string | number)[] | string): boolean;
    markAllAsTouched(): void;
    markAsDirty(opts?: any): void;
    markAsPending(opts?: any): void;
    markAsPristine(opts?: any): void;
    markAsTouched(opts?: any): void;
    markAsUntouched(opts?: any): void;
    patchValue(value: any, options?: Object): void;
    reset(value?: any, options?: Object): void;
    setAsyncValidators(newValidator: (control: any) => any | ((control: any) => any)[] | null): void;
    setErrors(errors: {
        [key: string]: any;
    } | null, opts?: any): void;
    setParent(parent: any): void;
    setValidators(newValidator: (control: any) => any | ((control: any) => any)[] | null): void;
    setValue(value: any, options?: Object): void;
    updateValueAndValidity(opts?: any): void;
    patchValue(value: any, options?: any): void;
    reset(formState?: any, options?: any): void;
    setValue(value: any, options?: any): void;
}
export {};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5kLnRzIiwic291cmNlcyI6WyJzdGVwcGVyLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnRkEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IEZvY3VzYWJsZU9wdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOdW1iZXJJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3Rpb25Ub2tlbiwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIFF1ZXJ5TGlzdCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENka1N0ZXBMYWJlbCB9IGZyb20gJy4vc3RlcC1sYWJlbCc7XG4vKipcbiAqIFBvc2l0aW9uIHN0YXRlIG9mIHRoZSBjb250ZW50IG9mIGVhY2ggc3RlcCBpbiBzdGVwcGVyIHRoYXQgaXMgdXNlZCBmb3IgdHJhbnNpdGlvbmluZ1xuICogdGhlIGNvbnRlbnQgaW50byBjb3JyZWN0IHBvc2l0aW9uIHVwb24gc3RlcCBzZWxlY3Rpb24gY2hhbmdlLlxuICovXG5leHBvcnQgZGVjbGFyZSB0eXBlIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSA9ICdwcmV2aW91cycgfCAnY3VycmVudCcgfCAnbmV4dCc7XG4vKiogUG9zc2libGUgb3JpZW50YXRpb24gb2YgYSBzdGVwcGVyLiAqL1xuZXhwb3J0IGRlY2xhcmUgdHlwZSBTdGVwcGVyT3JpZW50YXRpb24gPSAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnO1xuLyoqIENoYW5nZSBldmVudCBlbWl0dGVkIG9uIHNlbGVjdGlvbiBjaGFuZ2VzLiAqL1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgU3RlcHBlclNlbGVjdGlvbkV2ZW50IHtcbiAgICAvKiogSW5kZXggb2YgdGhlIHN0ZXAgbm93IHNlbGVjdGVkLiAqL1xuICAgIHNlbGVjdGVkSW5kZXg6IG51bWJlcjtcbiAgICAvKiogSW5kZXggb2YgdGhlIHN0ZXAgcHJldmlvdXNseSBzZWxlY3RlZC4gKi9cbiAgICBwcmV2aW91c2x5U2VsZWN0ZWRJbmRleDogbnVtYmVyO1xuICAgIC8qKiBUaGUgc3RlcCBpbnN0YW5jZSBub3cgc2VsZWN0ZWQuICovXG4gICAgc2VsZWN0ZWRTdGVwOiBDZGtTdGVwO1xuICAgIC8qKiBUaGUgc3RlcCBpbnN0YW5jZSBwcmV2aW91c2x5IHNlbGVjdGVkLiAqL1xuICAgIHByZXZpb3VzbHlTZWxlY3RlZFN0ZXA6IENka1N0ZXA7XG59XG4vKiogVGhlIHN0YXRlIG9mIGVhY2ggc3RlcC4gKi9cbmV4cG9ydCBkZWNsYXJlIHR5cGUgU3RlcFN0YXRlID0gJ251bWJlcicgfCAnZWRpdCcgfCAnZG9uZScgfCAnZXJyb3InIHwgc3RyaW5nO1xuLyoqIEVudW0gdG8gcmVwcmVzZW50IHRoZSBkaWZmZXJlbnQgc3RhdGVzIG9mIHRoZSBzdGVwcy4gKi9cbmV4cG9ydCBkZWNsYXJlIGNvbnN0IFNURVBfU1RBVEU6IHtcbiAgICBOVU1CRVI6IHN0cmluZztcbiAgICBFRElUOiBzdHJpbmc7XG4gICAgRE9ORTogc3RyaW5nO1xuICAgIEVSUk9SOiBzdHJpbmc7XG59O1xuLyoqIEluamVjdGlvblRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgZ2xvYmFsIHN0ZXBwZXIgb3B0aW9ucy4gKi9cbmV4cG9ydCBkZWNsYXJlIGNvbnN0IFNURVBQRVJfR0xPQkFMX09QVElPTlM6IEluamVjdGlvblRva2VuPFN0ZXBwZXJPcHRpb25zPjtcbi8qKlxuICogSW5qZWN0aW9uVG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBnbG9iYWwgc3RlcHBlciBvcHRpb25zLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBTVEVQUEVSX0dMT0JBTF9PUFRJT05TYCBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMC5cbiAqL1xuZXhwb3J0IGRlY2xhcmUgY29uc3QgTUFUX1NURVBQRVJfR0xPQkFMX09QVElPTlM6IEluamVjdGlvblRva2VuPFN0ZXBwZXJPcHRpb25zPjtcbi8qKiBDb25maWd1cmFibGUgb3B0aW9ucyBmb3Igc3RlcHBlci4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RlcHBlck9wdGlvbnMge1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIHN0ZXBwZXIgc2hvdWxkIGRpc3BsYXkgYW4gZXJyb3Igc3RhdGUgb3Igbm90LlxuICAgICAqIERlZmF1bHQgYmVoYXZpb3IgaXMgYXNzdW1lZCB0byBiZSBmYWxzZS5cbiAgICAgKi9cbiAgICBzaG93RXJyb3I/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIHN0ZXBwZXIgc2hvdWxkIGRpc3BsYXkgdGhlIGRlZmF1bHQgaW5kaWNhdG9yIHR5cGVcbiAgICAgKiBvciBub3QuXG4gICAgICogRGVmYXVsdCBiZWhhdmlvciBpcyBhc3N1bWVkIHRvIGJlIHRydWUuXG4gICAgICovXG4gICAgZGlzcGxheURlZmF1bHRJbmRpY2F0b3JUeXBlPzogYm9vbGVhbjtcbn1cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIENka1N0ZXAgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICAgIHByaXZhdGUgX3N0ZXBwZXI7XG4gICAgcHJpdmF0ZSBfc3RlcHBlck9wdGlvbnM7XG4gICAgX3Nob3dFcnJvcjogYm9vbGVhbjtcbiAgICBfZGlzcGxheURlZmF1bHRJbmRpY2F0b3JUeXBlOiBib29sZWFuO1xuICAgIC8qKiBUZW1wbGF0ZSBmb3Igc3RlcCBsYWJlbCBpZiBpdCBleGlzdHMuICovXG4gICAgc3RlcExhYmVsOiBDZGtTdGVwTGFiZWw7XG4gICAgLyoqIFRlbXBsYXRlIGZvciBzdGVwIGNvbnRlbnQuICovXG4gICAgY29udGVudDogVGVtcGxhdGVSZWY8YW55PjtcbiAgICAvKiogVGhlIHRvcCBsZXZlbCBhYnN0cmFjdCBjb250cm9sIG9mIHRoZSBzdGVwLiAqL1xuICAgIHN0ZXBDb250cm9sOiBBYnN0cmFjdENvbnRyb2xMaWtlO1xuICAgIC8qKiBXaGV0aGVyIHVzZXIgaGFzIHNlZW4gdGhlIGV4cGFuZGVkIHN0ZXAgY29udGVudCBvciBub3QuICovXG4gICAgaW50ZXJhY3RlZDogYm9vbGVhbjtcbiAgICAvKiogUGxhaW4gdGV4dCBsYWJlbCBvZiB0aGUgc3RlcC4gKi9cbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIC8qKiBFcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkgd2hlbiB0aGVyZSdzIGFuIGVycm9yLiAqL1xuICAgIGVycm9yTWVzc2FnZTogc3RyaW5nO1xuICAgIC8qKiBBcmlhIGxhYmVsIGZvciB0aGUgdGFiLiAqL1xuICAgIGFyaWFMYWJlbDogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIFJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCB0aGF0IHRoZSB0YWIgaXMgbGFiZWxsZWQgYnkuXG4gICAgICogV2lsbCBiZSBjbGVhcmVkIGlmIGBhcmlhLWxhYmVsYCBpcyBzZXQgYXQgdGhlIHNhbWUgdGltZS5cbiAgICAgKi9cbiAgICBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuICAgIC8qKiBTdGF0ZSBvZiB0aGUgc3RlcC4gKi9cbiAgICBzdGF0ZTogU3RlcFN0YXRlO1xuICAgIC8qKiBXaGV0aGVyIHRoZSB1c2VyIGNhbiByZXR1cm4gdG8gdGhpcyBzdGVwIG9uY2UgaXQgaGFzIGJlZW4gbWFya2VkIGFzIGNvbXBsZXRlZC4gKi9cbiAgICBnZXQgZWRpdGFibGUoKTogYm9vbGVhbjtcbiAgICBzZXQgZWRpdGFibGUodmFsdWU6IGJvb2xlYW4pO1xuICAgIHByaXZhdGUgX2VkaXRhYmxlO1xuICAgIC8qKiBXaGV0aGVyIHRoZSBjb21wbGV0aW9uIG9mIHN0ZXAgaXMgb3B0aW9uYWwuICovXG4gICAgZ2V0IG9wdGlvbmFsKCk6IGJvb2xlYW47XG4gICAgc2V0IG9wdGlvbmFsKHZhbHVlOiBib29sZWFuKTtcbiAgICBwcml2YXRlIF9vcHRpb25hbDtcbiAgICAvKiogV2hldGhlciBzdGVwIGlzIG1hcmtlZCBhcyBjb21wbGV0ZWQuICovXG4gICAgZ2V0IGNvbXBsZXRlZCgpOiBib29sZWFuO1xuICAgIHNldCBjb21wbGV0ZWQodmFsdWU6IGJvb2xlYW4pO1xuICAgIF9jb21wbGV0ZWRPdmVycmlkZTogYm9vbGVhbiB8IG51bGw7XG4gICAgcHJpdmF0ZSBfZ2V0RGVmYXVsdENvbXBsZXRlZDtcbiAgICAvKiogV2hldGhlciBzdGVwIGhhcyBhbiBlcnJvci4gKi9cbiAgICBnZXQgaGFzRXJyb3IoKTogYm9vbGVhbjtcbiAgICBzZXQgaGFzRXJyb3IodmFsdWU6IGJvb2xlYW4pO1xuICAgIHByaXZhdGUgX2N1c3RvbUVycm9yO1xuICAgIHByaXZhdGUgX2dldERlZmF1bHRFcnJvcjtcbiAgICAvKiogQGJyZWFraW5nLWNoYW5nZSA4LjAuMCByZW1vdmUgdGhlIGA/YCBhZnRlciBgc3RlcHBlck9wdGlvbnNgICovXG4gICAgY29uc3RydWN0b3IoX3N0ZXBwZXI6IENka1N0ZXBwZXIsIHN0ZXBwZXJPcHRpb25zPzogU3RlcHBlck9wdGlvbnMpO1xuICAgIC8qKiBTZWxlY3RzIHRoaXMgc3RlcCBjb21wb25lbnQuICovXG4gICAgc2VsZWN0KCk6IHZvaWQ7XG4gICAgLyoqIFJlc2V0cyB0aGUgc3RlcCB0byBpdHMgaW5pdGlhbCBzdGF0ZS4gTm90ZSB0aGF0IHRoaXMgaW5jbHVkZXMgcmVzZXR0aW5nIGZvcm0gZGF0YS4gKi9cbiAgICByZXNldCgpOiB2b2lkO1xuICAgIG5nT25DaGFuZ2VzKCk6IHZvaWQ7XG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2VkaXRhYmxlOiBCb29sZWFuSW5wdXQ7XG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hhc0Vycm9yOiBCb29sZWFuSW5wdXQ7XG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX29wdGlvbmFsOiBCb29sZWFuSW5wdXQ7XG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbXBsZXRlZDogQm9vbGVhbklucHV0O1xufVxuZXhwb3J0IGRlY2xhcmUgY2xhc3MgQ2RrU3RlcHBlciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSBfZGlyO1xuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmO1xuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY/O1xuICAgIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICAgIHByb3RlY3RlZCBfZGVzdHJveWVkOiBTdWJqZWN0PHZvaWQ+O1xuICAgIC8qKiBVc2VkIGZvciBtYW5hZ2luZyBrZXlib2FyZCBmb2N1cy4gKi9cbiAgICBwcml2YXRlIF9rZXlNYW5hZ2VyO1xuICAgIC8qKlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgUmVtb3ZlIGB8IHVuZGVmaW5lZGAgb25jZSB0aGUgYF9kb2N1bWVudGBcbiAgICAgKiBjb25zdHJ1Y3RvciBwYXJhbSBpcyByZXF1aXJlZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9kb2N1bWVudDtcbiAgICAvKipcbiAgICAgKiBUaGUgbGlzdCBvZiBzdGVwIGNvbXBvbmVudHMgdGhhdCB0aGUgc3RlcHBlciBpcyBob2xkaW5nLlxuICAgICAqIEBkZXByZWNhdGVkIHVzZSBgc3RlcHNgIGluc3RlYWRcbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIHJlbW92ZSB0aGlzIHByb3BlcnR5XG4gICAgICovXG4gICAgX3N0ZXBzOiBRdWVyeUxpc3Q8Q2RrU3RlcD47XG4gICAgLyoqIFRoZSBsaXN0IG9mIHN0ZXAgY29tcG9uZW50cyB0aGF0IHRoZSBzdGVwcGVyIGlzIGhvbGRpbmcuICovXG4gICAgZ2V0IHN0ZXBzKCk6IFF1ZXJ5TGlzdDxDZGtTdGVwPjtcbiAgICAvKipcbiAgICAgKiBUaGUgbGlzdCBvZiBzdGVwIGhlYWRlcnMgb2YgdGhlIHN0ZXBzIGluIHRoZSBzdGVwcGVyLlxuICAgICAqIEBkZXByZWNhdGVkIFR5cGUgdG8gYmUgY2hhbmdlZCB0byBgUXVlcnlMaXN0PENka1N0ZXBIZWFkZXI+YC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICovXG4gICAgX3N0ZXBIZWFkZXI6IFF1ZXJ5TGlzdDxGb2N1c2FibGVPcHRpb24+O1xuICAgIC8qKiBXaGV0aGVyIHRoZSB2YWxpZGl0eSBvZiBwcmV2aW91cyBzdGVwcyBzaG91bGQgYmUgY2hlY2tlZCBvciBub3QuICovXG4gICAgZ2V0IGxpbmVhcigpOiBib29sZWFuO1xuICAgIHNldCBsaW5lYXIodmFsdWU6IGJvb2xlYW4pO1xuICAgIHByaXZhdGUgX2xpbmVhcjtcbiAgICAvKiogVGhlIGluZGV4IG9mIHRoZSBzZWxlY3RlZCBzdGVwLiAqL1xuICAgIGdldCBzZWxlY3RlZEluZGV4KCk6IG51bWJlcjtcbiAgICBzZXQgc2VsZWN0ZWRJbmRleChpbmRleDogbnVtYmVyKTtcbiAgICBwcml2YXRlIF9zZWxlY3RlZEluZGV4O1xuICAgIC8qKiBUaGUgc3RlcCB0aGF0IGlzIHNlbGVjdGVkLiAqL1xuICAgIGdldCBzZWxlY3RlZCgpOiBDZGtTdGVwO1xuICAgIHNldCBzZWxlY3RlZChzdGVwOiBDZGtTdGVwKTtcbiAgICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3RlZCBzdGVwIGhhcyBjaGFuZ2VkLiAqL1xuICAgIHNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPFN0ZXBwZXJTZWxlY3Rpb25FdmVudD47XG4gICAgLyoqIFVzZWQgdG8gdHJhY2sgdW5pcXVlIElEIGZvciBlYWNoIHN0ZXBwZXIgY29tcG9uZW50LiAqL1xuICAgIF9ncm91cElkOiBudW1iZXI7XG4gICAgcHJvdGVjdGVkIF9vcmllbnRhdGlvbjogU3RlcHBlck9yaWVudGF0aW9uO1xuICAgIGNvbnN0cnVjdG9yKF9kaXI6IERpcmVjdGlvbmFsaXR5LCBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLCBfZWxlbWVudFJlZj86IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+IHwgdW5kZWZpbmVkLCBfZG9jdW1lbnQ/OiBhbnkpO1xuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG4gICAgLyoqIFNlbGVjdHMgYW5kIGZvY3VzZXMgdGhlIG5leHQgc3RlcCBpbiBsaXN0LiAqL1xuICAgIG5leHQoKTogdm9pZDtcbiAgICAvKiogU2VsZWN0cyBhbmQgZm9jdXNlcyB0aGUgcHJldmlvdXMgc3RlcCBpbiBsaXN0LiAqL1xuICAgIHByZXZpb3VzKCk6IHZvaWQ7XG4gICAgLyoqIFJlc2V0cyB0aGUgc3RlcHBlciB0byBpdHMgaW5pdGlhbCBzdGF0ZS4gTm90ZSB0aGF0IHRoaXMgaW5jbHVkZXMgY2xlYXJpbmcgZm9ybSBkYXRhLiAqL1xuICAgIHJlc2V0KCk6IHZvaWQ7XG4gICAgLyoqIFJldHVybnMgYSB1bmlxdWUgaWQgZm9yIGVhY2ggc3RlcCBsYWJlbCBlbGVtZW50LiAqL1xuICAgIF9nZXRTdGVwTGFiZWxJZChpOiBudW1iZXIpOiBzdHJpbmc7XG4gICAgLyoqIFJldHVybnMgdW5pcXVlIGlkIGZvciBlYWNoIHN0ZXAgY29udGVudCBlbGVtZW50LiAqL1xuICAgIF9nZXRTdGVwQ29udGVudElkKGk6IG51bWJlcik6IHN0cmluZztcbiAgICAvKiogTWFya3MgdGhlIGNvbXBvbmVudCB0byBiZSBjaGFuZ2UgZGV0ZWN0ZWQuICovXG4gICAgX3N0YXRlQ2hhbmdlZCgpOiB2b2lkO1xuICAgIC8qKiBSZXR1cm5zIHBvc2l0aW9uIHN0YXRlIG9mIHRoZSBzdGVwIHdpdGggdGhlIGdpdmVuIGluZGV4LiAqL1xuICAgIF9nZXRBbmltYXRpb25EaXJlY3Rpb24oaW5kZXg6IG51bWJlcik6IFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZTtcbiAgICAvKiogUmV0dXJucyB0aGUgdHlwZSBvZiBpY29uIHRvIGJlIGRpc3BsYXllZC4gKi9cbiAgICBfZ2V0SW5kaWNhdG9yVHlwZShpbmRleDogbnVtYmVyLCBzdGF0ZT86IFN0ZXBTdGF0ZSk6IFN0ZXBTdGF0ZTtcbiAgICBwcml2YXRlIF9nZXREZWZhdWx0SW5kaWNhdG9yTG9naWM7XG4gICAgcHJpdmF0ZSBfZ2V0R3VpZGVsaW5lTG9naWM7XG4gICAgcHJpdmF0ZSBfaXNDdXJyZW50U3RlcDtcbiAgICAvKiogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnRseS1mb2N1c2VkIHN0ZXAgaGVhZGVyLiAqL1xuICAgIF9nZXRGb2N1c0luZGV4KCk6IG51bWJlciB8IG51bGw7XG4gICAgcHJpdmF0ZSBfdXBkYXRlU2VsZWN0ZWRJdGVtSW5kZXg7XG4gICAgX29uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQ7XG4gICAgcHJpdmF0ZSBfYW55Q29udHJvbHNJbnZhbGlkT3JQZW5kaW5nO1xuICAgIHByaXZhdGUgX2xheW91dERpcmVjdGlvbjtcbiAgICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIHN0ZXBwZXIgY29udGFpbnMgdGhlIGZvY3VzZWQgZWxlbWVudC4gKi9cbiAgICBwcml2YXRlIF9jb250YWluc0ZvY3VzO1xuICAgIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9lZGl0YWJsZTogQm9vbGVhbklucHV0O1xuICAgIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcHRpb25hbDogQm9vbGVhbklucHV0O1xuICAgIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb21wbGV0ZWQ6IEJvb2xlYW5JbnB1dDtcbiAgICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzRXJyb3I6IEJvb2xlYW5JbnB1dDtcbiAgICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbGluZWFyOiBCb29sZWFuSW5wdXQ7XG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkSW5kZXg6IE51bWJlcklucHV0O1xufVxuLyoqXG4gKiBTaW1wbGlmaWVkIHJlcHJlc2VudGF0aW9uIG9mIGFuIFwiQWJzdHJhY3RDb250cm9sXCIgZnJvbSBAYW5ndWxhci9mb3Jtcy5cbiAqIFVzZWQgdG8gYXZvaWQgaGF2aW5nIHRvIGJyaW5nIGluIEBhbmd1bGFyL2Zvcm1zIGZvciBhIHNpbmdsZSBvcHRpb25hbCBpbnRlcmZhY2UuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmludGVyZmFjZSBBYnN0cmFjdENvbnRyb2xMaWtlIHtcbiAgICBhc3luY1ZhbGlkYXRvcjogKChjb250cm9sOiBhbnkpID0+IGFueSkgfCBudWxsO1xuICAgIGRpcnR5OiBib29sZWFuO1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIGVuYWJsZWQ6IGJvb2xlYW47XG4gICAgZXJyb3JzOiB7XG4gICAgICAgIFtrZXk6IHN0cmluZ106IGFueTtcbiAgICB9IHwgbnVsbDtcbiAgICBpbnZhbGlkOiBib29sZWFuO1xuICAgIHBhcmVudDogYW55O1xuICAgIHBlbmRpbmc6IGJvb2xlYW47XG4gICAgcHJpc3RpbmU6IGJvb2xlYW47XG4gICAgcm9vdDogQWJzdHJhY3RDb250cm9sTGlrZTtcbiAgICBzdGF0dXM6IHN0cmluZztcbiAgICBzdGF0dXNDaGFuZ2VzOiBPYnNlcnZhYmxlPGFueT47XG4gICAgdG91Y2hlZDogYm9vbGVhbjtcbiAgICB1bnRvdWNoZWQ6IGJvb2xlYW47XG4gICAgdXBkYXRlT246IGFueTtcbiAgICB2YWxpZDogYm9vbGVhbjtcbiAgICB2YWxpZGF0b3I6ICgoY29udHJvbDogYW55KSA9PiBhbnkpIHwgbnVsbDtcbiAgICB2YWx1ZTogYW55O1xuICAgIHZhbHVlQ2hhbmdlczogT2JzZXJ2YWJsZTxhbnk+O1xuICAgIGNsZWFyQXN5bmNWYWxpZGF0b3JzKCk6IHZvaWQ7XG4gICAgY2xlYXJWYWxpZGF0b3JzKCk6IHZvaWQ7XG4gICAgZGlzYWJsZShvcHRzPzogYW55KTogdm9pZDtcbiAgICBlbmFibGUob3B0cz86IGFueSk6IHZvaWQ7XG4gICAgZ2V0KHBhdGg6IChzdHJpbmcgfCBudW1iZXIpW10gfCBzdHJpbmcpOiBBYnN0cmFjdENvbnRyb2xMaWtlIHwgbnVsbDtcbiAgICBnZXRFcnJvcihlcnJvckNvZGU6IHN0cmluZywgcGF0aD86IChzdHJpbmcgfCBudW1iZXIpW10gfCBzdHJpbmcpOiBhbnk7XG4gICAgaGFzRXJyb3IoZXJyb3JDb2RlOiBzdHJpbmcsIHBhdGg/OiAoc3RyaW5nIHwgbnVtYmVyKVtdIHwgc3RyaW5nKTogYm9vbGVhbjtcbiAgICBtYXJrQWxsQXNUb3VjaGVkKCk6IHZvaWQ7XG4gICAgbWFya0FzRGlydHkob3B0cz86IGFueSk6IHZvaWQ7XG4gICAgbWFya0FzUGVuZGluZyhvcHRzPzogYW55KTogdm9pZDtcbiAgICBtYXJrQXNQcmlzdGluZShvcHRzPzogYW55KTogdm9pZDtcbiAgICBtYXJrQXNUb3VjaGVkKG9wdHM/OiBhbnkpOiB2b2lkO1xuICAgIG1hcmtBc1VudG91Y2hlZChvcHRzPzogYW55KTogdm9pZDtcbiAgICBwYXRjaFZhbHVlKHZhbHVlOiBhbnksIG9wdGlvbnM/OiBPYmplY3QpOiB2b2lkO1xuICAgIHJlc2V0KHZhbHVlPzogYW55LCBvcHRpb25zPzogT2JqZWN0KTogdm9pZDtcbiAgICBzZXRBc3luY1ZhbGlkYXRvcnMobmV3VmFsaWRhdG9yOiAoY29udHJvbDogYW55KSA9PiBhbnkgfCAoKGNvbnRyb2w6IGFueSkgPT4gYW55KVtdIHwgbnVsbCk6IHZvaWQ7XG4gICAgc2V0RXJyb3JzKGVycm9yczoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XG4gICAgfSB8IG51bGwsIG9wdHM/OiBhbnkpOiB2b2lkO1xuICAgIHNldFBhcmVudChwYXJlbnQ6IGFueSk6IHZvaWQ7XG4gICAgc2V0VmFsaWRhdG9ycyhuZXdWYWxpZGF0b3I6IChjb250cm9sOiBhbnkpID0+IGFueSB8ICgoY29udHJvbDogYW55KSA9PiBhbnkpW10gfCBudWxsKTogdm9pZDtcbiAgICBzZXRWYWx1ZSh2YWx1ZTogYW55LCBvcHRpb25zPzogT2JqZWN0KTogdm9pZDtcbiAgICB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHM/OiBhbnkpOiB2b2lkO1xuICAgIHBhdGNoVmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IGFueSk6IHZvaWQ7XG4gICAgcmVzZXQoZm9ybVN0YXRlPzogYW55LCBvcHRpb25zPzogYW55KTogdm9pZDtcbiAgICBzZXRWYWx1ZSh2YWx1ZTogYW55LCBvcHRpb25zPzogYW55KTogdm9pZDtcbn1cbmV4cG9ydCB7fTtcbiJdfQ==