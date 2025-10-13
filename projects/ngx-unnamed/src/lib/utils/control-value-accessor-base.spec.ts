import { ControlValueAccessorBase } from './control-value-accessor-base';

// Test implementation of the abstract class
class TestControlValueAccessor extends ControlValueAccessorBase<string> {
    // Expose protected methods for testing
    public testEmitChange(value: string | null): void {
        this.emitChange(value);
    }

    public testMarkAsTouched(): void {
        this.markAsTouched();
    }

    public getValue(): string | null {
        return this.value;
    }

    public isDisabled(): boolean {
        return this.disabled;
    }
}

describe('ControlValueAccessorBase', () => {
    let accessor: TestControlValueAccessor;

    beforeEach(() => {
        accessor = new TestControlValueAccessor();
    });

    describe('initialization', () => {
        it('should create an instance', () => {
            expect(accessor).toBeTruthy();
        });

        it('should initialize with null value', () => {
            expect(accessor.getValue()).toBeNull();
        });

        it('should initialize with disabled as false', () => {
            expect(accessor.isDisabled()).toBe(false);
        });
    });

    describe('writeValue', () => {
        it('should write a string value', () => {
            accessor.writeValue('test value');
            expect(accessor.getValue()).toBe('test value');
        });

        it('should write null value', () => {
            accessor.writeValue('initial');
            accessor.writeValue(null);
            expect(accessor.getValue()).toBeNull();
        });

        it('should overwrite existing value', () => {
            accessor.writeValue('first');
            accessor.writeValue('second');
            expect(accessor.getValue()).toBe('second');
        });
    });

    describe('registerOnChange', () => {
        it('should register onChange callback', () => {
            const callback = jasmine.createSpy('onChange');
            accessor.registerOnChange(callback);
            accessor.testEmitChange('test');
            expect(callback).toHaveBeenCalledWith('test');
        });

        it('should replace previous onChange callback', () => {
            const firstCallback = jasmine.createSpy('firstOnChange');
            const secondCallback = jasmine.createSpy('secondOnChange');

            accessor.registerOnChange(firstCallback);
            accessor.registerOnChange(secondCallback);
            accessor.testEmitChange('test');

            expect(firstCallback).not.toHaveBeenCalled();
            expect(secondCallback).toHaveBeenCalledWith('test');
        });
    });

    describe('registerOnTouched', () => {
        it('should register onTouched callback', () => {
            const callback = jasmine.createSpy('onTouched');
            accessor.registerOnTouched(callback);
            accessor.testMarkAsTouched();
            expect(callback).toHaveBeenCalled();
        });

        it('should replace previous onTouched callback', () => {
            const firstCallback = jasmine.createSpy('firstOnTouched');
            const secondCallback = jasmine.createSpy('secondOnTouched');

            accessor.registerOnTouched(firstCallback);
            accessor.registerOnTouched(secondCallback);
            accessor.testMarkAsTouched();

            expect(firstCallback).not.toHaveBeenCalled();
            expect(secondCallback).toHaveBeenCalled();
        });
    });

    describe('setDisabledState', () => {
        it('should set disabled to true', () => {
            accessor.setDisabledState(true);
            expect(accessor.isDisabled()).toBe(true);
        });

        it('should set disabled to false', () => {
            accessor.setDisabledState(true);
            accessor.setDisabledState(false);
            expect(accessor.isDisabled()).toBe(false);
        });

        it('should toggle disabled state multiple times', () => {
            accessor.setDisabledState(true);
            expect(accessor.isDisabled()).toBe(true);
            accessor.setDisabledState(false);
            expect(accessor.isDisabled()).toBe(false);
            accessor.setDisabledState(true);
            expect(accessor.isDisabled()).toBe(true);
        });
    });

    describe('emitChange', () => {
        it('should emit value changes through onChange callback', () => {
            const callback = jasmine.createSpy('onChange');
            accessor.registerOnChange(callback);
            accessor.testEmitChange('new value');
            expect(callback).toHaveBeenCalledWith('new value');
        });

        it('should update internal value when emitting', () => {
            accessor.testEmitChange('updated');
            expect(accessor.getValue()).toBe('updated');
        });

        it('should emit null values', () => {
            const callback = jasmine.createSpy('onChange');
            accessor.registerOnChange(callback);
            accessor.testEmitChange(null);
            expect(callback).toHaveBeenCalledWith(null);
            expect(accessor.getValue()).toBeNull();
        });

        it('should work without registered callback', () => {
            expect(() => accessor.testEmitChange('test')).not.toThrow();
        });
    });

    describe('markAsTouched', () => {
        it('should call onTouched callback', () => {
            const callback = jasmine.createSpy('onTouched');
            accessor.registerOnTouched(callback);
            accessor.testMarkAsTouched();
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should work without registered callback', () => {
            expect(() => accessor.testMarkAsTouched()).not.toThrow();
        });

        it('should call onTouched multiple times', () => {
            const callback = jasmine.createSpy('onTouched');
            accessor.registerOnTouched(callback);
            accessor.testMarkAsTouched();
            accessor.testMarkAsTouched();
            accessor.testMarkAsTouched();
            expect(callback).toHaveBeenCalledTimes(3);
        });
    });

    describe('type safety with generics', () => {
        it('should work with number type', () => {
            class NumberAccessor extends ControlValueAccessorBase<number> {
                public testEmit(val: number | null): void {
                    this.emitChange(val);
                }
                public getVal(): number | null {
                    return this.value;
                }
            }

            const numAccessor = new NumberAccessor();
            const callback = jasmine.createSpy('onChange');
            numAccessor.registerOnChange(callback);
            numAccessor.writeValue(42);
            expect(numAccessor.getVal()).toBe(42);
            numAccessor.testEmit(100);
            expect(callback).toHaveBeenCalledWith(100);
        });

        it('should work with object type', () => {
            interface TestObject {
                id: number;
                name: string;
            }

            class ObjectAccessor extends ControlValueAccessorBase<TestObject> {
                public testEmit(val: TestObject | null): void {
                    this.emitChange(val);
                }
                public getVal(): TestObject | null {
                    return this.value;
                }
            }

            const objAccessor = new ObjectAccessor();
            const testObj = { id: 1, name: 'test' };
            objAccessor.writeValue(testObj);
            expect(objAccessor.getVal()).toEqual(testObj);
        });
    });

    describe('integration scenarios', () => {
        it('should handle complete form control lifecycle', () => {
            const onChangeCallback = jasmine.createSpy('onChange');
            const onTouchedCallback = jasmine.createSpy('onTouched');

            // Register callbacks (simulating Angular forms)
            accessor.registerOnChange(onChangeCallback);
            accessor.registerOnTouched(onTouchedCallback);

            // Write initial value (simulating formControl.setValue)
            accessor.writeValue('initial');
            expect(accessor.getValue()).toBe('initial');
            expect(onChangeCallback).not.toHaveBeenCalled();

            // User interacts and changes value
            accessor.testEmitChange('user input');
            expect(onChangeCallback).toHaveBeenCalledWith('user input');
            expect(accessor.getValue()).toBe('user input');

            // User blurs field
            accessor.testMarkAsTouched();
            expect(onTouchedCallback).toHaveBeenCalled();

            // Disable control
            accessor.setDisabledState(true);
            expect(accessor.isDisabled()).toBe(true);
        });

        it('should handle value changes while disabled', () => {
            const callback = jasmine.createSpy('onChange');
            accessor.registerOnChange(callback);
            accessor.setDisabledState(true);

            // Value can still be changed programmatically
            accessor.testEmitChange('changed while disabled');
            expect(callback).toHaveBeenCalledWith('changed while disabled');
            expect(accessor.getValue()).toBe('changed while disabled');
        });
    });
});
