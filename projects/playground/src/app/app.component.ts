import { JsonPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {
    ButtonComponent,
    InputDirective,
    NxIconDirective,
    SelectComponent,
    ModalComponent,
    ModalService,
    // Import utilities for validation (unused in template but validates exports)
    ControlValueAccessorBase,
    FocusMonitor,
    OverlayService,
    ResponsiveUtility,
    A11yUtility,
} from 'ngx-unnamed';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonComponent, NxIconDirective, InputDirective, SelectComponent, ModalComponent, FormsModule, ReactiveFormsModule, JsonPipe],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'playground';
    modalService = inject(ModalService);

    @ViewChild('modal') modalComponent!: any;

    // Form for testing input with reactive forms
    testForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        message: new FormControl(''),
        disabled: new FormControl({ value: 'This is disabled', disabled: true }),
    });

    // Select component examples data
    singleSelectValue = '';
    multiSelectValue: string[] = [];
    tagsSelectValue: string[] = [];

    basicOptions = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
        { label: 'Option 4', value: 'option4' },
        { label: 'Option 5', value: 'option5' },
    ];

    advancedOptions = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Orange', value: 'orange' },
        { label: 'Grape', value: 'grape' },
        { label: 'Strawberry', value: 'strawberry' },
        { label: 'Watermelon', value: 'watermelon' },
        { label: 'Pineapple', value: 'pineapple' },
        { label: 'Mango', value: 'mango' },
    ];

    disabledOptions = [
        { label: 'Available Option 1', value: 'available1' },
        { label: 'Disabled Option', value: 'disabled1', disabled: true },
        { label: 'Available Option 2', value: 'available2' },
        { label: 'Another Disabled', value: 'disabled2', disabled: true },
        { label: 'Available Option 3', value: 'available3' },
    ];

    // Modal state
    showModal = false;
    modalSize: 'small' | 'default' | 'large' | 'fullscreen' = 'default';
    modalTitle = 'Example Modal';
    modalContent = 'This is an example modal content. You can put any content here including forms, text, or other components.';

    // Modal methods
    openModal(title: string, content: string, size: 'small' | 'default' | 'large' | 'fullscreen' = 'default') {
        this.modalTitle = title;
        this.modalContent = content;
        this.modalSize = size;

        // Use the modal component's show method
        setTimeout(() => {
            if (this.modalComponent) {
                this.modalComponent.show();
            }
        });
    }

    closeModal() {
        // Use the modal component's hide method
        if (this.modalComponent) {
            this.modalComponent.hide();
        }
    }

    // Imperative modal methods
    showBasicModal() {
        const modalRef = this.modalService.create({
            title: 'Basic Modal',
            okText: 'OK',
            cancelText: 'Cancel',
        });

        modalRef.afterClose.subscribe(result => {
            console.log('Modal closed with result:', result);
        });
    }

    showConfirmModal() {
        const modalRef = this.modalService.confirm({
            title: 'Confirm Action',
            okDanger: true,
        });

        modalRef.afterClose.subscribe(result => {
            if (result.success) {
                alert('Action confirmed!');
            } else {
                alert('Action cancelled.');
            }
        });
    }

    showInfoModal() {
        const modalRef = this.modalService.info({
            title: 'Information',
        });

        modalRef.afterClose.subscribe(result => {
            console.log('Info modal acknowledged');
        });
    }

    showSuccessModal() {
        const modalRef = this.modalService.success({
            title: 'Success!',
        });

        modalRef.afterClose.subscribe(result => {
            console.log('Success modal acknowledged');
        });
    }

    showErrorModal() {
        const modalRef = this.modalService.error({
            title: 'Error Occurred',
        });

        modalRef.afterClose.subscribe(result => {
            console.log('Error modal acknowledged');
        });
    }

    showWarningModal() {
        const modalRef = this.modalService.warning({
            title: 'Warning',
        });

        modalRef.afterClose.subscribe(result => {
            console.log('Warning modal acknowledged');
        });
    }

    showLargeModal() {
        const modalRef = this.modalService.create({
            title: 'Large Modal with Complex Content',
            size: 'large',
        });
    }

    showFullscreenModal() {
        const modalRef = this.modalService.create({
            title: 'Fullscreen Modal',
            size: 'fullscreen',
        });
    }

    get nameInvalid() {
        const control = this.testForm.get('name');
        return control?.invalid && control?.touched;
    }

    get emailInvalid() {
        const control = this.testForm.get('email');
        return control?.invalid && control?.touched;
    }

    onSubmit() {
        if (this.testForm.valid) {
            console.log('Form submitted:', this.testForm.value);
            alert('Form submitted successfully! Check console for values.');
        } else {
            console.log('Form invalid');
            Object.keys(this.testForm.controls).forEach((key) => {
                this.testForm.get(key)?.markAsTouched();
            });
        }
    }
}
