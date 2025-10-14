import {
    ApplicationRef,
    ComponentRef,
    createComponent,
    EmbeddedViewRef,
    Injectable,
    TemplateRef,
    Type,
    inject,
} from '@angular/core';
import { NxModalConfig, NxModalResult, NxModalRef as INxModalRef } from './modal.config';
import { ModalRef } from './modal.ref';
import { ModalComponent } from './modal.component';
import { OverlayService } from '../../utils/overlay.service';
import { A11yUtility } from '../../utils/a11y.utility';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private appRef = inject(ApplicationRef);
    private overlayService = inject(OverlayService);
    private a11y = inject(A11yUtility);

    /** Array of open modals for stacking management */
    private openModals: ModalRef[] = [];

    /** Base z-index for modals */
    private baseZIndex = 1000;

    /**
     * Creates and shows a modal with the specified configuration
     */
    create(config: NxModalConfig): INxModalRef {
        // Generate z-index for stacking
        const zIndex = config.zIndex ?? this.overlayService.getNextZIndex();

        // Create modal ref
        const modalRef = new ModalRef(config, config.triggerElement);

        // Create modal component
        const componentRef = this.createModalComponent(modalRef, config, zIndex);

        // Store reference to component instance
        modalRef.componentInstance = componentRef.instance;

        // Add to open modals array
        this.openModals.push(modalRef);

        // Set up cleanup when modal is closed
        modalRef.afterClose.subscribe(() => {
            this.removeModal(modalRef);
            this.destroyModalComponent(componentRef);
        });

        return modalRef;
    }

    /**
     * Shows a confirmation modal
     */
    confirm(config?: Partial<NxModalConfig>): INxModalRef {
        const defaultConfig: NxModalConfig = {
            title: 'Confirm',
            okText: 'OK',
            cancelText: 'Cancel',
            okDanger: false,
            size: 'default',
            mask: true,
            maskClosable: false,
            keyboard: true,
        };

        return this.create({ ...defaultConfig, ...config });
    }

    /**
     * Shows an info modal
     */
    info(config?: Partial<NxModalConfig>): INxModalRef {
        const defaultConfig: NxModalConfig = {
            title: 'Info',
            okText: 'OK',
            cancelText: undefined, // No cancel button
            okDanger: false,
            size: 'default',
            mask: true,
            maskClosable: true,
            keyboard: true,
        };

        return this.create({ ...defaultConfig, ...config });
    }

    /**
     * Shows a success modal
     */
    success(config?: Partial<NxModalConfig>): INxModalRef {
        const defaultConfig: NxModalConfig = {
            title: 'Success',
            okText: 'OK',
            cancelText: undefined, // No cancel button
            okDanger: false,
            size: 'default',
            mask: true,
            maskClosable: true,
            keyboard: true,
        };

        return this.create({ ...defaultConfig, ...config });
    }

    /**
     * Shows an error modal
     */
    error(config?: Partial<NxModalConfig>): INxModalRef {
        const defaultConfig: NxModalConfig = {
            title: 'Error',
            okText: 'OK',
            cancelText: undefined, // No cancel button
            okDanger: true,
            size: 'default',
            mask: true,
            maskClosable: true,
            keyboard: true,
        };

        return this.create({ ...defaultConfig, ...config });
    }

    /**
     * Shows a warning modal
     */
    warning(config?: Partial<NxModalConfig>): INxModalRef {
        const defaultConfig: NxModalConfig = {
            title: 'Warning',
            okText: 'OK',
            cancelText: undefined, // No cancel button
            okDanger: true,
            size: 'default',
            mask: true,
            maskClosable: true,
            keyboard: true,
        };

        return this.create({ ...defaultConfig, ...config });
    }

    /**
     * Closes all open modals
     */
    closeAll(): void {
        // Clone array to avoid modification during iteration
        const modals = [...this.openModals];
        modals.forEach(modal => {
            modal.close({ success: false });
        });
    }

    /**
     * Gets the number of currently open modals
     */
    get openModalsCount(): number {
        return this.openModals.length;
    }

    /**
     * Creates the modal component and attaches it to the DOM
     */
    private createModalComponent(modalRef: ModalRef, config: NxModalConfig, zIndex: number): ComponentRef<ModalComponent> {
        // Create component
        const componentRef = createComponent(ModalComponent, {
            environmentInjector: this.appRef.injector,
        });

        // Set component inputs
        const instance = componentRef.instance;
        instance.nxTitle = config.title ?? '';
        instance.nxSize = config.size ?? 'default';
        instance.nxMask = config.mask ?? true;
        instance.nxMaskClosable = config.maskClosable ?? true;
        instance.nxKeyboard = config.keyboard ?? true;
        instance.nxOkText = config.okText ?? 'OK';
        instance.nxCancelText = config.cancelText ?? 'Cancel';
        instance.nxOkDanger = config.okDanger ?? false;
        instance.nxZIndex = zIndex;

        // Attach to DOM first
        this.attachComponentToDOM(componentRef, zIndex);

        // Trigger change detection to ensure view is initialized
        this.appRef.tick();

        // Set modal ref after DOM attachment and view initialization
        instance.setModalRef(modalRef);

        // Handle component events
        instance.nxOnOk.subscribe(() => {
            modalRef.close({ success: true });
        });

        instance.nxOnCancel.subscribe(() => {
            modalRef.close({ success: false });
        });

        // Show the modal
        instance.show();

        // Trigger change detection again to apply changes
        this.appRef.tick();

        return componentRef;
    }

    /**
     * Attaches the modal component to the DOM
     */
    private attachComponentToDOM(componentRef: ComponentRef<ModalComponent>, zIndex: number): void {
        const componentRootNode = componentRef.location.nativeElement;

        // Set z-index on the modal container
        componentRootNode.style.zIndex = zIndex.toString();

        // Append to body
        document.body.appendChild(componentRootNode);
    }

    /**
     * Removes a modal from the open modals array
     */
    private removeModal(modalRef: ModalRef): void {
        const index = this.openModals.indexOf(modalRef);
        if (index > -1) {
            this.openModals.splice(index, 1);
        }
    }

    /**
     * Destroys the modal component and removes it from DOM
     */
    private destroyModalComponent(componentRef: ComponentRef<ModalComponent>): void {
        const componentRootNode = componentRef.location.nativeElement;

        // Ensure modal is hidden before removal
        const instance = componentRef.instance;
        if (instance) {
            instance.hide();
        }

        // Remove from DOM immediately and synchronously
        if (componentRootNode.parentNode) {
            componentRootNode.parentNode.removeChild(componentRootNode);
        }

        // Destroy component
        componentRef.destroy();

        // Failsafe: Remove any leftover modal elements after a short delay
        setTimeout(() => {
            const leftoverModals = document.querySelectorAll('.nx-modal');
            leftoverModals.forEach(el => el.remove());
        }, 100);
    }
}