import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormComponent, FormItemComponent, FormLabelComponent, FormControlComponent } from 'ngx-unnamed';
import { InputDirective } from 'ngx-unnamed';

@Component({
  selector: 'app-form-example',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormComponent,
    FormItemComponent,
    FormLabelComponent,
    FormControlComponent,
    InputDirective,
    JsonPipe
  ],
  template: `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="margin-bottom: 20px; color: #000;">Form Component Example</h2>

      <nx-form [formGroup]="contactForm" (ngSubmit)="handleSubmit()" layout="vertical">
        <nx-form-item>
          <nx-form-label [required]="true" label="Full Name"></nx-form-label>
          <nx-form-control [control]="contactForm.get('name')" [hasFeedback]="true">
            <input nx-input formControlName="name" placeholder="Enter your full name">
          </nx-form-control>
          @if (nameInvalid) {
            <div class="nx-form-item-explain-error">Name is required (minimum 2 characters)</div>
          }
        </nx-form-item>

        <nx-form-item>
          <nx-form-label [required]="true" label="Email Address"></nx-form-label>
          <nx-form-control [control]="contactForm.get('email')" [hasFeedback]="true">
            <input nx-input type="email" formControlName="email" placeholder="your.email@example.com">
          </nx-form-control>
          @if (emailInvalid) {
            <div class="nx-form-item-explain-error">Please enter a valid email address</div>
          }
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Subject"></nx-form-label>
          <nx-form-control [control]="contactForm.get('subject')">
            <select nx-input formControlName="subject">
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="feedback">Feedback</option>
              <option value="partnership">Partnership Opportunity</option>
            </select>
          </nx-form-control>
        </nx-form-item>

        <nx-form-item>
          <nx-form-label label="Message"></nx-form-label>
          <nx-form-control [control]="contactForm.get('message')">
            <textarea nx-input formControlName="message" placeholder="Your message here..." rows="4"></textarea>
          </nx-form-control>
          <div class="nx-form-item-extra">Please provide as much detail as possible</div>
        </nx-form-item>

        <nx-form-item>
          <nx-form-control>
            <div style="display: flex; gap: 1rem;">
              <button nx-button nxVariant="primary" type="submit">Send Message</button>
              <button nx-button nxVariant="outline" type="button" (click)="resetForm()">Clear</button>
            </div>
          </nx-form-control>
        </nx-form-item>
      </nx-form>

      <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 6px; font-size: 14px;">
        <strong>Form Status:</strong> {{ contactForm.valid ? '✅ Valid' : '❌ Invalid' }}
        <br><br>
        <strong>Form Data:</strong>
        <pre style="margin: 10px 0 0 0; font-size: 12px; white-space: pre-wrap;">{{ contactForm.value | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FormExampleComponent {
  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl(''),
    message: new FormControl('')
  });

  get nameInvalid() {
    const control = this.contactForm.get('name');
    return control?.invalid && control?.touched;
  }

  get emailInvalid() {
    const control = this.contactForm.get('email');
    return control?.invalid && control?.touched;
  }

  handleSubmit() {
    if (this.contactForm.valid) {
      console.log('Form submitted successfully:', this.contactForm.value);
      alert('✅ Form submitted successfully! Check console for data.');
      this.contactForm.reset();
    } else {
      console.log('Form is invalid');
      // Mark all controls as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  resetForm() {
    this.contactForm.reset();
  }
}