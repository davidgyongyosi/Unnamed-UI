import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FormExampleComponent } from './form-example.component';
import {
    ButtonComponent,
    InputDirective,
    NxIconDirective,
    NxIconComponent,
    SelectComponent,
    SimpleTableComponent,
    NxModalService,
    ModalComponent,
    AlertComponent,
    FormComponent,
    FormItemComponent,
    FormLabelComponent,
    FormControlComponent,
    DropdownComponent,
    DropdownMenuComponent,
    BadgeComponent,
    TagComponent,
    NxGridComponent,
    NxGridColComponent,
    NxGridRowComponent,
    NxCardComponent,
    NxPaginationComponent,
    // Import dropdown types
    NxDropdownItem,
    NxDropdownItemClick,
    // Import badge types
    NxBadgeStatus,
    // Import tag types
    NxTagColor,
    // Import card types
    NxCardVariant,
} from 'ngx-unnamed';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, ButtonComponent, NxIconDirective, NxIconComponent, InputDirective, SelectComponent, SimpleTableComponent, ModalComponent, AlertComponent, FormComponent, FormItemComponent, FormLabelComponent, FormControlComponent, DropdownComponent, DropdownMenuComponent, BadgeComponent, TagComponent, NxGridComponent, NxGridColComponent, NxGridRowComponent, NxCardComponent, NxPaginationComponent, FormExampleComponent, FormsModule, ReactiveFormsModule, JsonPipe],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'playground';

    // Inject the new NxModalService
    nxModalService = inject(NxModalService);

    // Template modal state
    isTemplateModalVisible = false;
    templateModalTitle = 'Template Modal';
    templateModalContent = 'This is a template-based modal using the ModalComponent directly in the template.';

    // ViewChild reference for template modal
    @ViewChild('templateModal') templateModal!: any;

    // Form for testing input with reactive forms
    testForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        message: new FormControl(''),
        disabled: new FormControl({ value: 'This is disabled', disabled: true }),
    });

    // Select component examples data
    singleSelectValue = '';
    multiSelectValue: string[] = [];
    tagsSelectValue: string[] = [];

    basicOptions = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
        { label: 'Option 4', value: 'option4' },
        { label: 'Option 5', value: 'option5' },
    ];

    advancedOptions = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Orange', value: 'orange' },
        { label: 'Grape', value: 'grape' },
        { label: 'Strawberry', value: 'strawberry' },
        { label: 'Watermelon', value: 'watermelon' },
        { label: 'Pineapple', value: 'pineapple' },
        { label: 'Mango', value: 'mango' },
    ];

    disabledOptions = [
        { label: 'Available Option 1', value: 'available1' },
        { label: 'Disabled Option', value: 'disabled1', disabled: true },
        { label: 'Available Option 2', value: 'available2' },
        { label: 'Another Disabled', value: 'disabled2', disabled: true },
        { label: 'Available Option 3', value: 'available3' },
    ];

    get nameInvalid() {
        const control = this.testForm.get('name');
        return control?.invalid && control?.touched;
    }

    get testFormEmailInvalid() {
        const control = this.testForm.get('email');
        return control?.invalid && control?.touched;
    }

    // Table data for demo
    tableData = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', department: 'Engineering' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', department: 'Design' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', department: 'Management' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Developer', department: 'Engineering' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'QA Engineer', department: 'Quality' }
    ];

    tableColumns = [
        { key: 'id', title: 'ID', width: '80px', sortable: true },
        { key: 'name', title: 'Name', sortable: true },
        { key: 'email', title: 'Email', width: '200px' },
        { key: 'role', title: 'Role', sortable: true },
        { key: 'department', title: 'Department', sortable: true }
    ];

    onTableSort(event: { key: string; direction: 'asc' | 'desc' }) {
        console.log('Table sort:', event);
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

    // Modal testing methods
    showBasicModal() {
        const modalRef = this.nxModalService.create({
            nxTitle: 'Basic Modal',
            nxContent: 'This is a basic modal created with NxModalService.',
            nxOkText: 'OK',
            nxCancelText: 'Cancel'
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Basic modal closed with result:', result);
        });
    }

    showConfirmModal() {
        const modalRef = this.nxModalService.confirm({
            nxTitle: 'Confirm Action',
            nxContent: 'Are you sure you want to perform this action? This operation cannot be undone.',
            nxOkText: 'Confirm',
            nxCancelText: 'Cancel',
            nxOkDanger: true
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Confirm modal closed with result:', result);
            if (result?.success) {
                alert('Action confirmed!');
            }
        });
    }

    showInfoModal() {
        const modalRef = this.nxModalService.info({
            nxTitle: 'Information',
            nxContent: 'This is an informational modal with some important details for the user.',
            nxOkText: 'Got it'
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Info modal closed with result:', result);
        });
    }

    showSuccessModal() {
        const modalRef = this.nxModalService.success({
            nxTitle: 'Success!',
            nxContent: 'The operation has been completed successfully. Your changes have been saved.',
            nxOkText: 'Great!'
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Success modal closed with result:', result);
        });
    }

    showErrorModal() {
        const modalRef = this.nxModalService.error({
            nxTitle: 'Error Occurred',
            nxContent: 'An unexpected error has occurred. Please try again later or contact support.',
            nxOkText: 'Dismiss'
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Error modal closed with result:', result);
        });
    }

    showWarningModal() {
        const modalRef = this.nxModalService.warning({
            nxTitle: 'Warning',
            nxContent: 'Please be aware that this action may have unintended consequences. Proceed with caution.',
            nxOkText: 'Proceed',
            nxCancelText: 'Cancel',
            nxOkDanger: true
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Warning modal closed with result:', result);
        });
    }

    showCustomModal() {
        const modalRef = this.nxModalService.create({
            nxTitle: 'Custom Styled Modal',
            nxContent: 'This modal has custom styling configuration and a larger width.',
            nxOkText: 'Custom OK',
            nxCancelText: 'Custom Cancel',
            nxWidth: 600,
            nxCentered: true,
            nxMaskClosable: true
        });

        modalRef.afterClose.subscribe((result: any) => {
            console.log('Custom modal closed with result:', result);
        });
    }

    // Template modal methods
    showTemplateModal() {
        this.templateModalTitle = 'Template Modal';
        this.templateModalContent = 'This is a template-based modal using the ModalComponent directly in the template.';
        this.isTemplateModalVisible = true;
        // Use setTimeout to ensure the component is ready
        setTimeout(() => {
            if (this.templateModal) {
                this.templateModal.show();
            }
        }, 0);
    }

    closeTemplateModal() {
        if (this.templateModal) {
            this.templateModal.hide();
        }
        this.isTemplateModalVisible = false;
    }

    handleTemplateModalOk() {
        console.log('Template modal OK clicked');
        this.closeTemplateModal();
        alert('Template modal confirmed!');
    }

    handleTemplateModalCancel() {
        console.log('Template modal Cancel clicked');
        this.closeTemplateModal();
    }

    showAdvancedTemplateModal() {
        this.templateModalTitle = 'Advanced Template Modal';
        this.templateModalContent = 'This template modal demonstrates more complex content and custom button configurations.';
        this.isTemplateModalVisible = true;
        // Use setTimeout to ensure the component is ready
        setTimeout(() => {
            if (this.templateModal) {
                this.templateModal.show();
            }
        }, 0);
    }

    // Form Component demo data and methods
    profileForm = new FormGroup({
        firstName: new FormControl('John', Validators.required),
        lastName: new FormControl('Doe', Validators.required),
        email: new FormControl('john.doe@example.com', [Validators.required, Validators.email]),
        phone: new FormControl('', Validators.pattern(/^\d{10}$/)),
        bio: new FormControl('Software developer with a passion for creating user-friendly interfaces.'),
        terms: new FormControl(false, Validators.requiredTrue)
    });

    searchForm = new FormGroup({
        query: new FormControl(''),
        category: new FormControl('all'),
        dateRange: new FormControl('7days')
    });

    inlineForm = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    });

    get firstNameInvalid() {
        const control = this.profileForm.get('firstName');
        return control?.invalid && control?.touched;
    }

    get lastNameInvalid() {
        const control = this.profileForm.get('lastName');
        return control?.invalid && control?.touched;
    }

    get emailInvalid() {
        const control = this.profileForm.get('email');
        return control?.invalid && control?.touched;
    }

    get phoneInvalid() {
        const control = this.profileForm.get('phone');
        return control?.invalid && control?.touched;
    }

    get termsInvalid() {
        const control = this.profileForm.get('terms');
        return control?.invalid && control?.touched;
    }

    onProfileSubmit() {
        if (this.profileForm.valid) {
            console.log('Profile form submitted:', this.profileForm.value);
            alert('Profile updated successfully! Check console for values.');
        } else {
            console.log('Profile form invalid');
            Object.keys(this.profileForm.controls).forEach((key) => {
                this.profileForm.get(key)?.markAsTouched();
            });
        }
    }

    onSearchSubmit() {
        console.log('Search form submitted:', this.searchForm.value);
        alert(`Searching for: ${this.searchForm.value.query} in ${this.searchForm.value.category}`);
    }

    onInlineSubmit() {
        console.log('Inline form submitted:', this.inlineForm.value);
        alert(`Login attempt: ${this.inlineForm.value.username}`);
    }

    resetProfileForm() {
        this.profileForm.reset({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '',
            bio: 'Software developer with a passion for creating user-friendly interfaces.',
            terms: false
        });
    }

    // Dropdown demo data
    dropdownItems: NxDropdownItem[] = [
        { key: 'edit', label: 'Edit', icon: 'pencil-simple' },
        { key: 'copy', label: 'Copy', icon: 'copy-simple' },
        { key: 'delete', label: 'Delete', icon: 'trash', danger: true },
        { key: 'divider1', label: '', type: 'divider' },
        { key: 'export', label: 'Export', icon: 'download-simple' },
        { key: 'print', label: 'Print', icon: 'download-simple' }
    ];

    menuItems: NxDropdownItem[] = [
        { key: 'profile', label: 'Profile', icon: 'user' },
        { key: 'settings', label: 'Settings', icon: 'gear' },
        { key: 'divider1', label: '', type: 'divider' },
        { key: 'team', label: 'Team', icon: 'users' },
        { key: 'projects', label: 'Projects', icon: 'folder-simple' },
        { key: 'divider2', label: '', type: 'divider' },
        { key: 'logout', label: 'Logout', icon: 'sign-out', danger: true }
    ];

    selectionItems: NxDropdownItem[] = [
        { key: 'option1', label: 'Option 1', selected: true },
        { key: 'option2', label: 'Option 2' },
        { key: 'option3', label: 'Option 3' },
        { key: 'option4', label: 'Option 4', disabled: true },
        { key: 'option5', label: 'Option 5' }
    ];

    // Dropdown event handlers
    onDropdownItemClick(event: NxDropdownItemClick) {
        console.log('Dropdown item clicked:', event.item.key);
        alert(`Action: ${event.item.label}`);
    }

    onDropdownVisibleChange(event: { visible: boolean; dropdown: HTMLElement }) {
        console.log('Dropdown visibility changed:', event.visible);
    }

    // Selected items for selection demo
    selectedItems: string[] = ['option1'];

    updateSelection(items: NxDropdownItem[]) {
        this.selectedItems = items.filter(item => item.selected).map(item => item.key);
        console.log('Selected items:', this.selectedItems);
    }

    // Badge demo data
    notificationCount = 3;
    messageCount = 12;
    userStatus: NxBadgeStatus = 'success';
    cartCount = 0;

    // Badge demo methods
    incrementNotifications() {
        this.notificationCount++;
    }

    incrementMessages() {
        this.messageCount++;
    }

    toggleUserStatus() {
        const statuses: NxBadgeStatus[] = ['success', 'error', 'warning', 'info'];
        const currentIndex = statuses.indexOf(this.userStatus);
        this.userStatus = statuses[(currentIndex + 1) % statuses.length];
    }

    addToCart() {
        this.cartCount++;
    }

    clearCart() {
        this.cartCount = 0;
    }

    // Tag demo data
    selectedTags: string[] = ['JavaScript', 'TypeScript'];
    filterTags: string[] = [];
    skillTags = [
        { label: 'JavaScript', value: 'javascript', selected: true },
        { label: 'TypeScript', value: 'typescript', selected: true },
        { label: 'React', value: 'react', selected: false },
        { label: 'Vue', value: 'vue', selected: false },
        { label: 'Angular', value: 'angular', selected: false },
        { label: 'Node.js', value: 'nodejs', selected: false },
    ];

    categoryTags = [
        { label: 'Frontend', value: 'frontend', color: 'info' as NxTagColor },
        { label: 'Backend', value: 'backend', color: 'success' as NxTagColor },
        { label: 'DevOps', value: 'devops', color: 'warning' as NxTagColor },
        { label: 'Database', value: 'database', color: 'processing' as NxTagColor },
        { label: 'Mobile', value: 'mobile', color: 'default' as NxTagColor },
    ];

    // Tag demo methods
    onTagChange(event: any) {
        const tag = event.content;
        if (event.checked) {
            if (!this.selectedTags.includes(tag)) {
                this.selectedTags.push(tag);
            }
        } else {
            const index = this.selectedTags.indexOf(tag);
            if (index > -1) {
                this.selectedTags.splice(index, 1);
            }
        }
    }

    onFilterChange(event: any) {
        const tag = event.content;
        if (event.checked) {
            if (!this.filterTags.includes(tag)) {
                this.filterTags.push(tag);
            }
        } else {
            const index = this.filterTags.indexOf(tag);
            if (index > -1) {
                this.filterTags.splice(index, 1);
            }
        }
    }

    onTagClose(event: any) {
        const value = event.value;
        this.categoryTags = this.categoryTags.filter(cat => cat.value !== value);
    }

    clearTags() {
        this.selectedTags = [];
        this.skillTags.forEach(tag => tag.selected = false);
    }

    clearFilters() {
        this.filterTags = [];
    }

    addRandomTag() {
        const colors: NxTagColor[] = ['default', 'success', 'error', 'warning', 'info', 'processing'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomTag = {
            label: `Tag ${Math.floor(Math.random() * 100)}`,
            value: `tag-${Math.floor(Math.random() * 100)}`,
            color: randomColor
        };
        this.categoryTags.push(randomTag);
    }

    // Grid demo data
    gridColumns = [
        { title: 'Column 1', content: 'This is a 4-column span', span: 4 },
        { title: 'Column 2', content: 'This is a 6-column span', span: 6 },
        { title: 'Column 3', content: 'This is a 8-column span', span: 8 },
        { title: 'Column 4', content: 'This is a 6-column span', span: 6 }
    ];

    gridItems = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Item ${i + 1}`,
        content: `Grid item content ${i + 1}`,
        span: Math.random() > 0.7 ? 2 : 1
    }));

    responsiveItems = [
        { title: 'Main Content', content: 'This is the main content area', xs: 2, sm: 4, md: 6, lg: 8, xl: 12 },
        { title: 'Sidebar', content: 'Sidebar content', xs: 2, sm: 2, md: 2, lg: 4, xl: 6 },
        { title: 'Widget 1', content: 'Small widget', xs: 2, sm: 2, md: 2, lg: 2, xl: 3 },
        { title: 'Widget 2', content: 'Another widget', xs: 2, sm: 2, md: 2, lg: 2, xl: 3 }
    ];

    // Grid configuration methods
    onGridColumnsChange(columns: number) {
        console.log('Grid columns changed:', columns);
    }

    onGridGapChange(gap: string) {
        console.log('Grid gap changed:', gap);
    }

    onColumnSpanChange(span: number) {
        console.log('Column span changed:', span);
    }

    onResponsiveChange() {
        console.log('Responsive grid behavior triggered');
    }

    // Predefined card action arrays
    basicCard1Actions = [
        { text: 'View', handler: () => this.onCardAction('view', 1) },
        { text: 'Edit', handler: () => this.onCardAction('edit', 1) }
    ];

    basicCard2Actions = [
        { text: 'More', handler: () => this.onCardAction('more', 2) }
    ];

    basicCard3Actions = [
        { text: 'Like', type: 'primary' as const, handler: () => this.onCardAction('like', 3) },
        { text: 'Share', handler: () => this.onCardAction('share', 3) },
        { text: 'Delete', type: 'danger' as const, handler: () => this.onCardAction('delete', 3) }
    ];

    // Card demo data
    basicCards = [
        {
            title: 'Basic Card 1',
            subtitle: 'This is a subtitle',
            content: 'This is the content for the first basic card. It demonstrates the default styling and layout.',
            actions: this.basicCard1Actions
        },
        {
            title: 'Basic Card 2',
            subtitle: '',
            content: 'A simpler card with just title and content.',
            actions: this.basicCard2Actions
        },
        {
            title: 'Basic Card 3',
            subtitle: 'With actions',
            content: 'This card has multiple action buttons.',
            actions: this.basicCard3Actions
        }
    ];

    // Predefined featured card actions
    featuredCard1Actions = [
        { text: 'Read More', type: 'primary' as const, handler: () => this.onCardAction('read', 1) },
        { text: 'Save', handler: () => this.onCardAction('save', 1) }
    ];

    featuredCard2Actions = [
        { text: 'Read More', type: 'primary' as const, handler: () => this.onCardAction('read', 2) }
    ];

    featuredCard3Actions = [
        { text: 'Read More', type: 'primary' as const, handler: () => this.onCardAction('read', 3) },
        { text: 'Save', handler: () => this.onCardAction('save', 3) }
    ];

    featuredCards = [
        {
            title: 'Mountain Landscape',
            subtitle: 'Beautiful mountain scenery',
            content: 'This card features a stunning cover image with detailed information about mountain landscapes and photography tips.',
            cover: 'https://picsum.photos/400/200?random=1',
            avatar: 'https://picsum.photos/100/100?random=101',
            hoverable: true,
            meta: [
                { key: 'views', value: '1,234', icon: 'eye-slash' },
                { key: 'likes', value: '56', icon: 'heart-straight' },
                { key: 'comments', value: '12', icon: 'chat' }
            ],
            actions: this.featuredCard1Actions
        },
        {
            title: 'Ocean Photography',
            subtitle: 'Capturing the perfect wave',
            content: 'Learn the techniques for ocean photography, from equipment selection to timing your shots perfectly.',
            cover: 'https://picsum.photos/400/200?random=2',
            avatar: 'https://picsum.photos/100/100?random=102',
            hoverable: true,
            meta: [
                { key: 'views', value: '892', icon: 'eye-slash' },
                { key: 'likes', value: '34', icon: 'heart-straight' }
            ],
            actions: this.featuredCard2Actions
        },
        {
            title: 'Urban Architecture',
            subtitle: 'Modern city designs',
            content: 'Explore the architectural marvels of modern cities and the stories behind their construction.',
            cover: 'https://picsum.photos/400/200?random=3',
            avatar: 'https://picsum.photos/100/100?random=103',
            hoverable: true,
            meta: [
                { key: 'views', value: '2,456', icon: 'eye-slash' },
                { key: 'likes', value: '123', icon: 'heart-straight' },
                { key: 'bookmarks', value: '45', icon: 'bookmark-simple' }
            ],
            actions: this.featuredCard3Actions
        }
    ];

    selectableCards = [
        {
            id: 1,
            title: 'Project Alpha',
            subtitle: 'Web Development',
            content: 'A comprehensive web application built with modern technologies.',
            selectable: true,
            selected: false
        },
        {
            id: 2,
            title: 'Project Beta',
            subtitle: 'Mobile App',
            content: 'Cross-platform mobile application with offline capabilities.',
            selectable: true,
            selected: false
        },
        {
            id: 3,
            title: 'Project Gamma',
            subtitle: 'Data Analytics',
            content: 'Advanced data visualization and analytics dashboard.',
            selectable: true,
            selected: false
        },
        {
            id: 4,
            title: 'Project Delta',
            subtitle: 'Machine Learning',
            content: 'AI-powered predictive modeling system.',
            selectable: true,
            selected: false
        }
    ];

    variantCards = [
        {
            title: 'Default Card',
            subtitle: 'Standard variant',
            content: 'This is the default card variant with light borders and small shadows.',
            variant: 'default' as NxCardVariant
        },
        {
            title: 'Bordered Card',
            subtitle: 'Blue border variant',
            content: 'This card uses the bordered variant with a distinctive blue border.',
            variant: 'bordered' as NxCardVariant
        },
        {
            title: 'Filled Card',
            subtitle: 'Gray background',
            content: 'This card uses the filled variant with a gray background.',
            variant: 'filled' as NxCardVariant
        },
        {
            title: 'Outlined Card',
            subtitle: 'Strong border',
            content: 'This card uses the outlined variant with a strong gray border.',
            variant: 'outlined' as NxCardVariant
        }
    ];

    // Card state management
    selectedCardIds: number[] = [];
    loadingCards = new Set<number>();

    // Predefined actions for cards (to avoid inline functions in template)
    simpleCardActions = [
        { text: 'View', handler: () => this.onCardAction('view', 1) }
    ];

    actionCardActions = [
        { text: 'Action', handler: () => this.onCardAction('action', 1) }
    ];

    disabledCardActions = [
        { text: 'Disabled', handler: () => this.onCardAction('disabled', 1), disabled: true }
    ];

    socialCardActions = [
        { text: 'Like', icon: 'heart-straight', type: 'primary' as const, handler: () => console.log('Liked') },
        { text: 'Comment', icon: 'chat', handler: () => console.log('Comment') },
        { text: 'Share', icon: 'share-fat', handler: () => console.log('Share') },
        { text: 'Save', icon: 'bookmark-simple', handler: () => console.log('Save') },
        { text: 'Report', icon: 'flag-banner', type: 'danger' as const, handler: () => console.log('Report') }
    ];

    // Card event handlers
    onCardClick(event: any) {
        console.log('Card clicked:', event.card.title);
    }

    onCardHover(event: any) {
        console.log('Card hover:', event.hovered ? 'entered' : 'left', event.card.title);
    }

    onCardSelect(event: any) {
        const card = this.selectableCards.find(c => c.id === event.card.id);
        if (card) {
            card.selected = event.selected;
            if (event.selected) {
                this.selectedCardIds.push(card.id);
            } else {
                this.selectedCardIds = this.selectedCardIds.filter(id => id !== card.id);
            }
        }
        console.log('Card selection changed:', event.card.title, 'selected:', event.selected);
    }

    onCardAction(action: string, cardId: number) {
        console.log(`Card action "${action}" triggered for card ${cardId}`);

        // Simulate some async action
        if (action === 'save') {
            this.loadingCards.add(cardId);
            setTimeout(() => {
                this.loadingCards.delete(cardId);
            }, 1000);
        }
    }

    // Demo methods for interactive controls
    toggleAllSelection() {
        const allSelected = this.selectableCards.every(card => card.selected);
        this.selectableCards.forEach(card => {
            card.selected = !allSelected;
        });
        this.selectedCardIds = allSelected ? [] : this.selectableCards.map(card => card.id);
    }

    clearSelection() {
        this.selectableCards.forEach(card => {
            card.selected = false;
        });
        this.selectedCardIds = [];
    }

    selectRandomCard() {
        const unselectedCards = this.selectableCards.filter(card => !card.selected);
        if (unselectedCards.length > 0) {
            const randomCard = unselectedCards[Math.floor(Math.random() * unselectedCards.length)];
            randomCard.selected = true;
            this.selectedCardIds.push(randomCard.id);
        }
    }

    // Loading simulation methods
    toggleLoading(cardId: number) {
        if (this.loadingCards.has(cardId)) {
            this.loadingCards.delete(cardId);
        } else {
            this.loadingCards.add(cardId);
            // Auto-remove loading after 2 seconds
            setTimeout(() => {
                this.loadingCards.delete(cardId);
            }, 2000);
        }
    }

    // Pagination data and methods
    paginationConfig = {
        current: 1,
        total: 10,
        totalItems: 100,
        pageSize: 10,
        variant: 'default' as const,
        size: 'default' as const,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: true,
        pageSizeOptions: [10, 20, 50, 100],
        disabled: false,
        simple: false
    };

    simplePaginationConfig = {
        current: 5,
        total: 20,
        totalItems: 200,
        pageSize: 10,
        variant: 'simple' as const,
        showTotal: false
    };

    miniPaginationConfig = {
        current: 3,
        total: 8,
        totalItems: 80,
        pageSize: 10,
        variant: 'mini' as const
    };

    largePaginationConfig = {
        current: 25,
        total: 100,
        totalItems: 1000,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true
    };

    disabledPaginationConfig = {
        current: 3,
        total: 8,
        totalItems: 80,
        pageSize: 10,
        disabled: true
    };

    // Pagination event handlers
    onPaginationChange(event: any) {
        console.log('Pagination changed:', event);

        // Update the appropriate config based on the pagination type
        if (event.type === 'size') {
            this.paginationConfig.current = event.page;
            this.paginationConfig.pageSize = event.pageSize;
            this.paginationConfig.totalItems = this.paginationConfig.total * event.pageSize;
        } else {
            this.paginationConfig.current = event.page;
        }
    }

    onSimplePaginationChange(event: any) {
        console.log('Simple pagination changed:', event);
        this.simplePaginationConfig.current = event.page;
    }

    onMiniPaginationChange(event: any) {
        console.log('Mini pagination changed:', event);
        this.miniPaginationConfig.current = event.page;
    }

    onLargePaginationChange(event: any) {
        console.log('Large pagination changed:', event);

        if (event.type === 'size') {
            this.largePaginationConfig.current = event.page;
            this.largePaginationConfig.pageSize = event.pageSize;
            this.largePaginationConfig.totalItems = this.largePaginationConfig.total * event.pageSize;
        } else {
            this.largePaginationConfig.current = event.page;
        }
    }

    // Helper method to generate demo data for pagination
    generateDemoData(total: number) {
        return Array.from({ length: total }, (_, i) => ({
            id: i + 1,
            name: `Item ${i + 1}`,
            description: `Description for item ${i + 1}`,
            category: `Category ${(i % 5) + 1}`,
            date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toLocaleDateString()
        }));
    }
}