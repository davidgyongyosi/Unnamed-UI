import { Injectable, inject, DestroyRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export interface NxModalRef<T = any> {
    afterClose: Subject<T>;
    close: (result?: T) => void;
    updateConfig: (config: Partial<NxModalConfig>) => void;
}

export interface NxModalConfig {
    nxTitle?: string;
    nxContent?: string;
    nxOkText?: string;
    nxCancelText?: string;
    nxOkDanger?: boolean;
    nxMask?: boolean;
    nxMaskClosable?: boolean;
    nxKeyboard?: boolean;
    nxWidth?: string | number;
    nxCentered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NxModalService implements OnDestroy {
    private destroyRef = inject(DestroyRef);
    private activeModals: NxModalRef[] = [];

    /**
     * Creates and displays a new modal instance
     * Following ng-zorro's create() method pattern
     */
    create<T = any>(config: NxModalConfig): NxModalRef<T> {
        const modalRef = this.createModalElement<T>(config);
        this.activeModals.push(modalRef);

        // Auto-cleanup when modal closes
        modalRef.afterClose.subscribe(() => {
            this.removeOpenModal(modalRef);
        });

        return modalRef;
    }

    /**
     * Creates a confirmation modal
     * Following ng-zorro's confirm() method pattern
     */
    confirm<T = any>(config: Partial<NxModalConfig> = {}): NxModalRef<T> {
        const defaultConfig: NxModalConfig = {
            nxTitle: 'Confirm',
            nxContent: 'Are you sure you want to proceed?',
            nxOkText: 'OK',
            nxCancelText: 'Cancel',
            nxOkDanger: false,
            nxMask: true,
            nxMaskClosable: false,
            nxKeyboard: true,
            nxCentered: true
        };

        return this.create({ ...defaultConfig, ...config });
    }

    /**
     * Creates an info modal
     * Following ng-zorro's info() method pattern
     */
    info<T = any>(config: Partial<NxModalConfig> = {}): NxModalRef<T> {
        return this.createPresetModal('info', '#1890ff', config);
    }

    /**
     * Creates a success modal
     * Following ng-zorro's success() method pattern
     */
    success<T = any>(config: Partial<NxModalConfig> = {}): NxModalRef<T> {
        return this.createPresetModal('success', '#52c41a', config);
    }

    /**
     * Creates an error modal
     * Following ng-zorro's error() method pattern
     */
    error<T = any>(config: Partial<NxModalConfig> = {}): NxModalRef<T> {
        return this.createPresetModal('error', '#ff4d4f', config);
    }

    /**
     * Creates a warning modal
     * Following ng-zorro's warning() method pattern
     */
    warning<T = any>(config: Partial<NxModalConfig> = {}): NxModalRef<T> {
        return this.createPresetModal('warning', '#faad14', config);
    }

    /**
     * Closes all open modals
     * Following ng-zorro's closeAll() method pattern
     */
    closeAll(): void {
        const modals = [...this.activeModals];
        modals.forEach(modal => modal.close({ success: false }));
    }

    /**
     * Gets the number of open modals
     * Following ng-zorro's openModalsCount pattern
     */
    get openModalsCount(): number {
        return this.activeModals.length;
    }

    /**
     * Implementation of ngOnDestroy
     */
    ngOnDestroy(): void {
        this.closeAll();
    }

    /**
     * Creates a modal element using ng-zorro structure and nx-unnamed styling
     */
    private createModalElement<T = any>(config: NxModalConfig): NxModalRef<T> {
        const afterClose = new Subject<T>();
        let titleElement: HTMLDivElement | null = null;

        // Create backdrop container (ng-zorro style)
        const backdropContainer = document.createElement('div');
        backdropContainer.className = 'ant-modal-root';
        backdropContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create backdrop (ng-zorro style)
        const backdrop = document.createElement('div');
        backdrop.className = 'ant-modal-mask';
        backdrop.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.45);
            transition: opacity 0.3s;
        `;

        // Create modal container (ng-zorro style with nx-unnamed classes)
        const modalContainer = document.createElement('div');
        modalContainer.className = 'ant-modal-wrap';

        const modalElement = document.createElement('div');
        modalElement.className = 'ant-modal';
        modalElement.style.cssText = `
            width: ${config.nxWidth || 520}px;
            margin: 0 auto;
            position: relative;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            outline: none;
        `;

        // Create modal content structure (ng-zorro style)
        const modalContent = document.createElement('div');
        modalContent.className = 'ant-modal-content';

        // Create header
        const header = document.createElement('div');
        header.className = 'ant-modal-header';
        header.style.cssText = `
            padding: 16px 24px;
            border-bottom: 1px solid #f0f0f0;
            border-radius: 8px 8px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;

        if (config.nxTitle) {
            titleElement = document.createElement('div');
            titleElement.className = 'ant-modal-title';
            titleElement.textContent = config.nxTitle;
            titleElement.style.cssText = `
                margin: 0;
                color: rgba(0, 0, 0, 0.85);
                font-weight: 600;
                font-size: 16px;
                line-height: 1.5;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
            `;
            header.appendChild(titleElement);
        }

        // Create close button (ng-zorro style)
        const closeBtn = document.createElement('button');
        closeBtn.className = 'ant-modal-close';
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: rgba(0, 0, 0, 0.45);
            padding: 0;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = 'rgba(0, 0, 0, 0.85)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = 'rgba(0, 0, 0, 0.45)';
        });
        closeBtn.addEventListener('click', () => {
            this.destroyModal(backdropContainer);
            afterClose.next({ success: false } as T);
            afterClose.complete();
        });
        header.appendChild(closeBtn);

        // Create body
        const body = document.createElement('div');
        body.className = 'ant-modal-body';
        body.textContent = config.nxContent || '';
        body.style.cssText = `
            padding: 24px;
            font-size: 14px;
            line-height: 1.5715;
            color: rgba(0, 0, 0, 0.85);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
            font-weight: 400;
            word-wrap: break-word;
        `;

        // Create footer if needed
        let footer = null;
        if (config.nxOkText || config.nxCancelText) {
            footer = document.createElement('div');
            footer.className = 'ant-modal-footer';
            footer.style.cssText = `
                padding: 10px 16px;
                border-top: 1px solid #f0f0f0;
                border-radius: 0 0 8px 8px;
                text-align: right;
            `;

            // Cancel button (ngx-unnamed secondary button style)
            if (config.nxCancelText) {
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = config.nxCancelText;
                cancelBtn.style.cssText = `
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 400;
                    white-space: nowrap;
                    text-align: center;
                    background-image: none;
                    height: 32px;
                    padding: 4px 15px;
                    font-size: 14px;
                    border-radius: 6px;
                    border: 1px solid #d9d9d9;
                    background: #fff;
                    color: rgba(0, 0, 0, 0.88);
                    margin-right: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    outline: none;
                    box-sizing: border-box;
                    line-height: 1.5715;
                `;
                cancelBtn.addEventListener('mouseenter', () => {
                    cancelBtn.style.color = 'rgba(0, 0, 0, 0.85)';
                    cancelBtn.style.borderColor = '#f5f5f6';
                    cancelBtn.style.background = '#f1f1f3';
                });
                cancelBtn.addEventListener('mouseleave', () => {
                    cancelBtn.style.color = 'rgba(0, 0, 0, 0.88)';
                    cancelBtn.style.borderColor = '#d9d9d9';
                    cancelBtn.style.background = '#fff';
                });
                cancelBtn.addEventListener('click', () => {
                    this.destroyModal(backdropContainer);
                    afterClose.next({ success: false } as T);
                    afterClose.complete();
                });
                footer.appendChild(cancelBtn);
            }

            // OK button (ngx-unnamed primary or danger button style)
            const okBtn = document.createElement('button');
            okBtn.textContent = config.nxOkText || 'OK';
            const isDanger = config.nxOkDanger;
            okBtn.style.cssText = `
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: 400;
                white-space: nowrap;
                text-align: center;
                background-image: none;
                height: 32px;
                padding: 4px 15px;
                font-size: 14px;
                border-radius: 6px;
                border: 1px solid transparent;
                background: ${isDanger ? '#ef4444' : '#000000'};
                color: #fff;
                cursor: pointer;
                transition: all 0.3s;
                outline: none;
                box-sizing: border-box;
                line-height: 1.5715;
                text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
                box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
            `;
            okBtn.addEventListener('mouseenter', () => {
                if (isDanger) {
                    okBtn.style.background = '#f55555';
                    okBtn.style.borderColor = '#f55555';
                } else {
                    okBtn.style.background = '#333333';
                    okBtn.style.borderColor = '#333333';
                }
            });
            okBtn.addEventListener('mouseleave', () => {
                if (isDanger) {
                    okBtn.style.background = '#ef4444';
                    okBtn.style.borderColor = 'transparent';
                } else {
                    okBtn.style.background = '#000000';
                    okBtn.style.borderColor = 'transparent';
                }
            });
            okBtn.addEventListener('click', () => {
                this.destroyModal(backdropContainer);
                afterClose.next({ success: true } as T);
                afterClose.complete();
            });
            footer.appendChild(okBtn);
        }

        // Assemble modal
        modalContent.appendChild(header);
        modalContent.appendChild(body);
        if (footer) {
            modalContent.appendChild(footer);
        }
        modalElement.appendChild(modalContent);
        modalContainer.appendChild(modalElement);
        backdropContainer.appendChild(backdrop);
        backdropContainer.appendChild(modalContainer);

        // Add to document
        document.body.appendChild(backdropContainer);

        // Keyboard handling (ng-zorro style)
        const keyHandler = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && config.nxKeyboard !== false) {
                this.destroyModal(backdropContainer);
                afterClose.next({ success: false } as T);
                afterClose.complete();
                document.removeEventListener('keydown', keyHandler);
            }
        };
        document.addEventListener('keydown', keyHandler);

        // Backdrop click handling (ng-zorro style)
        if (config.nxMaskClosable !== false) {
            backdrop.addEventListener('click', (event: Event) => {
                if (event.target === backdrop) {
                    this.destroyModal(backdropContainer);
                    afterClose.next({ success: false } as T);
                    afterClose.complete();
                    document.removeEventListener('keydown', keyHandler);
                }
            });
        }

        // Auto-focus on modal
        setTimeout(() => {
            modalElement.focus();
        }, 100);

        return {
            afterClose,
            close: (result?: T) => {
                this.destroyModal(backdropContainer);
                afterClose.next(result || { success: false } as T);
                afterClose.complete();
                document.removeEventListener('keydown', keyHandler);
            },
            updateConfig: (newConfig: Partial<NxModalConfig>) => {
                Object.assign(config, newConfig);
                // Update title if changed
                if (newConfig.nxTitle !== undefined && titleElement) {
                    titleElement.textContent = newConfig.nxTitle;
                }
                // Update content if changed
                if (newConfig.nxContent !== undefined && body) {
                    body.textContent = newConfig.nxContent;
                }
            }
        };
    }

    /**
     * Creates preset modals (info, success, error, warning)
     * Following ng-zorro's preset modal pattern
     */
    private createPresetModal<T = any>(
        type: 'info' | 'success' | 'error' | 'warning',
        color: string,
        config: Partial<NxModalConfig>
    ): NxModalRef<T> {
        const titles = {
            info: 'Information',
            success: 'Success',
            error: 'Error',
            warning: 'Warning'
        };

        const defaultConfig: NxModalConfig = {
            nxTitle: titles[type],
            nxOkText: 'OK',
            nxCancelText: undefined,
            nxOkDanger: type === 'error' || type === 'warning',
            nxMask: true,
            nxMaskClosable: true,
            nxKeyboard: true,
            nxCentered: true,
            ...config
        };

        return this.create(defaultConfig);
    }

    /**
     * Removes modal from the open modals list
     */
    private removeOpenModal(modalRef: NxModalRef): void {
        const index = this.activeModals.indexOf(modalRef);
        if (index > -1) {
            this.activeModals.splice(index, 1);
        }
    }

    /**
     * Destroys modal element from DOM
     */
    private destroyModal(element: HTMLElement): void {
        try {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        } catch (error) {
            console.warn('Error removing modal:', error);
        }
    }
}