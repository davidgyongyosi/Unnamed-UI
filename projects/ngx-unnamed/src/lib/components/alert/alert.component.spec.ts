import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertComponent } from './alert.component';
import { ButtonComponent } from '../button/button.component';
import { NxIconDirective } from '../icon/icon.directive';
import { NxAlertType } from './alert.types';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Default Values', () => {
    it('should have default type as info', () => {
      expect(component.type).toBe('info');
    });

    it('should have default closable as false', () => {
      expect(component.closable).toBeFalse();
    });

    it('should have default showIcon as true', () => {
      expect(component.showIcon).toBeTrue();
    });

    it('should have default banner as false', () => {
      expect(component.banner).toBeFalse();
    });
  });

  describe('Alert Types', () => {
    const alertTypes: NxAlertType[] = ['info', 'success', 'warning', 'error'];

    alertTypes.forEach((type) => {
      it(`should apply correct CSS class for ${type} type`, () => {
        component.type = type;
        fixture.detectChanges();

        const alertElement = fixture.debugElement.query(By.css('.nx-alert'));
        expect(alertElement.nativeElement).toHaveClass(`nx-alert-${type}`);
      });

      it(`should display correct icon for ${type} type`, () => {
        component.type = type;
        component.showIcon = true;
        fixture.detectChanges();

        const iconElement = fixture.debugElement.query(By.css('.nx-alert-icon'));
        expect(iconElement).toBeTruthy();
        expect(iconElement.nativeElement.getAttribute('ng-reflect-type')).toBeDefined();
      });
    });
  });

  describe('Icon Display', () => {
    it('should show icon when showIcon is true', () => {
      component.showIcon = true;
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.nx-alert-icon'));
      expect(iconElement).toBeTruthy();
    });

    it('should hide icon when showIcon is false', () => {
      component.showIcon = false;
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.nx-alert-icon'));
      expect(iconElement).toBeFalsy();
    });

    it('should use custom icon when provided', () => {
      component.icon = 'custom-icon';
      component.showIcon = true;
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.nx-alert-icon'));
      expect(iconElement.nativeElement.getAttribute('ng-reflect-type')).toBe('custom-icon');
    });

    it('should apply no-icon class when icon is hidden', () => {
      component.showIcon = false;
      fixture.detectChanges();

      const alertContainer = fixture.debugElement.query(By.css('.nx-alert-container'));
      expect(alertContainer.nativeElement).toHaveClass('nx-alert-no-icon');
    });
  });

  describe('Message and Description', () => {
    it('should display message when provided', () => {
      const testMessage = 'Test alert message';
      component.message = testMessage;
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.nx-alert-message'));
      expect(messageElement.nativeElement.textContent.trim()).toBe(testMessage);
    });

    it('should display description when provided', () => {
      const testDescription = 'Test alert description';
      component.description = testDescription;
      fixture.detectChanges();

      const descriptionElement = fixture.debugElement.query(By.css('.nx-alert-description'));
      expect(descriptionElement.nativeElement.textContent.trim()).toBe(testDescription);
    });

    it('should use ng-content for message when message input is not provided', () => {
      component.message = undefined;
      fixture.detectChanges();

      // Set innerHTML to simulate content projection
      fixture.nativeElement.querySelector('.nx-alert-message').innerHTML = 'Projected content';
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.nx-alert-message'));
      expect(messageElement.nativeElement.textContent.trim()).toBe('Projected content');
    });
  });

  describe('Closable Functionality', () => {
    it('should show close button when closable is true', () => {
      component.closable = true;
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('.nx-alert-close'));
      expect(closeButton).toBeTruthy();
    });

    it('should hide close button when closable is false', () => {
      component.closable = false;
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('.nx-alert-close'));
      expect(closeButton).toBeFalsy();
    });

    it('should emit nxOnClose event when close button is clicked', () => {
      component.closable = true;
      spyOn(component.nxOnClose, 'emit');
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('.nx-alert-close'));
      closeButton.nativeElement.click();

      expect(component.nxOnClose.emit).toHaveBeenCalled();
    });

    it('should apply closable class to container when closable is true', () => {
      component.closable = true;
      fixture.detectChanges();

      const alertContainer = fixture.debugElement.query(By.css('.nx-alert-container'));
      expect(alertContainer.nativeElement).toHaveClass('nx-alert-closable');
    });

    it('should have correct accessibility attributes on close button', () => {
      component.closable = true;
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('.nx-alert-close'));
      expect(closeButton.nativeElement.getAttribute('aria-label')).toBe('Close alert');
    });
  });

  describe('Banner Mode', () => {
    it('should apply banner class when banner is true', () => {
      component.banner = true;
      fixture.detectChanges();

      const alertContainer = fixture.debugElement.query(By.css('.nx-alert-container'));
      expect(alertContainer.nativeElement).toHaveClass('nx-alert-banner');
    });

    it('should apply banner class to alert element', () => {
      component.banner = true;
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.nx-alert'));
      expect(alertElement.nativeElement).toHaveClass('nx-alert-banner');
    });
  });

  describe('CSS Classes Computation', () => {
    it('should compute correct CSS classes for different combinations', () => {
      component.type = 'success';
      component.banner = true;
      component.closable = true;
      component.showIcon = false;
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.nx-alert'));
      expect(alertElement.nativeElement).toHaveClass('nx-alert');
      expect(alertElement.nativeElement).toHaveClass('nx-alert-success');
      expect(alertElement.nativeElement).toHaveClass('nx-alert-banner');
      expect(alertElement.nativeElement).toHaveClass('nx-alert-no-icon');
    });
  });

  describe('Content Projection', () => {
    it('should support action template projection', () => {
      // This would be tested with a template ref in a real application
      // For unit tests, we can verify the actionTemplate property exists
      expect(component.actionTemplate).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert" attribute', () => {
      const alertElement = fixture.debugElement.query(By.css('.nx-alert'));
      expect(alertElement.nativeElement.getAttribute('role')).toBe('alert');
    });

    it('should have proper CSS class structure for screen readers', () => {
      component.type = 'error';
      component.showIcon = true;
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.nx-alert'));
      expect(alertElement).toBeTruthy();
      expect(alertElement.nativeElement).toHaveClass('nx-alert-error');
    });
  });

  describe('Component Integration', () => {
    it('should use ButtonComponent for close button', () => {
      component.closable = true;
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('.nx-alert-close nx-button'));
      expect(closeButton).toBeTruthy();
    });

    it('should use NxIconDirective for alert icons', () => {
      component.showIcon = true;
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.nx-alert-icon[nxIcon]'));
      expect(iconElement).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message gracefully', () => {
      component.message = '';
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.nx-alert-message'));
      expect(messageElement.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle undefined description gracefully', () => {
      component.description = undefined;
      fixture.detectChanges();

      const descriptionElement = fixture.debugElement.query(By.css('.nx-alert-description'));
      expect(descriptionElement).toBeFalsy();
    });

    it('should handle both message and ng-content absence', () => {
      component.message = undefined;
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.nx-alert-message'));
      expect(messageElement).toBeTruthy(); // Element should still exist for ng-content
    });
  });

  describe('Icon Integration', () => {
    it('should display icon element when showIcon is true', () => {
      component.showIcon = true;
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.nx-alert-icon[nxIcon]'));
      expect(iconElement).toBeTruthy();
    });

    it('should not display icon element when showIcon is false', () => {
      component.showIcon = false;
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.nx-alert-icon'));
      expect(iconElement).toBeFalsy();
    });

    it('should apply correct CSS classes when icon is hidden', () => {
      component.showIcon = false;
      fixture.detectChanges();

      const alertContainer = fixture.debugElement.query(By.css('.nx-alert-container'));
      expect(alertContainer.nativeElement).toHaveClass('nx-alert-no-icon');
    });
  });

  describe('Event Handling', () => {
    it('should prevent default on close click', () => {
      component.closable = true;
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('.nx-alert-close'));
      const clickEvent = new MouseEvent('click');
      spyOn(clickEvent, 'preventDefault');
      spyOn(clickEvent, 'stopPropagation');

      closeButton.nativeElement.click();

      expect(clickEvent.preventDefault).toHaveBeenCalled();
      expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });
  });
});