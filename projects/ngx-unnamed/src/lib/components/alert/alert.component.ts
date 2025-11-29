import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { NxIconDirective } from '../icon/icon.directive';
import { NxAlertType, NxAlertIcons } from './alert.types';

@Component({
  selector: 'nx-alert',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NxIconDirective],
  template: `
    <div class="nx-alert" [class]="alertClasses()" role="alert" [attr.aria-label]="banner ? null : 'alert'">
      @if (showIconComputed()) {
        <span class="nx-alert-icon" nxIcon [type]="currentIcon()" theme="outline"></span>
      }

      <div class="nx-alert-content">
        @if (message) {
          <div class="nx-alert-message">{{ message }}</div>
        } @else {
          <div class="nx-alert-message">
            <ng-content></ng-content>
          </div>
        }

        @if (description) {
          <div class="nx-alert-description">{{ description }}</div>
        }

        @if (actionTemplate) {
          <div class="nx-alert-action">
            <ng-container [ngTemplateOutlet]="actionTemplate"></ng-container>
          </div>
        }
      </div>

      @if (closable) {
        <button
          nx-button
          nx-variant="ghost"
          nxSize="small"
          class="nx-alert-close"
          (click)="handleClose($event)"
          aria-label="Close alert"
        >
          <span nxIcon type="x-circle" theme="fill"></span>
        </button>
      }
    </div>
  `,
  styleUrl: './style/alert.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nx-alert-container',
    '[class.nx-alert-banner]': 'banner',
    '[class.nx-alert-closable]': 'closable',
    '[class.nx-alert-no-icon]': '!showIconComputed()',
  }
})
export class AlertComponent {
  @Input({ transform: booleanAttribute }) closable: boolean = false;
  @Input({ transform: booleanAttribute }) showIcon: boolean = true;
  @Input({ transform: booleanAttribute }) banner: boolean = false;
  @Input() type: NxAlertType = 'info';
  @Input() message?: string;
  @Input() description?: string;
  @Input() icon?: string;

  @Output() readonly nxOnClose = new EventEmitter<void>();

  @ContentChild('actionTemplate', { read: TemplateRef }) actionTemplate?: TemplateRef<any>;

  private readonly alertIcons: NxAlertIcons = {
    info: 'info',
    success: 'check-fat',
    warning: 'warning-circle',
    error: 'x-circle'
  };

  protected alertClasses = computed(() => {
    const classes = [
      'nx-alert',
      `nx-alert-${this.type}`
    ];

    if (this.banner) {
      classes.push('nx-alert-banner');
    }

    if (!this.showIconComputed()) {
      classes.push('nx-alert-no-icon');
    }

    return classes;
  });

  protected showIconComputed = computed(() => {
    return this.showIcon && !!(this.icon || this.alertIcons[this.type]);
  });

  protected currentIcon = computed(() => {
    return this.icon || this.alertIcons[this.type];
  });

  protected handleClose(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.nxOnClose.emit();
  }
}