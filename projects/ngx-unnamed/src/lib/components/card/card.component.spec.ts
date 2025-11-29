import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { axe } from 'jasmine-axe';

import { NxCardComponent } from './card.component';
import { NxIconComponent } from '../icon/icon.component';

describe('NxCardComponent', () => {
    let component: NxCardComponent;
    let fixture: ComponentFixture<NxCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NxCardComponent, NxIconComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(NxCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default card classes', () => {
        const cardElement = fixture.debugElement.query(By.css('div'));
        expect(cardElement.nativeElement.classList).toContain('nx-card');
        expect(cardElement.nativeElement.classList).toContain('nx-card-default');
        expect(cardElement.nativeElement.classList).toContain('nx-card-border-light');
        expect(cardElement.nativeElement.classList).toContain('nx-card-shadow-small');
    });

    it('should display title when provided', () => {
        component.title = 'Test Card Title';
        fixture.detectChanges();

        const titleElement = fixture.debugElement.query(By.css('.nx-card-title'));
        expect(titleElement).toBeTruthy();
        expect(titleElement.nativeElement.textContent).toBe('Test Card Title');
    });

    it('should display subtitle when provided', () => {
        component.subtitle = 'Test Card Subtitle';
        fixture.detectChanges();

        const subtitleElement = fixture.debugElement.query(By.css('.nx-card-subtitle'));
        expect(subtitleElement).toBeTruthy();
        expect(subtitleElement.nativeElement.textContent).toBe('Test Card Subtitle');
    });

    it('should display content when provided', () => {
        component.content = 'Test card content description';
        fixture.detectChanges();

        const contentElement = fixture.debugElement.query(By.css('.nx-card-content p'));
        expect(contentElement).toBeTruthy();
        expect(contentElement.nativeElement.textContent).toBe('Test card content description');
    });

    it('should display cover image when provided', () => {
        component.cover = 'https://example.com/image.jpg';
        component.title = 'Test';
        fixture.detectChanges();

        const coverElement = fixture.debugElement.query(By.css('.nx-card-cover img'));
        expect(coverElement).toBeTruthy();
        expect(coverElement.nativeElement.src).toContain('https://example.com/image.jpg');
    });

    it('should display avatar when provided', () => {
        component.avatar = 'https://example.com/avatar.jpg';
        component.title = 'Test';
        fixture.detectChanges();

        const avatarElement = fixture.debugElement.query(By.css('.nx-card-avatar img'));
        expect(avatarElement).toBeTruthy();
        expect(avatarElement.nativeElement.src).toContain('https://example.com/avatar.jpg');
    });

    it('should apply size classes correctly', () => {
        component.size = 'small';
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        expect(cardElement.nativeElement.classList).toContain('nx-card-small');
    });

    it('should apply variant classes correctly', () => {
        component.variant = 'bordered';
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        expect(cardElement.nativeElement.classList).toContain('nx-card-bordered');
    });

    it('should apply shadow classes correctly', () => {
        component.shadow = 'large';
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        expect(cardElement.nativeElement.classList).toContain('nx-card-shadow-large');
    });

    it('should show loading state', () => {
        component.loading = true;
        fixture.detectChanges();

        const loadingElement = fixture.debugElement.query(By.css('.nx-card-loading'));
        expect(loadingElement).toBeTruthy();
        expect(loadingElement.nativeElement.style.display).not.toBe('none');
    });

    it('should show selection indicator when selectable', () => {
        component.selectable = true;
        component.title = 'Test';
        fixture.detectChanges();

        const selectIndicator = fixture.debugElement.query(By.css('.nx-card-select-indicator'));
        expect(selectIndicator).toBeTruthy();
    });

    it('should show selected state when selected', () => {
        component.selectable = true;
        component.selected = true;
        component.title = 'Test';
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        const selectIndicator = fixture.debugElement.query(By.css('.nx-card-select-indicator'));

        expect(cardElement.nativeElement.classList).toContain('nx-card-selected');
        expect(selectIndicator.nativeElement.classList).toContain('selected');
    });

    it('should apply disabled state', () => {
        component.disabled = true;
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        expect(cardElement.nativeElement.classList).toContain('nx-card-disabled');
        expect(cardElement.nativeElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('should apply hoverable state', () => {
        component.hoverable = true;
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        expect(cardElement.nativeElement.classList).toContain('nx-card-hoverable');
    });

    it('should display actions when provided', () => {
        component.actions = [
            { text: 'Edit', type: 'primary', handler: () => {} },
            { text: 'Delete', type: 'danger', handler: () => {} }
        ];
        fixture.detectChanges();

        const actionElements = fixture.debugElement.queryAll(By.css('.nx-card-action'));
        expect(actionElements.length).toBe(2);
        expect(actionElements[0].nativeElement.textContent).toContain('Edit');
        expect(actionElements[1].nativeElement.textContent).toContain('Delete');
    });

    it('should display meta information when provided', () => {
        component.meta = [
            { key: 'views', value: '1,234', icon: 'eye' },
            { key: 'likes', value: '56', icon: 'heart' }
        ];
        fixture.detectChanges();

        const metaElements = fixture.debugElement.queryAll(By.css('.nx-card-meta-item'));
        expect(metaElements.length).toBe(2);
        expect(metaElements[0].nativeElement.textContent).toContain('1,234');
        expect(metaElements[1].nativeElement.textContent).toContain('56');
    });

    it('should emit cardClick event when clicked', () => {
        spyOn(component.cardClick, 'emit');
        component.title = 'Test';
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        cardElement.nativeElement.click();

        expect(component.cardClick.emit).toHaveBeenCalled();
    });

    it('should emit cardHover event on hover', () => {
        spyOn(component.cardHover, 'emit');
        component.hoverable = true;
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        cardElement.triggerEventHandler('mouseenter', new MouseEvent('mouseenter'));

        expect(component.cardHover.emit).toHaveBeenCalledWith({
            card: component.currentConfig(),
            hovered: true,
            event: jasmine.any(MouseEvent)
        });
    });

    it('should toggle selection when selectable card is clicked', () => {
        spyOn(component.cardSelect, 'emit');
        component.selectable = true;
        component.selected = false;
        component.title = 'Test';
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        cardElement.nativeElement.click();

        expect(component.cardSelect.emit).toHaveBeenCalledWith({
            card: component.currentConfig(),
            selected: true,
            event: jasmine.any(MouseEvent)
        });
    });

    it('should handle keyboard navigation for selectable cards', () => {
        spyOn(component.cardSelect, 'emit');
        component.selectable = true;
        component.selected = false;
        component.title = 'Test';
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));

        // Test Enter key
        cardElement.triggerEventHandler('keydown', { key: 'Enter', preventDefault: () => {} });
        expect(component.cardSelect.emit).toHaveBeenCalled();

        // Test Space key
        spyOn(component.cardSelect, 'emit');
        cardElement.triggerEventHandler('keydown', { key: ' ', preventDefault: () => {} });
        expect(component.cardSelect.emit).toHaveBeenCalled();
    });

    it('should prevent action clicks from bubbling up', () => {
        spyOn(component.cardClick, 'emit');
        component.actions = [
            { text: 'Action', handler: () => {} }
        ];
        fixture.detectChanges();

        const actionButton = fixture.debugElement.query(By.css('.nx-card-action'));
        actionButton.nativeElement.click();

        expect(component.cardClick.emit).not.toHaveBeenCalled();
    });

    it('should have correct action button classes', () => {
        const action = {
            text: 'Primary Action',
            type: 'primary' as const,
            handler: () => {}
        };
        component.actions = [action];
        fixture.detectChanges();

        const actionButton = fixture.debugElement.query(By.css('.nx-card-action'));
        expect(actionButton.nativeElement.classList).toContain('nx-card-action-primary');
    });

    it('should be accessible', async () => {
        component.title = 'Test Card';
        fixture.detectChanges();

        const results = await axe(fixture.nativeElement);
        expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
        component.selectable = true;
        component.title = 'Test Card';
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        expect(cardElement.nativeElement.getAttribute('role')).toBe('article');
        expect(cardElement.nativeElement.getAttribute('tabindex')).toBe('0');
        expect(cardElement.nativeElement.getAttribute('aria-label')).toBe('Test Card');
    });

    it('should handle empty configuration gracefully', () => {
        component.config = {};
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('div'));
        expect(cardElement).toBeTruthy();
        expect(cardElement.nativeElement.classList).toContain('nx-card');
    });
});

