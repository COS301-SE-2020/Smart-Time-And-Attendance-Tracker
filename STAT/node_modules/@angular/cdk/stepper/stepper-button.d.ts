/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkStepper } from './stepper';
/** Button that moves to the next step in a stepper workflow. */
import * as ɵngcc0 from '@angular/core';
export declare class CdkStepperNext {
    _stepper: CdkStepper;
    /** Type of the next button. Defaults to "submit" if not specified. */
    type: string;
    constructor(_stepper: CdkStepper);
    _handleClick(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CdkStepperNext>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<CdkStepperNext, "button[cdkStepperNext]", never, {
    "type": "type";
}, {}, never>;
}
/** Button that moves to the previous step in a stepper workflow. */
export declare class CdkStepperPrevious {
    _stepper: CdkStepper;
    /** Type of the previous button. Defaults to "button" if not specified. */
    type: string;
    constructor(_stepper: CdkStepper);
    _handleClick(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CdkStepperPrevious>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<CdkStepperPrevious, "button[cdkStepperPrevious]", never, {
    "type": "type";
}, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1idXR0b24uZC50cyIsInNvdXJjZXMiOlsic3RlcHBlci1idXR0b24uZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQVNBOzs7Ozs7Ozs7O0FBTUE7Ozs7Ozs7Ozs7OztBQVFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBDZGtTdGVwcGVyIH0gZnJvbSAnLi9zdGVwcGVyJztcbi8qKiBCdXR0b24gdGhhdCBtb3ZlcyB0byB0aGUgbmV4dCBzdGVwIGluIGEgc3RlcHBlciB3b3JrZmxvdy4gKi9cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIENka1N0ZXBwZXJOZXh0IHtcbiAgICBfc3RlcHBlcjogQ2RrU3RlcHBlcjtcbiAgICAvKiogVHlwZSBvZiB0aGUgbmV4dCBidXR0b24uIERlZmF1bHRzIHRvIFwic3VibWl0XCIgaWYgbm90IHNwZWNpZmllZC4gKi9cbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoX3N0ZXBwZXI6IENka1N0ZXBwZXIpO1xuICAgIF9oYW5kbGVDbGljaygpOiB2b2lkO1xufVxuLyoqIEJ1dHRvbiB0aGF0IG1vdmVzIHRvIHRoZSBwcmV2aW91cyBzdGVwIGluIGEgc3RlcHBlciB3b3JrZmxvdy4gKi9cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIENka1N0ZXBwZXJQcmV2aW91cyB7XG4gICAgX3N0ZXBwZXI6IENka1N0ZXBwZXI7XG4gICAgLyoqIFR5cGUgb2YgdGhlIHByZXZpb3VzIGJ1dHRvbi4gRGVmYXVsdHMgdG8gXCJidXR0b25cIiBpZiBub3Qgc3BlY2lmaWVkLiAqL1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBjb25zdHJ1Y3Rvcihfc3RlcHBlcjogQ2RrU3RlcHBlcik7XG4gICAgX2hhbmRsZUNsaWNrKCk6IHZvaWQ7XG59XG4iXX0=