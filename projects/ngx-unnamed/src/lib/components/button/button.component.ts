import { CommonModule } from '@angular/common';
import {
    AfterContentInit,
    AfterViewInit,
    booleanAttribute,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { fromEvent, startWith, Subject, takeUntil } from 'rxjs';
import { NxIconDirective } from '../../../../../ngx-unnamed-icons/src/public-api';

export type NxButtonVariants = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'dashed' | 'link' | null;
export type NxButtonShapes = 'circle' | 'round' | null;
export type NxButtonSizes = 'large' | 'default' | 'small';

@Component({
    selector: 'button[nx-button], a[nx-button]',
    imports: [CommonModule],
    standalone: true,
    template: `
        @if (nxLoading) {
            <span class="spinner"></span>
        }
        <ng-content></ng-content>
    `,
    styleUrls: ['./style/button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'nx-btn',
        '[class.nx-btn-primary]': `nxVariant === 'primary'`,
        '[class.nx-btn-secondary]': `nxVariant === 'secondary'`,
        '[class.nx-btn-danger]': `nxVariant === 'danger'`,
        '[class.nx-btn-outline]': `nxVariant === 'outline'`,
        '[class.nx-btn-ghost]': `nxVariant === 'ghost'`,
        '[class.nx-btn-link]': `nxVariant === 'link'`,
        '[class.nx-btn-dashed]': `nxVariant === 'dashed'`,
        '[class.nx-btn-circle]': `nxShape === 'circle'`,
        '[class.nx-btn-round]': `nxShape === 'round'`,
        '[class.nx-btn-lg]': `nxSize === 'large'`,
        '[class.nx-btn-sm]': `nxSize === 'small'`,
        '[class.nx-btn-block]': `nxBlock`,
        '[attr.tabindex]': 'disabled ? -1 : (tabIndex === null ? null : tabIndex)',
        '[attr.disabled]': 'disabled || null',
    },
})
export class ButtonComponent implements OnDestroy, OnChanges, AfterViewInit, AfterContentInit, OnInit {
    @ContentChild(NxIconDirective, { read: ElementRef }) nzIconDirectiveElement!: ElementRef;
    @Input() nxVariant: NxButtonVariants = 'primary';
    @Input() nxShape: NxButtonShapes = null;
    @Input() nxSize: NxButtonSizes = 'default';
    @Input({ transform: booleanAttribute }) nxLoading: boolean = false;
    @Input({ transform: booleanAttribute }) disabled: boolean = false;
    @Input({ transform: booleanAttribute }) ghost: boolean = false;
    @Input({ transform: booleanAttribute }) danger: boolean = false;
    @Input({ transform: booleanAttribute }) nxBlock: boolean = false;
    @Input() tabIndex: number | null = null;

    private destroy$ = new Subject<void>();
    private loading$ = new Subject<boolean>();

    private ngZone = inject(NgZone);
    private elementRef = inject(ElementRef);
    private cdr = inject(ChangeDetectorRef);
    private renderer = inject(Renderer2);

    ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => {
            fromEvent<MouseEvent>(this.elementRef.nativeElement, 'click', { capture: true })
                .pipe(takeUntil(this.destroy$))
                .subscribe((event) => {
                    if ((this.disabled && (event.target as HTMLElement)?.tagName === 'A') || this.nxLoading) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    }
                });
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { nxLoading } = changes;
        if (nxLoading) {
            this.loading$.next(this.nxLoading);
        }
    }

    ngAfterViewInit(): void {
        this.insertSpan(this.elementRef.nativeElement.childNodes, this.renderer);
    }

    insertSpan(nodes: NodeList, renderer: Renderer2): void {
        nodes.forEach((node) => {
            if (node.nodeName === '#text') {
                const span = renderer.createElement('span');
                const parent = renderer.parentNode(node);
                renderer.insertBefore(parent, span, node);
                renderer.appendChild(span, node);
            }
        });
    }

    ngAfterContentInit(): void {
        this.loading$
            .pipe(
                startWith(this.nxLoading),
                //filter(() => !!this.nzIconDirectiveElement),
                takeUntil(this.destroy$)
            )
            .subscribe((loading) => {
                /*const nativeElement = this.nzIconDirectiveElement.nativeElement;
        if (loading) {
          this.renderer.setStyle(nativeElement, 'display', 'none');
        } else {
          this.renderer.removeStyle(nativeElement, 'display');
        }*/
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
