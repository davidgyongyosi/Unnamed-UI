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
import { IconDefinition, ThemeType } from 'ngx-unnamed-icons';
import { NxIconComponent } from '../icon/icon.component';
import { NxIconDirective } from '../icon/icon.directive';

export type NxButtonVariants = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'dashed' | 'link' | null;
export type NxButtonShapes = 'circle' | 'round' | null;
export type NxButtonSizes = 'large' | 'default' | 'small';

@Component({
    selector: 'button[nx-button], a[nx-button]',
    imports: [CommonModule, NxIconComponent],
    standalone: true,
    template: `
        @if (nxLoading) {
            <span class="spinner"></span>
        }
        @if (nxIcon && !nxLoading) {
            <nx-icon class="nx-btn-icon" [type]="nxIcon" [theme]="nxIconTheme" />
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
        '[class.nx-btn-loading]': `nxLoading`,
        '[class.nx-btn-icon-only]': `iconOnly`,
        '[class.nx-btn-with-icon]': `!!nxIcon`,
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
    @Input() nxIcon?: string | IconDefinition;
    @Input() nxIconTheme?: ThemeType;

    private destroy$ = new Subject<void>();
    private loading$ = new Subject<boolean>();

    private ngZone = inject(NgZone);
    private elementRef = inject(ElementRef);
    private cdr = inject(ChangeDetectorRef);
    private renderer = inject(Renderer2);

    public get iconOnly(): boolean {
        const listOfNode = Array.from((this.elementRef?.nativeElement as HTMLButtonElement)?.childNodes || []);
        const noText = listOfNode.every((node) => node.nodeName !== '#text');
        const noSpan = listOfNode.filter((node) => {
            return !(node.nodeName === '#comment' || !!(node as HTMLElement)?.classList?.contains('nx-icon') || !!(node as HTMLElement)?.classList?.contains('nx-btn-icon'));
        }).length === 0;

        // Check for content-projected icons OR nxIcon input
        const hasIcon = !!this.nzIconDirectiveElement || !!this.nxIcon;
        return hasIcon && noSpan && noText;
    }

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
        this.loading$.pipe(startWith(this.nxLoading), takeUntil(this.destroy$)).subscribe((loading) => {
            if (this.nzIconDirectiveElement) {
                const nativeElement = this.nzIconDirectiveElement.nativeElement;
                if (loading) {
                    this.renderer.setStyle(nativeElement, 'display', 'none');
                } else {
                    this.renderer.removeStyle(nativeElement, 'display');
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
