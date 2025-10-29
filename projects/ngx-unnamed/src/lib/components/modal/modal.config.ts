import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

export type NxModalSize = 'small' | 'default' | 'large' | 'fullscreen';

export interface NxModalConfig {
    /** Modal title */
    title?: string;
    /** Modal size */
    size?: NxModalSize;
    /** Whether to show backdrop */
    mask?: boolean;
    /** Whether clicking backdrop closes modal */
    maskClosable?: boolean;
    /** Whether keyboard (ESC) can close modal */
    keyboard?: boolean;
    /** Custom template for header */
    headerTemplate?: TemplateRef<any>;
    /** Custom template for body */
    contentTemplate?: TemplateRef<any>;
    /** Custom template for footer */
    footerTemplate?: TemplateRef<any>;
    /** Whether to show OK button */
    okText?: string;
    /** Whether to show Cancel button */
    cancelText?: string;
    /** Custom OK button text */
    okDanger?: boolean;
    /** Custom component class */
    componentClass?: string;
    /** Custom z-index */
    zIndex?: number;
    /** Element that triggered the modal for focus return */
    triggerElement?: HTMLElement;
}

export interface NxModalResult {
    /** Whether modal was confirmed (OK) or cancelled */
    success: boolean;
    /** Optional data returned from modal */
    data?: any;
}

export interface NxModalRef {
    /** Modal instance */
    componentInstance: any;
    /** Observable that emits when modal is closed */
    afterClose: Observable<NxModalResult>;
    /** Close modal with result */
    close(result?: NxModalResult): void;
    /** Destroy modal */
    destroy(): void;
    /** Get modal element */
    getElement(): HTMLElement;
    /** Focus modal */
    focus(): void;
    /** Get the modal config */
    getConfig(): NxModalConfig;
    /** Get the trigger element */
    getTriggerElement(): HTMLElement | undefined;
}

// Service modal configuration for NxModalService
export interface NxModalServiceConfig {
    /** Modal title */
    nxTitle?: string;
    /** Modal content */
    nxContent?: string;
    /** OK button text */
    nxOkText?: string;
    /** Cancel button text */
    nxCancelText?: string;
    /** Whether OK button is danger style */
    nxOkDanger?: boolean;
    /** Whether to show mask/backdrop */
    nxMask?: boolean;
    /** Whether clicking mask closes modal */
    nxMaskClosable?: boolean;
    /** Whether keyboard (ESC) closes modal */
    nxKeyboard?: boolean;
    /** Modal width */
    nxWidth?: string | number;
    /** Whether modal is centered */
    nxCentered?: boolean;
}

