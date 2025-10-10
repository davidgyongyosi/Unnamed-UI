import * as _angular_core from '@angular/core';
import { OnDestroy, OnChanges, AfterViewInit, AfterContentInit, OnInit, ElementRef, SimpleChanges, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

type NxButtonVariants = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'dashed' | 'link' | null;
type NxButtonShapes = 'circle' | 'round' | null;
type NxButtonSizes = 'large' | 'default' | 'small';
declare class ButtonComponent implements OnDestroy, OnChanges, AfterViewInit, AfterContentInit, OnInit {
    nzIconDirectiveElement: ElementRef;
    nxVariant: NxButtonVariants;
    nxShape: NxButtonShapes;
    nxSize: NxButtonSizes;
    nxLoading: boolean;
    disabled: boolean;
    ghost: boolean;
    danger: boolean;
    nxBlock: boolean;
    tabIndex: number | null;
    private destroy$;
    private loading$;
    private ngZone;
    private elementRef;
    private cdr;
    private renderer;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    insertSpan(nodes: NodeList, renderer: Renderer2): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ButtonComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<ButtonComponent, "button[nx-button], a[nx-button]", never, { "nxVariant": { "alias": "nxVariant"; "required": false; }; "nxShape": { "alias": "nxShape"; "required": false; }; "nxSize": { "alias": "nxSize"; "required": false; }; "nxLoading": { "alias": "nxLoading"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "ghost": { "alias": "ghost"; "required": false; }; "danger": { "alias": "danger"; "required": false; }; "nxBlock": { "alias": "nxBlock"; "required": false; }; "tabIndex": { "alias": "tabIndex"; "required": false; }; }, {}, ["nzIconDirectiveElement"], ["*"], true, never>;
    static ngAcceptInputType_nxLoading: unknown;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_ghost: unknown;
    static ngAcceptInputType_danger: unknown;
    static ngAcceptInputType_nxBlock: unknown;
}

type button_component_d_ButtonComponent = ButtonComponent;
declare const button_component_d_ButtonComponent: typeof ButtonComponent;
type button_component_d_NxButtonShapes = NxButtonShapes;
type button_component_d_NxButtonSizes = NxButtonSizes;
type button_component_d_NxButtonVariants = NxButtonVariants;
declare namespace button_component_d {
  export { button_component_d_ButtonComponent as ButtonComponent };
  export type { button_component_d_NxButtonShapes as NxButtonShapes, button_component_d_NxButtonSizes as NxButtonSizes, button_component_d_NxButtonVariants as NxButtonVariants };
}

type NxInputSize = 'large' | 'default' | 'small';
type NxInputVariant = 'outlined' | 'filled' | 'borderless';
type NxInputStatus = 'error' | 'warning' | 'success' | '';
declare class InputDirective implements OnInit {
    private elementRef;
    readonly ngControl: NgControl | null;
    readonly value: _angular_core.WritableSignal<string>;
    readonly nxVariant: _angular_core.InputSignal<NxInputVariant>;
    readonly nxSize: _angular_core.InputSignal<NxInputSize>;
    readonly nxStatus: _angular_core.InputSignal<NxInputStatus>;
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    readonly readonly: _angular_core.InputSignalWithTransform<boolean, unknown>;
    readonly controlDisabled: _angular_core.WritableSignal<boolean>;
    readonly finalDisabled: _angular_core.InputSignalWithTransform<boolean, unknown> | _angular_core.WritableSignal<boolean>;
    ngOnInit(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<InputDirective, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<InputDirective, "input[nx-input],textarea[nx-input]", ["nxInput"], { "nxVariant": { "alias": "nxVariant"; "required": false; "isSignal": true; }; "nxSize": { "alias": "nxSize"; "required": false; "isSignal": true; }; "nxStatus": { "alias": "nxStatus"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "readonly": { "alias": "readonly"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * Input Component Wrapper
 * This component provides styling encapsulation for the input directive
 */
declare class InputComponent {
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<InputComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<InputComponent, "nx-input-wrapper", never, {}, {}, never, never, true, never>;
}

type input_component_d_InputComponent = InputComponent;
declare const input_component_d_InputComponent: typeof InputComponent;
type input_component_d_InputDirective = InputDirective;
declare const input_component_d_InputDirective: typeof InputDirective;
type input_component_d_NxInputSize = NxInputSize;
type input_component_d_NxInputStatus = NxInputStatus;
type input_component_d_NxInputVariant = NxInputVariant;
declare namespace input_component_d {
  export { input_component_d_InputComponent as InputComponent, input_component_d_InputDirective as InputDirective };
  export type { input_component_d_NxInputSize as NxInputSize, input_component_d_NxInputStatus as NxInputStatus, input_component_d_NxInputVariant as NxInputVariant };
}

export { button_component_d as NxButton, input_component_d as NxInput };
