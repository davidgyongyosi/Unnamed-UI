import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { FormItemComponent } from './form-item.component';
import { FormLabelComponent } from './form-label.component';
import { FormControlComponent } from './form-control.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default layout vertical', () => {
    expect(component.layout()).toBe('vertical');
  });

  it('should register and unregister form items', () => {
    const mockItem = { name: 'test', value: 'value', status: 'default' };

    component.registerFormItem(mockItem);
    expect(component.getFormItems()).toContain(mockItem);

    component.unregisterFormItem(mockItem);
    expect(component.getFormItems()).not.toContain(mockItem);
  });

  it('should emit submitted event on form submit', () => {
    spyOn(component.submitted, 'emit');
    spyOn(component.dataChange, 'emit');

    const mockItem = { name: 'testField', value: 'testValue' };
    component.registerFormItem(mockItem);

    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));

    expect(component.submitted.emit).toHaveBeenCalledWith({ testField: 'testValue' });
    expect(component.dataChange.emit).toHaveBeenCalledWith({ testField: 'testValue' });
    expect(component.data()).toEqual({ testField: 'testValue' });
  });

  it('should reset form when resetForm is called', () => {
    const mockItem = { name: 'test', value: 'value', reset: jasmine.createSpy('reset') };
    component.registerFormItem(mockItem);
    component.data.set({ test: 'value' });

    component.resetForm();

    expect(mockItem.reset).toHaveBeenCalled();
    expect(component.data()).toBeNull();
  });

  it('should validate form and return correct status', () => {
    const validItem = { name: 'valid', validate: () => true };
    const invalidItem = { name: 'invalid', validate: () => false };

    component.registerFormItem(validItem);
    component.registerFormItem(invalidItem);

    expect(component.validateForm()).toBe(false);
  });

  it('should have novalidate attribute by default', () => {
    const formElement = fixture.nativeElement.querySelector('form');
    expect(formElement.getAttribute('novalidate')).toBe('true');
  });
});

describe('FormItemComponent', () => {
  let component: FormItemComponent;
  let fixture: ComponentFixture<FormItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        FormComponent,
        FormItemComponent,
        FormLabelComponent,
        FormControlComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get validation status', () => {
    expect(component.getValidateStatus()).toBe('default');
  });

  it('should check if has errors', () => {
    expect(component.hasErrors()).toBe(false);
  });

  it('should validate correctly', () => {
    const isValid = component.validate();
    expect(isValid).toBe(true);
  });

  it('should reset correctly', () => {
    expect(() => component.reset()).not.toThrow();
  });
});

describe('FormLabelComponent', () => {
  let component: FormLabelComponent;
  let fixture: ComponentFixture<FormLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLabelComponent, FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get label text', () => {
    expect(component.getLabel()).toBe('');
  });

  it('should get required state', () => {
    expect(component.isRequired()).toBe(false);
  });
});

describe('FormControlComponent', () => {
  let component: FormControlComponent;
  let fixture: ComponentFixture<FormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormControlComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get validation status', () => {
    expect(component.getValidateStatus()).toBe('default');
  });

  it('should get errors from control', () => {
    expect(component.getErrors()).toBeNull();
  });

  it('should get control value', () => {
    expect(component.getValue()).toBeNull();
  });

  it('should validate control', () => {
    expect(component.validate()).toBe(true);
  });

  it('should check control states', () => {
    expect(component.isDirty()).toBe(false);
    expect(component.isTouched()).toBe(false);
    expect(component.isPending()).toBe(false);
    expect(component.isEnabled()).toBe(true);
  });

  it('should enable and disable control', () => {
    expect(() => {
      component.enable();
      component.disable();
    }).not.toThrow();
  });

  it('should reset control', () => {
    expect(() => component.reset()).not.toThrow();
  });

  it('should focus and blur control', () => {
    expect(() => {
      component.focus();
      component.blur();
    }).not.toThrow();
  });
});