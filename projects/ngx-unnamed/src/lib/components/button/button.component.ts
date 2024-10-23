import { Component, Input, ElementRef, Renderer2, HostListener, HostBinding, booleanAttribute, OnDestroy, AfterViewInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

export type NxButtonVariants = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link' | null;
export type NxButtonShapes = 'circle' | 'round' | null;
export type NxButtonSizes = 'large' | 'small' | null;

@Component({
  selector: 'button[nx-button], a[nx-button]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span *ngIf="loading" class="spinner"></span>
    <ng-content *ngIf="!loading"></ng-content>
  `,
  styleUrls: ['./styles/button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nx-btn',
    '[class.nx-btn-primary]': `nxVariant === 'primary'`,
    '[class.nx-btn-secondary]': `nxVariant === 'secondary'`,
    '[class.nx-btn-danger]': `nxVariant === 'danger'`,
    '[class.nx-btn-outline]': `nxVariant === 'outline'`,
    '[class.nx-btn-ghost]': `nxVariant === 'ghost'`,
    '[class.nx-btn-link]': `nxVariant === 'link'`,
    '[class.nx-btn-circle]': `nxShape === 'circle'`,
    '[class.nx-btn-round]': `nxShape === 'round'`,
    '[class.nx-btn-lg]': `nxSize === 'large'`,
    '[class.nx-btn-sm]': `nxSize === 'small'`,
    '[attr.tabindex]': 'disabled ? -1 : (tabIndex === null ? null : tabIndex)',
    '[attr.disabled]': 'disabled || null'
  },
})
export class ButtonComponent implements OnDestroy, AfterViewInit, OnChanges {
  @Input() nxVariant: NxButtonVariants = null;
  @Input() nxShape: NxButtonShapes = null;
  @Input() nxSize: NxButtonSizes = null;
  @Input({ transform: booleanAttribute }) loading: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input({ transform: booleanAttribute }) ghost: boolean = false;
  @Input({ transform: booleanAttribute }) danger: boolean = false;
  @Input({ transform: booleanAttribute }) block: boolean = false;
  @Input() tabIndex: number | null = null;

  private destroy$ = new Subject<void>();

  // Dynamically generated class names based on inputs
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading'] && this.loading) {
      this.renderer.addClass(this.elementRef.nativeElement, 'nx-btn-loading');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'nx-btn-loading');
    }
  }

  ngAfterViewInit(): void {
    this.wrapTextNodes();
  }

  wrapTextNodes(): void {
    const childNodes = this.elementRef.nativeElement.childNodes;
    childNodes.forEach((node: Node) => {
      // Ensure the node is a text node and the text is not empty or null
      if (node.nodeType === Node.TEXT_NODE && (node as Text).nodeValue?.trim()) {
        const span = this.renderer.createElement('span');
        this.renderer.insertBefore(this.elementRef.nativeElement, span, node);
        this.renderer.appendChild(span, node);
      }
    });
  }
  
  

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
