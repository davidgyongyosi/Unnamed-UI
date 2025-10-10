import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent, InputDirective, NxIconDirective } from 'ngx-unnamed';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonComponent, NxIconDirective, InputDirective, ReactiveFormsModule, JsonPipe],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'playground';

    // Form for testing input with reactive forms
    testForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        message: new FormControl(''),
        disabled: new FormControl({ value: 'This is disabled', disabled: true }),
    });

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
