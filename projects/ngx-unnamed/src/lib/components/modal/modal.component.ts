import {
    AfterViewInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';
import { ButtonComponent } from '../button/button.component';
import { A11yUtility } from '../../utils/a11y.utility';
import { FocusMonitor } from '../../utils/focus-monitor';
import { ModalRef } from './modal.ref';
import { NxModalSize } from './modal.config';

const fadeAnimation = trigger('fadeAnimation', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 })),
    ]),
    transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0 })),
    ]),
]);

const zoomAnimation = trigger('zoomAnimation', [
    transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'scale(1)', opacity: 1 })),
    ]),
    transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'scale(0.8)', opacity: 0 })),
    ]),
]);

@Component({
    selector: 'nx-modal',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    template: `
        <div
            class="nx-modal"
            [attr.aria-modal]="true"
            [attr.role]="'dialog'"
            [attr.aria-labelledby]="titleId"
            [attr.aria-describedby]="bodyId"
            [attr.tabindex]="visible ? 0 : -1"
            [class.nx-modal-fullscreen]="nxSize === 'fullscreen'"
            (keydown)="handleKeyDown($event)"
            [@fadeAnimation]="visible"
            (@fadeAnimation.done)="onAnimationDone($event)"
        >
            @if (nxMask) {
                <div
                    class="nx-modal-mask"
                    (click)="handleMaskClick()"
                ></div>
            }

            <div
                class="nx-modal-content"
                [class.nx-modal-small]="nxSize === 'small'"
                [class.nx-modal-default]="nxSize === 'default'"
                [class.nx-modal-large]="nxSize === 'large'"
                [class.nx-modal-fullscreen]="nxSize === 'fullscreen'"
                [@zoomAnimation]="visible"
                #modalContent
            >
                @if (showHeader) {
                    <div class="nx-modal-header">
                        @if (nxTitle || hasHeaderTemplate) {
                            <div class="nx-modal-title" [id]="titleId">
                                @if (hasHeaderTemplate) {
                                    <ng-container [ngTemplateOutlet]="headerTemplate!"></ng-container>
                                } @else {
                                    {{ nxTitle }}
                                }
                            </div>
                        }

                        <button
                            class="nx-modal-close"
                            (click)="handleClose()"
                            [attr.aria-label]="'Close modal'"
                        >
                            ×
                        </button>
                    </div>
                }

                <div class="nx-modal-body" [id]="bodyId">
                    <ng-content></ng-content>
                    @if (hasContentTemplate) {
                        <ng-container [ngTemplateOutlet]="contentTemplate!"></ng-container>
                    }
                </div>

                @if (showFooter) {
                    <div class="nx-modal-footer">
                        @if (hasFooterTemplate) {
                            <ng-container [ngTemplateOutlet]="footerTemplate!"></ng-container>
                        } @else {
                            <button
                                nx-button
                                nxVariant="secondary"
                                (click)="handleCancel()"
                            >
                                {{ nxCancelText || 'Cancel' }}
                            </button>
                            <button
                                nx-button
                                [nxVariant]="nxOkDanger ? 'danger' : 'primary'"
                                (click)="handleOk()"
                                [nxLoading]="nxLoading"
                            >
                                {{ nxOkText || 'OK' }}
                            </button>
                        }
                    </div>
                }
            </div>
        </div>
    `,
    styleUrls: ['./style/modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeAnimation, zoomAnimation],
    host: {
        '[style.display]': 'visible ? "flex" : "none"',
    },
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() nxTitle: string = '';
    @Input() nxSize: NxModalSize = 'default';
    @Input({ transform: booleanAttribute }) nxMask: boolean = true;
    @Input({ transform: booleanAttribute }) nxMaskClosable: boolean = true;
    @Input({ transform: booleanAttribute }) nxKeyboard: boolean = true;
    @Input({ transform: booleanAttribute }) nxLoading: boolean = false;
    @Input() nxOkText: string = 'OK';
    @Input() nxCancelText: string = 'Cancel';
    @Input({ transform: booleanAttribute }) nxOkDanger: boolean = false;
    @Input() nxZIndex: number = 1000;

    @ContentChild('header', { read: TemplateRef }) headerTemplate!: TemplateRef<any>;
    @ContentChild('footer', { read: TemplateRef }) footerTemplate!: TemplateRef<any>;
    @ContentChild('content', { read: TemplateRef }) contentTemplate!: TemplateRef<any>;

    @ViewChild('modalContent') modalContent!: ElementRef<HTMLElement>;

    @Output() readonly nxOnOk = new EventEmitter<void>();
    @Output() readonly nxOnCancel = new EventEmitter<void>();
    @Output() readonly nxOnClose = new EventEmitter<void>();

    visible: boolean = false;
    titleId: string = '';
    bodyId: string = '';

    private destroy$ = new Subject<void>();
    private a11y = inject(A11yUtility);
    private focusMonitor = inject(FocusMonitor);
    private ngZone = inject(NgZone);
    private cdr = inject(ChangeDetectorRef);
    private modalRef?: ModalRef;

    ngOnInit(): void {
        // Generate unique IDs for ARIA
        this.titleId = this.a11y.generateUniqueId('modal-title');
        this.bodyId = this.a11y.generateUniqueId('modal-body');
    }

    ngAfterViewInit(): void {
        if (this.visible && this.modalContent) {
            this.setupFocusTrap();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Shows the modal
     */
    show(): void {
        this.visible = true;
        this.cdr.markForCheck();
    }

    /**
     * Hides the modal
     */
    hide(): void {
        this.visible = false;
        this.cdr.markForCheck();
    }

    /**
     * Sets the modal reference for service-based usage
     */
    setModalRef(ref: ModalRef): void {
        this.modalRef = ref;
        // Defer setting element until after view initialization
        Promise.resolve().then(() => {
            if (this.modalContent && this.modalRef) {
                this.modalRef.setElement(this.modalContent.nativeElement);
            }
        });
    }

    get showHeader(): boolean {
        return !!(this.nxTitle || this.hasHeaderTemplate);
    }

    get showFooter(): boolean {
        return !!(this.hasFooterTemplate || (!this.hasContentTemplate && !this.hasDefaultContent));
    }

    get hasHeaderTemplate(): boolean {
        return !!this.headerTemplate;
    }

    get hasFooterTemplate(): boolean {
        return !!this.footerTemplate;
    }

    get hasContentTemplate(): boolean {
        return !!this.contentTemplate;
    }

    get hasDefaultContent(): boolean {
        // This would need to be checked during ngAfterContentChecked
        return true; // Simplified for now
    }

    /**
     * Handles OK button click
     */
    handleOk(): void {
        this.nxOnOk.emit();
        if (!this.nxLoading) {
            this.handleClose();
        }
    }

    /**
     * Handles Cancel button click
     */
    handleCancel(): void {
        this.nxOnCancel.emit();
        this.handleClose();
    }

    /**
     * Handles close button click
     */
    handleClose(): void {
        this.nxOnClose.emit();
        this.hide();

        if (this.modalRef) {
            this.modalRef.close({ success: false });
        }
    }

    /**
     * Handles mask/backdrop click
     */
    handleMaskClick(): void {
        if (this.nxMaskClosable) {
            this.handleClose();
        }
    }

    /**
     * Handles keyboard events
     */
    handleKeyDown(event: KeyboardEvent): void {
        if (!this.nxKeyboard) {
            return;
        }

        if (this.a11y.isEscape(event)) {
            event.preventDefault();
            this.handleClose();
        }
    }

    /**
     * Handles animation completion
     */
    onAnimationDone(event: AnimationEvent): void {
        if (event.toState === 'visible') {
            this.setupFocusTrap();
        } else if (event.toState === 'hidden') {
            this.cleanupFocusTrap();
        }
    }

    /**
     * Sets up focus trap within the modal
     */
    private setupFocusTrap(): void {
        if (!this.modalContent) {
            return;
        }

        const element = this.modalContent.nativeElement;
        const cleanup = this.a11y.createFocusTrap(element);

        if (this.modalRef) {
            this.modalRef.setFocusTrapCleanup(cleanup);
        }
    }

    /**
     * Cleans up focus trap
     */
    private cleanupFocusTrap(): void {
        if (this.modalRef) {
            this.modalRef.destroy();
        }
    }
}