// Integration test for card component
@Component({
    selector: 'test-card-integration',
    standalone: true,
    imports: [NxCardComponent, NxIconComponent],
    template: `
        <div style="padding: 20px;">
            <nx-card
                [title]="card.title"
                [subtitle]="card.subtitle"
                [content]="card.content"
                [cover]="card.cover"
                [avatar]="card.avatar"
                [hoverable]="card.hoverable"
                [selectable]="card.selectable"
                [selected]="card.selected"
                [loading]="card.loading"
                [disabled]="card.disabled"
                [size]="card.size"
                [variant]="card.variant"
                [actions]="card.actions"
                [meta]="card.meta"
                (cardClick)="onCardClick($event)"
                (cardSelect)="onCardSelect($event)">
            </nx-card>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            max-width: 400px;
            margin: 0 auto;
        }
    `]
})
class TestCardIntegrationComponent {
    card = {
        title: 'Sample Card Title',
        subtitle: 'This is a sample subtitle',
        content: 'This is the main content of the card. It can contain detailed information about the card subject.',
        cover: 'https://picsum.photos/400/200',
        avatar: 'https://picsum.photos/100/100',
        hoverable: true,
        selectable: true,
        selected: false,
        loading: false,
        disabled: false,
        size: 'default' as const,
        variant: 'default' as const,
        actions: [
            { text: 'Like', icon: 'heart', handler: () => console.log('Liked') },
            { text: 'Share', icon: 'share', handler: () => console.log('Shared') },
            { text: 'More', icon: 'more', handler: () => console.log('More options') }
        ],
        meta: [
            { key: 'views', value: '1,234', icon: 'eye' },
            { key: 'likes', value: '56', icon: 'heart' },
            { key: 'comments', value: '12', icon: 'message' }
        ]
    };

