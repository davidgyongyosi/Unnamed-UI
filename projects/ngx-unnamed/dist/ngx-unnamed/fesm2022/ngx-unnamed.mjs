import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { inject, NgZone, ElementRef, ChangeDetectorRef, Renderer2, booleanAttribute, Input, ContentChild, ViewEncapsulation, Component, signal, input, Directive } from '@angular/core';
import { Subject, fromEvent, takeUntil, startWith } from 'rxjs';
import { NxIconDirective } from 'ngx-unnamed-icons';
import { NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith as startWith$1 } from 'rxjs/operators';

class ButtonComponent {
    nzIconDirectiveElement;
    nxVariant = 'primary';
    nxShape = null;
    nxSize = 'default';
    nxLoading = false;
    disabled = false;
    ghost = false;
    danger = false;
    nxBlock = false;
    tabIndex = null;
    destroy$ = new Subject();
    loading$ = new Subject();
    ngZone = inject(NgZone);
    elementRef = inject(ElementRef);
    cdr = inject(ChangeDetectorRef);
    renderer = inject(Renderer2);
    ngOnInit() {
        this.ngZone.runOutsideAngular(() => {
            fromEvent(this.elementRef.nativeElement, 'click', { capture: true })
                .pipe(takeUntil(this.destroy$))
                .subscribe((event) => {
                if ((this.disabled && event.target?.tagName === 'A') || this.nxLoading) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            });
        });
    }
    ngOnChanges(changes) {
        const { nxLoading } = changes;
        if (nxLoading) {
            this.loading$.next(this.nxLoading);
        }
    }
    ngAfterViewInit() {
        this.insertSpan(this.elementRef.nativeElement.childNodes, this.renderer);
    }
    insertSpan(nodes, renderer) {
        nodes.forEach((node) => {
            if (node.nodeName === '#text') {
                const span = renderer.createElement('span');
                const parent = renderer.parentNode(node);
                renderer.insertBefore(parent, span, node);
                renderer.appendChild(span, node);
            }
        });
    }
    ngAfterContentInit() {
        this.loading$
            .pipe(startWith(this.nxLoading), 
        //filter(() => !!this.nzIconDirectiveElement),
        takeUntil(this.destroy$))
            .subscribe((loading) => {
            /*const nativeElement = this.nzIconDirectiveElement.nativeElement;
    if (loading) {
      this.renderer.setStyle(nativeElement, 'display', 'none');
    } else {
      this.renderer.removeStyle(nativeElement, 'display');
    }*/
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.1.7", ngImport: i0, type: ButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.1.7", type: ButtonComponent, isStandalone: true, selector: "button[nx-button], a[nx-button]", inputs: { nxVariant: "nxVariant", nxShape: "nxShape", nxSize: "nxSize", nxLoading: ["nxLoading", "nxLoading", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute], ghost: ["ghost", "ghost", booleanAttribute], danger: ["danger", "danger", booleanAttribute], nxBlock: ["nxBlock", "nxBlock", booleanAttribute], tabIndex: "tabIndex" }, host: { properties: { "class.nx-btn-primary": "nxVariant === 'primary'", "class.nx-btn-secondary": "nxVariant === 'secondary'", "class.nx-btn-danger": "nxVariant === 'danger'", "class.nx-btn-outline": "nxVariant === 'outline'", "class.nx-btn-ghost": "nxVariant === 'ghost'", "class.nx-btn-link": "nxVariant === 'link'", "class.nx-btn-dashed": "nxVariant === 'dashed'", "class.nx-btn-circle": "nxShape === 'circle'", "class.nx-btn-round": "nxShape === 'round'", "class.nx-btn-lg": "nxSize === 'large'", "class.nx-btn-sm": "nxSize === 'small'", "class.nx-btn-block": "nxBlock", "attr.tabindex": "disabled ? -1 : (tabIndex === null ? null : tabIndex)", "attr.disabled": "disabled || null" }, classAttribute: "nx-btn" }, queries: [{ propertyName: "nzIconDirectiveElement", first: true, predicate: NxIconDirective, descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: `
        @if (nxLoading) {
            <span class="spinner"></span>
        }
        <ng-content></ng-content>
    `, isInline: true, styles: [":root{--primary-color: #000000;--secondary-color: #f5f5f6;--danger-color: #ef4444;--hover-color: #f1f1f3}.nx-btn{display:inline-flex;align-items:center;justify-content:center;padding:0 15px;height:35px;font-size:14px;border:none;cursor:pointer;transition:all .3s ease-in-out;border-radius:6px;width:auto;max-width:fit-content}.nx-btn.nx-btn-primary{background-color:#000;color:#fff;border-color:#1890ff}.nx-btn.nx-btn-primary:hover{background-color:#333}.nx-btn.nx-btn-primary[disabled],.nx-btn.nx-btn-primary[disabled]:hover{background:#f5f5f6}.nx-btn.nx-btn-secondary{background-color:#f5f5f6;color:#000;border-color:#1890ff}.nx-btn.nx-btn-secondary:hover{background-color:#f1f1f3}.nx-btn.nx-btn-secondary[disabled],.nx-btn.nx-btn-secondary[disabled]:hover{background:#f5f5f6}.nx-btn.nx-btn-dashed{border:1px dashed rgb(191.3157894737,191.3157894737,197.6842105263);background-color:#fff;color:#000000d9}.nx-btn.nx-btn-dashed:hover{background-color:#f1f1f3}.nx-btn.nx-btn-dashed[disabled],.nx-btn.nx-btn-dashed[disabled]:hover{background:#f5f5f6}.nx-btn.nx-btn-danger{background-color:#ef4444;color:#f5f5f6;border-color:#ef4444}.nx-btn.nx-btn-danger:hover{background-color:#bd1010}.nx-btn.nx-btn-danger[disabled],.nx-btn.nx-btn-danger[disabled]:hover{background:#f5f5f6}.nx-btn.nx-btn-outline{background-color:transparent;color:#000;border:1px solid rgb(191.3157894737,191.3157894737,197.6842105263)}.nx-btn.nx-btn-outline:hover{background-color:#f1f1f3}.nx-btn.nx-btn-outline[disabled],.nx-btn.nx-btn-outline[disabled]:hover{background:#f5f5f6}.nx-btn.nx-btn-ghost{background-color:transparent;color:#000}.nx-btn.nx-btn-ghost:hover{background-color:#f1f1f3}.nx-btn.nx-btn-ghost[disabled]:hover{background:none}.nx-btn.nx-btn-link{background:none;border:none;color:#000}.nx-btn.nx-btn-link:hover{text-decoration:underline}.nx-btn.nx-btn-link[disabled]{background:none}.nx-btn.nx-btn-link[disabled]:hover{text-decoration:none}.nx-btn.nx-btn-lg{height:40px;padding:0 20px}.nx-btn.nx-btn-sm{height:30px;padding:0 10px}.nx-btn.nx-btn-round{border-radius:20px}.nx-btn.nx-btn-circle{border-radius:50%;padding:0;width:40px;height:40px}.nx-btn.nx-btn-block{display:block;width:100%;max-width:100%}.nx-btn[disabled]{cursor:not-allowed;color:#babac4}.nx-btn:active:not([disabled]){transform:scale(.95);transition:transform .1s ease-in-out}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.1.7", ngImport: i0, type: ButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'button[nx-button], a[nx-button]', imports: [CommonModule], standalone: true, template: `
        @if (nxLoading) {
            <span class="spinner"></span>
        }
        <ng-content></ng-content>
    `, encapsulation: ViewEncapsulation.None, host: {
                        class: 'nx-btn',
                        '[class.nx-btn-primary]': `nxVariant === 'primary'`,
                        '[class.nx-btn-secondary]': `nxVariant === 'secondary'`,
                        '[class.nx-btn-danger]': `nxVariant === 'danger'`,
                        '[class.nx-btn-outline]': `nxVariant === 'outline'`,
                        '[class.nx-btn-ghost]': `nxVariant === 'ghost'`,
                        '[class.nx-btn-link]': `nxVariant === 'link'`,
                        '[class.nx-btn-dashed]': `nxVariant === 'dashed'`,
                        '[class.nx-btn-circle]': `nxShape === 'circle'`,
                        '[class.nx-btn-round]': `nxShape === 'round'`,
                        '[class.nx-btn-lg]': `nxSize === 'large'`,
                        '[class.nx-btn-sm]': `nxSize === 'small'`,
                        '[class.nx-btn-block]': `nxBlock`,
                        '[attr.tabindex]': 'disabled ? -1 : (tabIndex === null ? null : tabIndex)',
                        '[attr.disabled]': 'disabled || null',
                    }, styles: [":root{--primary-color: #000000;--secondary-color: #f5f5f6;--danger-color: #ef4444;--hover-color: #f1f1f3}.nx-btn{display:inline-flex;align-items:center;justify-content:center;padding:0 15px;height:35px;font-size:14px;border:none;cursor:pointer;transition:all .3s ease-in-out;border-radius:6px;width:auto;max-width:fit-content}.nx-btn.nx-btn-primary{background-color:#000;color:#fff;border-color:#1890ff}.nx-btn.nx-btn-primary:hover{background-color:#333}.nx-btn.nx-btn-primary[disabled],.nx-btn.nx-btn-primary[disabled]:hover{background:#f5f5f6}.nx-btn.nx-btn-secondary{background-color:#f5f5f6;color:#000;border-color:#1890ff}.nx-btn.nx-btn-secondary:hover{background-color:#f1f1f3}.nx-btn.nx-btn-secondary[disabled],.nx-btn.nx-btn-secondary[disabled]:hover{background:#f5f5f6}.nx-btn.nx-btn-dashed{border:1px dashed rgb(191.3157894737,191.3157894737,197.6842105263);background-color:#fff;color:#000000d9}.nx-btn.nx-btn-dashed:hover{background-color:#f1f1f3}.nx-btn.nx-btn-dashed[disabled],.nx-btn.nx-btn-dashed[disabled]:hover{background:#f5f5f6}.nx-btn.nx-btn-danger{background-color:#ef4444;color:#f5f5f6;border-color:#ef4444}.nx-btn.nx-btn-danger:hover{background-color:#bd1010}.nx-btn.nx-btn-danger[disabled],.nx-btn.nx-btn-danger[disabled]:hover{background:#f5f5f6}.nx-btn.nx-btn-outline{background-color:transparent;color:#000;border:1px solid rgb(191.3157894737,191.3157894737,197.6842105263)}.nx-btn.nx-btn-outline:hover{background-color:#f1f1f3}.nx-btn.nx-btn-outline[disabled],.nx-btn.nx-btn-outline[disabled]:hover{background:#f5f5f6}.nx-btn.nx-btn-ghost{background-color:transparent;color:#000}.nx-btn.nx-btn-ghost:hover{background-color:#f1f1f3}.nx-btn.nx-btn-ghost[disabled]:hover{background:none}.nx-btn.nx-btn-link{background:none;border:none;color:#000}.nx-btn.nx-btn-link:hover{text-decoration:underline}.nx-btn.nx-btn-link[disabled]{background:none}.nx-btn.nx-btn-link[disabled]:hover{text-decoration:none}.nx-btn.nx-btn-lg{height:40px;padding:0 20px}.nx-btn.nx-btn-sm{height:30px;padding:0 10px}.nx-btn.nx-btn-round{border-radius:20px}.nx-btn.nx-btn-circle{border-radius:50%;padding:0;width:40px;height:40px}.nx-btn.nx-btn-block{display:block;width:100%;max-width:100%}.nx-btn[disabled]{cursor:not-allowed;color:#babac4}.nx-btn:active:not([disabled]){transform:scale(.95);transition:transform .1s ease-in-out}\n"] }]
        }], propDecorators: { nzIconDirectiveElement: [{
                type: ContentChild,
                args: [NxIconDirective, { read: ElementRef }]
            }], nxVariant: [{
                type: Input
            }], nxShape: [{
                type: Input
            }], nxSize: [{
                type: Input
            }], nxLoading: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], ghost: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], danger: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], nxBlock: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], tabIndex: [{
                type: Input
            }] } });

