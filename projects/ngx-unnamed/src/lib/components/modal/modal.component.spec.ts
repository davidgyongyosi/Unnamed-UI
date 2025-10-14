import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, TemplateRef, provideZoneChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';
import { ModalRef } from './modal.ref';
import { A11yUtility } from '../../utils/a11y.utility';
import { FocusMonitor } from '../../utils/focus-monitor';

describe('ModalComponent', () => {
    let component: ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;
    let mockA11yUtility: jasmine.SpyObj<A11yUtility>;
    let mockFocusMonitor: jasmine.SpyObj<FocusMonitor>;
    let mockModalRef: jasmine.SpyObj<ModalRef>;

    beforeEach(async () => {
        mockA11yUtility = jasmine.createSpyObj('A11yUtility', ['generateUniqueId', 'createFocusTrap', 'isEscape']);
        mockFocusMonitor = jasmine.createSpyObj('FocusMonitor', ['monitor', 'stopMonitoring']);
        mockModalRef = jasmine.createSpyObj('ModalRef', ['setElement', 'setFocusTrapCleanup', 'close']);

        mockA11yUtility.generateUniqueId.and.callFake((prefix: string) => `${prefix}-test-id`);
        mockA11yUtility.createFocusTrap.and.returnValue(() => {});
        mockA11yUtility.isEscape.and.returnValue(false);

        await TestBed.configureTestingModule({
            imports: [ModalComponent, TestTemplateComponent],
            providers: [
                provideZoneChangeDetection(),
                { provide: A11yUtility, useValue: mockA11yUtility },
                { provide: FocusMonitor, useValue: mockFocusMonitor },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should generate unique IDs on init', () => {
        expect(component.titleId).toContain('modal-title-test-id');
        expect(component.bodyId).toContain('modal-body-test-id');
        expect(mockA11yUtility.generateUniqueId).toHaveBeenCalledWith('modal-title');
        expect(mockA11yUtility.generateUniqueId).toHaveBeenCalledWith('modal-body');
    });

    it('should show modal with visible flag', () => {
        component.visible = true;
        fixture.detectChanges();

        const modalElement = fixture.debugElement.query(By.css('.nx-modal'));
        expect(modalElement).toBeTruthy();
        expect(modalElement.nativeElement.style.display).toBe('flex');
    });

    it('should hide modal when visible is false', () => {
        component.visible = false;
        fixture.detectChanges();

        const modalElement = fixture.debugElement.query(By.css('.nx-modal'));
        expect(modalElement).toBeTruthy();
        expect(modalElement.nativeElement.style.display).toBe('none');
    });

    it('should display title when nxTitle is provided', () => {
        component.nxTitle = 'Test Modal Title';
        component.visible = true;
        fixture.detectChanges();

        const titleElement = fixture.debugElement.query(By.css('.nx-modal-title'));
        expect(titleElement).toBeTruthy();
        expect(titleElement.nativeElement.textContent.trim()).toBe('Test Modal Title');
    });

    it('should not display header when no title or template', () => {
        component.nxTitle = '';
        component.visible = true;
        fixture.detectChanges();

        const headerElement = fixture.debugElement.query(By.css('.nx-modal-header'));
        expect(headerElement).toBeFalsy();
    });

    it('should apply size classes correctly', () => {
        component.nxSize = 'small';
        component.visible = true;
        fixture.detectChanges();

        const contentElement = fixture.debugElement.query(By.css('.nx-modal-content'));
        expect(contentElement.nativeElement).toHaveClass('nx-modal-small');

        component.nxSize = 'large';
        fixture.detectChanges();
        expect(contentElement.nativeElement).toHaveClass('nx-modal-large');
    });

    it('should show OK and Cancel buttons by default', () => {
        component.visible = true;
        fixture.detectChanges();

        const okButton = fixture.debugElement.query(By.css('button[nx-button][nxVariant="primary"]'));
        const cancelButton = fixture.debugElement.query(By.css('button[nx-button][nxVariant="secondary"]'));

        expect(okButton).toBeTruthy();
        expect(cancelButton).toBeTruthy();
        expect(okButton.nativeElement.textContent.trim()).toBe('OK');
        expect(cancelButton.nativeElement.textContent.trim()).toBe('Cancel');
    });

    it('should use custom button text when provided', () => {
        component.nxOkText = 'Save';
        component.nxCancelText = 'Discard';
        component.visible = true;
        fixture.detectChanges();

        const okButton = fixture.debugElement.query(By.css('button[nx-button][nxVariant="primary"]'));
        const cancelButton = fixture.debugElement.query(By.css('button[nx-button][nxVariant="secondary"]'));

        expect(okButton.nativeElement.textContent.trim()).toBe('Save');
        expect(cancelButton.nativeElement.textContent.trim()).toBe('Discard');
    });

    it('should show danger variant for OK button when nxOkDanger is true', () => {
        component.nxOkDanger = true;
        component.visible = true;
        fixture.detectChanges();

        const okButton = fixture.debugElement.query(By.css('button[nx-button][nxVariant="danger"]'));
        expect(okButton).toBeTruthy();
    });

    it('should show mask when nxMask is true', () => {
        component.nxMask = true;
        component.visible = true;
        fixture.detectChanges();

        const maskElement = fixture.debugElement.query(By.css('.nx-modal-mask'));
        expect(maskElement).toBeTruthy();
    });

    it('should not show mask when nxMask is false', () => {
        component.nxMask = false;
        component.visible = true;
        fixture.detectChanges();

        const maskElement = fixture.debugElement.query(By.css('.nx-modal-mask'));
        expect(maskElement).toBeFalsy();
    });

    it('should handle OK button click', () => {
        spyOn(component.nxOnOk, 'emit');
        spyOn(component, 'handleClose');

        component.visible = true;
        fixture.detectChanges();

        const okButton = fixture.debugElement.query(By.css('button[nx-button][nxVariant="primary"]'));
        okButton.nativeElement.click();

        expect(component.nxOnOk.emit).toHaveBeenCalled();
        expect(component.handleClose).toHaveBeenCalled();
    });

    it('should handle Cancel button click', () => {
        spyOn(component.nxOnCancel, 'emit');
        spyOn(component, 'handleClose');

        component.visible = true;
        fixture.detectChanges();

        const cancelButton = fixture.debugElement.query(By.css('button[nx-button][nxVariant="secondary"]'));
        cancelButton.nativeElement.click();

        expect(component.nxOnCancel.emit).toHaveBeenCalled();
        expect(component.handleClose).toHaveBeenCalled();
    });

    it('should handle close button click', () => {
        spyOn(component.nxOnClose, 'emit');
        spyOn(component, 'hide');

        component.visible = true;
        fixture.detectChanges();

        const closeButton = fixture.debugElement.query(By.css('.nx-modal-close'));
        closeButton.nativeElement.click();

        expect(component.nxOnClose.emit).toHaveBeenCalled();
        expect(component.hide).toHaveBeenCalled();
    });

    it('should handle mask click when nxMaskClosable is true', () => {
        spyOn(component, 'handleClose');
        component.nxMaskClosable = true;
        component.visible = true;
        fixture.detectChanges();

        const maskElement = fixture.debugElement.query(By.css('.nx-modal-mask'));
        maskElement.nativeElement.click();

        expect(component.handleClose).toHaveBeenCalled();
    });

    it('should not handle mask click when nxMaskClosable is false', () => {
        spyOn(component, 'handleClose');
        component.nxMaskClosable = false;
        component.visible = true;
        fixture.detectChanges();

        const maskElement = fixture.debugElement.query(By.css('.nx-modal-mask'));
        maskElement.nativeElement.click();

        expect(component.handleClose).not.toHaveBeenCalled();
    });

    it('should handle Escape key when nxKeyboard is true', () => {
        spyOn(component, 'handleClose');
        mockA11yUtility.isEscape.and.returnValue(true);
        component.nxKeyboard = true;
        component.visible = true;
        fixture.detectChanges();

        const modalElement = fixture.debugElement.query(By.css('.nx-modal'));
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        modalElement.nativeElement.dispatchEvent(escapeEvent);

        expect(mockA11yUtility.isEscape).toHaveBeenCalledWith(escapeEvent);
        expect(component.handleClose).toHaveBeenCalled();
    });

    it('should not handle Escape key when nxKeyboard is false', () => {
        spyOn(component, 'handleClose');
        mockA11yUtility.isEscape.and.returnValue(true);
        component.nxKeyboard = false;
        component.visible = true;
        fixture.detectChanges();

        const modalElement = fixture.debugElement.query(By.css('.nx-modal'));
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        modalElement.nativeElement.dispatchEvent(escapeEvent);

        expect(component.handleClose).not.toHaveBeenCalled();
    });

    it('should set modal ref and element', () => {
        component.setModalRef(mockModalRef);
        component.ngAfterViewInit();

        expect(mockModalRef.setElement).toHaveBeenCalledWith(component.modalContent.nativeElement);
    });

    it('should show and hide modal', () => {
        expect(component.visible).toBe(false);

        component.show();
        expect(component.visible).toBe(true);

        component.hide();
        expect(component.visible).toBe(false);
    });

    it('should have correct ARIA attributes', () => {
        component.visible = true;
        fixture.detectChanges();

        const modalElement = fixture.debugElement.query(By.css('.nx-modal'));
        expect(modalElement.nativeElement.getAttribute('aria-modal')).toBe('true');
        expect(modalElement.nativeElement.getAttribute('role')).toBe('dialog');
        expect(modalElement.nativeElement.getAttribute('aria-labelledby')).toBe(component.titleId);
        expect(modalElement.nativeElement.getAttribute('aria-describedby')).toBe(component.bodyId);
        expect(modalElement.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should not close modal with loading state on OK click', () => {
        spyOn(component.nxOnOk, 'emit');
        spyOn(component, 'handleClose');
        component.nxLoading = true;
        component.visible = true;
        fixture.detectChanges();

        const okButton = fixture.debugElement.query(By.css('button[nx-button][nxVariant="primary"]'));
        okButton.nativeElement.click();

        expect(component.nxOnOk.emit).toHaveBeenCalled();
        expect(component.handleClose).not.toHaveBeenCalled();
    });
});

@Component({
    template: `
        <nx-modal [nxTitle]="title" [nxSize]="size" [nxMask]="mask">
            <ng-template #header>
                Custom Header
            </ng-template>
            <ng-template #content>
                Custom Content
            </ng-template>
            <ng-template #footer>
                Custom Footer
            </ng-template>
            Default Content
        </nx-modal>
    `,
    standalone: true,
    imports: [ModalComponent],
})
class TestTemplateComponent {
    title = 'Test Modal';
    size: 'small' | 'default' | 'large' | 'fullscreen' = 'default';
    mask = true;
}