import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FormExampleComponent } from './form-example.component';
import {
    ButtonComponent,
    InputDirective,
    NxIconDirective,
    SelectComponent,
    SimpleTableComponent,
    NxModalService,
    ModalComponent,
    AlertComponent,
    FormComponent,
    FormItemComponent,
    FormLabelComponent,
    FormControlComponent,
    // Import utilities for validation (unused in template but validates exports)
    ControlValueAccessorBase,
    FocusMonitor,
    OverlayService,
    ResponsiveUtility,
    A11yUtility,
} from 'ngx-unnamed';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, ButtonComponent, NxIconDirective, InputDirective, SelectComponent, SimpleTableComponent, ModalComponent, AlertComponent, FormComponent, FormItemComponent, FormLabelComponent, FormControlComponent, FormExampleComponent, FormsModule, ReactiveFormsModule, JsonPipe],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'playground';

    // Inject the new NxModalService
    nxModalService = inject(NxModalService);

    // Template modal state
    isTemplateModalVisible = false;
    templateModalTitle = 'Template Modal';
    templateModalContent = 'This is a template-based modal using the ModalComponent directly in the template.';

    // ViewChild reference for template modal
    @ViewChild('templateModal') templateModal!: any;

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

    get nameInvalid() {
        const control = this.testForm.get('name');
        return control?.invalid && control?.touched;
    }

    get testFormEmailInvalid() {
        const control = this.testForm.get('email');
        return control?.invalid && control?.touched;
    }

    // Table data for demo
    tableData = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', department: 'Engineering' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', department: 'Design' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', department: 'Management' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Developer', department: 'Engineering' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'QA Engineer', department: 'Quality' }
    ];

    tableColumns = [
        { key: 'id', title: 'ID', width: '80px', sortable: true },
        { key: 'name', title: 'Name', sortable: true },
        { key: 'email', title: 'Email', width: '200px' },
        { key: 'role', title: 'Role', sortable: true },
        { key: 'department', title: 'Department', sortable: true }
    ];

    onTableSort(event: { key: string; direction: 'asc' | 'desc' }) {
        console.log('Table sort:', event);
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

    // Modal testing methods
    showBasicModal() {
        const modalRef = this.nxModalService.create({
            nxTitle: 'Basic Modal',
            nxContent: 'This is a basic modal created with NxModalService.',
            nxOkText: 'OK',
            nxCancelText: 'Cancel'
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Basic modal closed with result:', result);
        });
    }

    showConfirmModal() {
        const modalRef = this.nxModalService.confirm({
            nxTitle: 'Confirm Action',
            nxContent: 'Are you sure you want to perform this action? This operation cannot be undone.',
            nxOkText: 'Confirm',
            nxCancelText: 'Cancel',
            nxOkDanger: true
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Confirm modal closed with result:', result);
            if (result?.success) {
                alert('Action confirmed!');
            }
        });
    }

    showInfoModal() {
        const modalRef = this.nxModalService.info({
            nxTitle: 'Information',
            nxContent: 'This is an informational modal with some important details for the user.',
            nxOkText: 'Got it'
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Info modal closed with result:', result);
        });
    }

    showSuccessModal() {
        const modalRef = this.nxModalService.success({
            nxTitle: 'Success!',
            nxContent: 'The operation has been completed successfully. Your changes have been saved.',
            nxOkText: 'Great!'
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Success modal closed with result:', result);
        });
    }

    showErrorModal() {
        const modalRef = this.nxModalService.error({
            nxTitle: 'Error Occurred',
            nxContent: 'An unexpected error has occurred. Please try again later or contact support.',
            nxOkText: 'Dismiss'
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Error modal closed with result:', result);
        });
    }

    showWarningModal() {
        const modalRef = this.nxModalService.warning({
            nxTitle: 'Warning',
            nxContent: 'Please be aware that this action may have unintended consequences. Proceed with caution.',
            nxOkText: 'Proceed',
            nxCancelText: 'Cancel',
            nxOkDanger: true
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Warning modal closed with result:', result);
        });
    }

    showCustomModal() {
        const modalRef = this.nxModalService.create({
            nxTitle: 'Custom Styled Modal',
            nxContent: 'This modal has custom styling configuration and a larger width.',
            nxOkText: 'Custom OK',
            nxCancelText: 'Custom Cancel',
            nxWidth: 600,
            nxCentered: true,
            nxMaskClosable: true
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Custom modal closed with result:', result);
        });
    }

    // Template modal methods
    showTemplateModal() {
        this.templateModalTitle = 'Template Modal';
        this.templateModalContent = 'This is a template-based modal using the ModalComponent directly in the template.';
        this.isTemplateModalVisible = true;
        // Use setTimeout to ensure the component is ready
        setTimeout(() => {
            if (this.templateModal) {
                this.templateModal.show();
            }
        }, 0);
    }

    closeTemplateModal() {
        if (this.templateModal) {
            this.templateModal.hide();
        }
        this.isTemplateModalVisible = false;
    }

    handleTemplateModalOk() {
        console.log('Template modal OK clicked');
        this.closeTemplateModal();
        alert('Template modal confirmed!');
    }

    handleTemplateModalCancel() {
        console.log('Template modal Cancel clicked');
        this.closeTemplateModal();
    }

    showAdvancedTemplateModal() {
        this.templateModalTitle = 'Advanced Template Modal';
        this.templateModalContent = 'This template modal demonstrates more complex content and custom button configurations.';
        this.isTemplateModalVisible = true;
        // Use setTimeout to ensure the component is ready
        setTimeout(() => {
            if (this.templateModal) {
                this.templateModal.show();
            }
        }, 0);
    }

    // Form Component demo data and methods
    profileForm = new FormGroup({
        firstName: new FormControl('John', Validators.required),
        lastName: new FormControl('Doe', Validators.required),
        email: new FormControl('john.doe@example.com', [Validators.required, Validators.email]),
        phone: new FormControl('', Validators.pattern(/^\d{10}$/)),
        bio: new FormControl('Software developer with a passion for creating user-friendly interfaces.'),
        terms: new FormControl(false, Validators.requiredTrue)
    });

    searchForm = new FormGroup({
        query: new FormControl(''),
        category: new FormControl('all'),
        dateRange: new FormControl('7days')
    });

    inlineForm = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    });

    get firstNameInvalid() {
        const control = this.profileForm.get('firstName');
        return control?.invalid && control?.touched;
    }

    get lastNameInvalid() {
        const control = this.profileForm.get('lastName');
        return control?.invalid && control?.touched;
    }

    get emailInvalid() {
        const control = this.profileForm.get('email');
        return control?.invalid && control?.touched;
    }

    get phoneInvalid() {
        const control = this.profileForm.get('phone');
        return control?.invalid && control?.touched;
    }

    get termsInvalid() {
        const control = this.profileForm.get('terms');
        return control?.invalid && control?.touched;
    }

    onProfileSubmit() {
        if (this.profileForm.valid) {
            console.log('Profile form submitted:', this.profileForm.value);
            alert('Profile updated successfully! Check console for values.');
        } else {
            console.log('Profile form invalid');
            Object.keys(this.profileForm.controls).forEach((key) => {
                this.profileForm.get(key)?.markAsTouched();
            });
        }
    }

    onSearchSubmit() {
        console.log('Search form submitted:', this.searchForm.value);
        alert(`Searching for: ${this.searchForm.value.query} in ${this.searchForm.value.category}`);
    }

    onInlineSubmit() {
        console.log('Inline form submitted:', this.inlineForm.value);
        alert(`Login attempt: ${this.inlineForm.value.username}`);
    }

    resetProfileForm() {
        this.profileForm.reset({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '',
            bio: 'Software developer with a passion for creating user-friendly interfaces.',
            terms: false
        });
    }
}