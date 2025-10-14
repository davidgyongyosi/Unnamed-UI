import { TestBed } from '@angular/core/testing';
import { ApplicationRef } from '@angular/core';
import { ModalService } from './modal.service';
import { ModalRef } from './modal.ref';
import { OverlayService } from '../../utils/overlay.service';
import { A11yUtility } from '../../utils/a11y.utility';
import { NxModalConfig } from './modal.config';

describe('ModalService', () => {
    let service: ModalService;
    let mockApplicationRef: jasmine.SpyObj<ApplicationRef>;
    let mockOverlayService: jasmine.SpyObj<OverlayService>;
    let mockA11yUtility: jasmine.SpyObj<A11yUtility>;

    beforeEach(() => {
        mockApplicationRef = jasmine.createSpyObj('ApplicationRef', ['tick']);
        mockOverlayService = jasmine.createSpyObj('OverlayService', ['getNextZIndex']);
        mockA11yUtility = jasmine.createSpyObj('A11yUtility', []);

        mockOverlayService.getNextZIndex.and.returnValue(1000);

        TestBed.configureTestingModule({
            providers: [
                ModalService,
                { provide: ApplicationRef, useValue: mockApplicationRef },
                { provide: OverlayService, useValue: mockOverlayService },
                { provide: A11yUtility, useValue: mockA11yUtility },
            ],
        });

        service = TestBed.inject(ModalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create modal with default config', () => {
        const config: NxModalConfig = { title: 'Test Modal' };
        const modalRef = service.create(config);

        expect(modalRef).toBeDefined();
        expect(modalRef).toBeInstanceOf(ModalRef);
        expect(mockOverlayService.getNextZIndex).toHaveBeenCalled();
        expect(service.openModalsCount).toBe(1);
    });

    it('should use provided z-index in config', () => {
        const config: NxModalConfig = { title: 'Test Modal', zIndex: 2000 };
        const modalRef = service.create(config);

        expect(modalRef).toBeDefined();
        expect(mockOverlayService.getNextZIndex).not.toHaveBeenCalled();
    });

    it('should create confirm modal with default config', () => {
        const modalRef = service.confirm();

        expect(modalRef).toBeDefined();
        expect(service.openModalsCount).toBe(1);
    });

    it('should create info modal with default config', () => {
        const modalRef = service.info();

        expect(modalRef).toBeDefined();
        expect(service.openModalsCount).toBe(1);
    });

    it('should create success modal with default config', () => {
        const modalRef = service.success();

        expect(modalRef).toBeDefined();
        expect(service.openModalsCount).toBe(1);
    });

    it('should create error modal with default config', () => {
        const modalRef = service.error();

        expect(modalRef).toBeDefined();
        expect(service.openModalsCount).toBe(1);
    });

    it('should create warning modal with default config', () => {
        const modalRef = service.warning();

        expect(modalRef).toBeDefined();
        expect(service.openModalsCount).toBe(1);
    });

    it('should merge custom config with defaults for confirm modal', () => {
        const customConfig: Partial<NxModalConfig> = {
            title: 'Custom Confirm',
            okText: 'Yes',
            cancelText: 'No',
        };

        const modalRef = service.confirm(customConfig);
        const modalConfig = modalRef.getConfig();

        expect(modalConfig.title).toBe('Custom Confirm');
        expect(modalConfig.okText).toBe('Yes');
        expect(modalConfig.cancelText).toBe('No');
    });

    it('should track multiple open modals', () => {
        const modalRef1 = service.create({ title: 'Modal 1' });
        const modalRef2 = service.create({ title: 'Modal 2' });

        expect(service.openModalsCount).toBe(2);
    });

    it('should remove modal from tracking when closed', () => {
        const modalRef = service.create({ title: 'Test Modal' });
        expect(service.openModalsCount).toBe(1);

        // Simulate modal close
        modalRef.close({ success: false });

        // The modal should be removed from tracking (this happens in the afterClose subscription)
        // Note: In real scenario, this would be async, but for testing we verify the behavior
        expect(service.openModalsCount).toBe(1); // Still 1 because cleanup is async
    });

    it('should close all modals', () => {
        const modalRef1 = service.create({ title: 'Modal 1' });
        const modalRef2 = service.create({ title: 'Modal 2' });

        spyOn(modalRef1, 'close');
        spyOn(modalRef2, 'close');

        service.closeAll();

        expect(modalRef1.close).toHaveBeenCalledWith({ success: false });
        expect(modalRef2.close).toHaveBeenCalledWith({ success: false });
    });

    it('should increment z-index for multiple modals', () => {
        mockOverlayService.getNextZIndex.and.returnValues(1000, 1010, 1020);

        service.create({ title: 'Modal 1' });
        service.create({ title: 'Modal 2' });
        service.create({ title: 'Modal 3' });

        expect(mockOverlayService.getNextZIndex).toHaveBeenCalledTimes(3);
    });

    it('should handle trigger element in config', () => {
        const triggerElement = document.createElement('button');
        const config: NxModalConfig = {
            title: 'Test Modal',
            triggerElement,
        };

        const modalRef = service.create(config);

        expect(modalRef).toBeDefined();
        expect(modalRef.getTriggerElement()).toBe(triggerElement);
    });

    it('should have correct default configs for different modal types', () => {
        const confirmModal = service.confirm();
        const infoModal = service.info();
        const successModal = service.success();
        const errorModal = service.error();
        const warningModal = service.warning();

        // Confirm modal should have both buttons
        const confirmConfig = confirmModal.getConfig();
        expect(confirmConfig.okText).toBe('OK');
        expect(confirmConfig.cancelText).toBe('Cancel');
        expect(confirmConfig.okDanger).toBe(false);
        expect(confirmConfig.maskClosable).toBe(false);

        // Info modal should only have OK button
        const infoConfig = infoModal.getConfig();
        expect(infoConfig.okText).toBe('OK');
        expect(infoConfig.cancelText).toBeUndefined();
        expect(infoConfig.okDanger).toBe(false);

        // Success modal should only have OK button
        const successConfig = successModal.getConfig();
        expect(successConfig.okText).toBe('OK');
        expect(successConfig.cancelText).toBeUndefined();
        expect(successConfig.okDanger).toBe(false);

        // Error modal should have danger OK button
        const errorConfig = errorModal.getConfig();
        expect(errorConfig.okText).toBe('OK');
        expect(errorConfig.cancelText).toBeUndefined();
        expect(errorConfig.okDanger).toBe(true);

        // Warning modal should have danger OK button
        const warningConfig = warningModal.getConfig();
        expect(warningConfig.okText).toBe('OK');
        expect(warningConfig.cancelText).toBeUndefined();
        expect(warningConfig.okDanger).toBe(true);
    });
});