    onCardClick(event: any) {
        console.log('Card clicked:', event);
    }

    onCardSelect(event: any) {
        this.card.selected = event.selected;
        console.log('Card selection changed:', event);
    }
}

describe('Card Integration Tests', () => {
    let component: TestCardIntegrationComponent;
    let fixture: ComponentFixture<TestCardIntegrationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestCardIntegrationComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestCardIntegrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create integrated card component', () => {
        expect(component).toBeTruthy();
    });

    it('should render complete card with all features', () => {
        const cardElement = fixture.debugElement.query(By.css('nx-card'));
        expect(cardElement).toBeTruthy();

        const title = fixture.debugElement.query(By.css('.nx-card-title'));
        const subtitle = fixture.debugElement.query(By.css('.nx-card-subtitle'));
        const content = fixture.debugElement.query(By.css('.nx-card-content'));
        const cover = fixture.debugElement.query(By.css('.nx-card-cover'));
        const avatar = fixture.debugElement.query(By.css('.nx-card-avatar'));
        const actions = fixture.debugElement.queryAll(By.css('.nx-card-action'));
        const meta = fixture.debugElement.queryAll(By.css('.nx-card-meta-item'));

        expect(title.nativeElement.textContent).toBe('Sample Card Title');
        expect(subtitle.nativeElement.textContent).toBe('This is a sample subtitle');
        expect(content.nativeElement.textContent).toContain('main content');
        expect(cover).toBeTruthy();
        expect(avatar).toBeTruthy();
        expect(actions.length).toBe(3);
        expect(meta.length).toBe(3);
    });

    it('should be accessible as a complete component', async () => {
        const results = await axe(fixture.nativeElement);
        expect(results).toHaveNoViolations();
    });

    it('should handle interaction events', () => {
        spyOn(component, 'onCardClick');
        spyOn(component, 'onCardSelect');

        const cardElement = fixture.debugElement.query(By.css('nx-card div'));
        cardElement.nativeElement.click();

        expect(component.onCardClick).toHaveBeenCalled();
        expect(component.onCardSelect).toHaveBeenCalled();
    });
});