var button_component = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ButtonComponent: ButtonComponent
});

class InputDirective {
    elementRef = inject(ElementRef);
    ngControl = inject(NgControl, { self: true, optional: true });
    value = signal(this.elementRef.nativeElement.value, ...(ngDevMode ? [{ debugName: "value" }] : []));
    nxVariant = input('outlined', ...(ngDevMode ? [{ debugName: "nxVariant" }] : []));
    nxSize = input('default', ...(ngDevMode ? [{ debugName: "nxSize" }] : []));
    nxStatus = input('', ...(ngDevMode ? [{ debugName: "nxStatus" }] : []));
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    readonly = input(false, ...(ngDevMode ? [{ debugName: "readonly", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    controlDisabled = signal(false, ...(ngDevMode ? [{ debugName: "controlDisabled" }] : []));
    finalDisabled = this.ngControl ? this.controlDisabled : this.disabled;
    ngOnInit() {
        // Track form control disabled state
        this.ngControl?.statusChanges?.pipe(startWith$1(null), takeUntilDestroyed()).subscribe(() => {
            this.controlDisabled.set(!!this.ngControl.disabled);
        });
        // Track form control value changes
        this.ngControl?.valueChanges?.pipe(takeUntilDestroyed()).subscribe((value) => {
            this.value.set(value);
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.1.7", ngImport: i0, type: InputDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.1.7", type: InputDirective, isStandalone: true, selector: "input[nx-input],textarea[nx-input]", inputs: { nxVariant: { classPropertyName: "nxVariant", publicName: "nxVariant", isSignal: true, isRequired: false, transformFunction: null }, nxSize: { classPropertyName: "nxSize", publicName: "nxSize", isSignal: true, isRequired: false, transformFunction: null }, nxStatus: { classPropertyName: "nxStatus", publicName: "nxStatus", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, readonly: { classPropertyName: "readonly", publicName: "readonly", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class.nx-input-disabled": "finalDisabled()", "class.nx-input-borderless": "nxVariant() === 'borderless'", "class.nx-input-filled": "nxVariant() === 'filled'", "class.nx-input-outlined": "nxVariant() === 'outlined'", "class.nx-input-lg": "nxSize() === 'large'", "class.nx-input-sm": "nxSize() === 'small'", "class.nx-input-status-error": "nxStatus() === 'error'", "class.nx-input-status-warning": "nxStatus() === 'warning'", "class.nx-input-status-success": "nxStatus() === 'success'", "attr.disabled": "finalDisabled() || null", "attr.readonly": "readonly() || null" }, classAttribute: "nx-input" }, exportAs: ["nxInput"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.1.7", ngImport: i0, type: InputDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[nx-input],textarea[nx-input]',
                    exportAs: 'nxInput',
                    standalone: true,
                    host: {
                        class: 'nx-input',
                        '[class.nx-input-disabled]': 'finalDisabled()',
                        '[class.nx-input-borderless]': `nxVariant() === 'borderless'`,
                        '[class.nx-input-filled]': `nxVariant() === 'filled'`,
                        '[class.nx-input-outlined]': `nxVariant() === 'outlined'`,
                        '[class.nx-input-lg]': `nxSize() === 'large'`,
                        '[class.nx-input-sm]': `nxSize() === 'small'`,
                        '[class.nx-input-status-error]': `nxStatus() === 'error'`,
                        '[class.nx-input-status-warning]': `nxStatus() === 'warning'`,
                        '[class.nx-input-status-success]': `nxStatus() === 'success'`,
                        '[attr.disabled]': 'finalDisabled() || null',
                        '[attr.readonly]': 'readonly() || null',
                    },
                }]
        }] });

/**
 * Input Component Wrapper
 * This component provides styling encapsulation for the input directive
 */
class InputComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.1.7", ngImport: i0, type: InputComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.1.7", type: InputComponent, isStandalone: true, selector: "nx-input-wrapper", ngImport: i0, template: '', isInline: true, styles: [":root{--primary-color: #000000;--secondary-color: #f5f5f6;--danger-color: #ef4444;--hover-color: #f1f1f3}.nx-input{display:inline-block;width:100%;padding:8px 12px;font-size:14px;line-height:1.5;color:#000000d9;background-color:#fff;background-image:none;border:1px solid #d9d9d9;border-radius:6px;transition:all .3s ease-in-out;outline:none;box-sizing:border-box}.nx-input::placeholder{color:#00000040}.nx-input:focus{border-color:#000;box-shadow:0 0 0 2px #0000000d}.nx-input:hover:not(:disabled):not(:focus){border-color:silver}.nx-input:disabled,.nx-input.nx-input-disabled{background-color:#f5f5f6;color:#00000040;cursor:not-allowed;opacity:1}.nx-input:disabled:hover,.nx-input.nx-input-disabled:hover{border-color:#d9d9d9}.nx-input:read-only,.nx-input[readonly]{background-color:#f5f5f6;cursor:default}.nx-input.nx-input-lg{padding:10px 12px;font-size:16px;height:40px}.nx-input.nx-input-sm{padding:4px 8px;font-size:12px;height:28px}.nx-input.nx-input-outlined{border:1px solid #d9d9d9;background-color:#fff}.nx-input.nx-input-filled{border:none;background-color:#f5f5f6;border-bottom:1px solid #d9d9d9;border-radius:6px 6px 0 0}.nx-input.nx-input-filled:focus{background-color:#fff;border-bottom-color:#000;box-shadow:none}.nx-input.nx-input-filled:hover:not(:disabled):not(:focus){background-color:#f1f1f3}.nx-input.nx-input-borderless{border:none;background-color:transparent;box-shadow:none}.nx-input.nx-input-borderless:focus{box-shadow:none}.nx-input.nx-input-borderless:hover:not(:disabled){background-color:transparent}.nx-input.nx-input-status-error{border-color:#ef4444}.nx-input.nx-input-status-error:focus{border-color:#ef4444;box-shadow:0 0 0 2px #ef44441a}.nx-input.nx-input-status-warning{border-color:#faad14}.nx-input.nx-input-status-warning:focus{border-color:#faad14;box-shadow:0 0 0 2px #faad141a}.nx-input.nx-input-status-success{border-color:#52c41a}.nx-input.nx-input-status-success:focus{border-color:#52c41a;box-shadow:0 0 0 2px #52c41a1a}textarea.nx-input{max-width:100%;height:auto;min-height:64px;line-height:1.5;vertical-align:bottom;resize:vertical}\n"], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.1.7", ngImport: i0, type: InputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'nx-input-wrapper', template: '', standalone: true, encapsulation: ViewEncapsulation.None, styles: [":root{--primary-color: #000000;--secondary-color: #f5f5f6;--danger-color: #ef4444;--hover-color: #f1f1f3}.nx-input{display:inline-block;width:100%;padding:8px 12px;font-size:14px;line-height:1.5;color:#000000d9;background-color:#fff;background-image:none;border:1px solid #d9d9d9;border-radius:6px;transition:all .3s ease-in-out;outline:none;box-sizing:border-box}.nx-input::placeholder{color:#00000040}.nx-input:focus{border-color:#000;box-shadow:0 0 0 2px #0000000d}.nx-input:hover:not(:disabled):not(:focus){border-color:silver}.nx-input:disabled,.nx-input.nx-input-disabled{background-color:#f5f5f6;color:#00000040;cursor:not-allowed;opacity:1}.nx-input:disabled:hover,.nx-input.nx-input-disabled:hover{border-color:#d9d9d9}.nx-input:read-only,.nx-input[readonly]{background-color:#f5f5f6;cursor:default}.nx-input.nx-input-lg{padding:10px 12px;font-size:16px;height:40px}.nx-input.nx-input-sm{padding:4px 8px;font-size:12px;height:28px}.nx-input.nx-input-outlined{border:1px solid #d9d9d9;background-color:#fff}.nx-input.nx-input-filled{border:none;background-color:#f5f5f6;border-bottom:1px solid #d9d9d9;border-radius:6px 6px 0 0}.nx-input.nx-input-filled:focus{background-color:#fff;border-bottom-color:#000;box-shadow:none}.nx-input.nx-input-filled:hover:not(:disabled):not(:focus){background-color:#f1f1f3}.nx-input.nx-input-borderless{border:none;background-color:transparent;box-shadow:none}.nx-input.nx-input-borderless:focus{box-shadow:none}.nx-input.nx-input-borderless:hover:not(:disabled){background-color:transparent}.nx-input.nx-input-status-error{border-color:#ef4444}.nx-input.nx-input-status-error:focus{border-color:#ef4444;box-shadow:0 0 0 2px #ef44441a}.nx-input.nx-input-status-warning{border-color:#faad14}.nx-input.nx-input-status-warning:focus{border-color:#faad14;box-shadow:0 0 0 2px #faad141a}.nx-input.nx-input-status-success{border-color:#52c41a}.nx-input.nx-input-status-success:focus{border-color:#52c41a;box-shadow:0 0 0 2px #52c41a1a}textarea.nx-input{max-width:100%;height:auto;min-height:64px;line-height:1.5;vertical-align:bottom;resize:vertical}\n"] }]
        }] });

var input_component = /*#__PURE__*/Object.freeze({
    __proto__: null,
    InputComponent: InputComponent,
    InputDirective: InputDirective
});

/*
 * Public API Surface of ngx-unnamed
 */

/**
 * Generated bundle index. Do not edit.
 */

export { button_component as NxButton, input_component as NxInput };
//# sourceMappingURL=ngx-unnamed.mjs.map
