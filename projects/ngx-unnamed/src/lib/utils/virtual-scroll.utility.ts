import { signal, computed, inject, DestroyRef } from '@angular/core';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

/**
 * Configuration for virtual scrolling
 */
export interface VirtualScrollConfig {
    /** Height of each item in pixels */
    itemHeight: number;
    /** Height of the viewport in pixels */
    viewportHeight: number;
    /** Number of extra items to render outside viewport for smooth scrolling */
    buffer?: number;
}

/**
 * Virtual scrolling data for rendering
 */
export interface VirtualScrollData<T> {
    /** Items to render in viewport */
    visibleItems: { item: T; index: number; offset: number }[];
    /** Total height of the virtual container */
    totalHeight: number;
    /** Current scroll position */
    scrollTop: number;
    /** Index of the first visible item */
    startIndex: number;
    /** Index of the last visible item */
    endIndex: number;
}

/**
 * Service for handling virtual scrolling of large datasets
 *
 * @example
 * ```typescript
 * const virtualScroller = new VirtualScroller();
 * virtualScroller.configure(items, { itemHeight: 32, viewportHeight: 256 });
 * virtualScroller.scrollToIndex(50);
 * ```
 */
export class VirtualScroller<T = any> {
    private destroyRef = inject(DestroyRef);

    // Configuration
    private config: VirtualScrollConfig = {
        itemHeight: 32,
        viewportHeight: 256,
        buffer: 5
    };

    // Data source
    private items: T[] = [];

    // Reactive state
    private scrollTop = signal(0);
    private containerHeight = signal(0);

    // Computed properties
    readonly itemHeight = computed(() => this.config.itemHeight);
    readonly totalHeight = computed(() => this.items.length * this.config.itemHeight);

    readonly visibleItems = computed(() => {
        const scroll = this.scrollTop();
        const containerHeight = this.containerHeight();
        const itemHeight = this.config.itemHeight;
        const buffer = this.config.buffer || 5;

        const startIndex = Math.max(0, Math.floor(scroll / itemHeight) - buffer);
        const endIndex = Math.min(
            this.items.length - 1,
            Math.ceil((scroll + containerHeight) / itemHeight) + buffer
        );

        const visibleItems: { item: T; index: number; offset: number }[] = [];

        for (let i = startIndex; i <= endIndex; i++) {
            visibleItems.push({
                item: this.items[i],
                index: i,
                offset: i * itemHeight
            });
        }

        return visibleItems;
    });

    readonly scrollData = computed((): VirtualScrollData<T> => {
        const visible = this.visibleItems();
        const totalHeight = this.totalHeight();
        const scrollTop = this.scrollTop();

        const startIndex = visible.length > 0 ? visible[0].index : 0;
        const endIndex = visible.length > 0 ? visible[visible.length - 1].index : 0;

        return {
            visibleItems: visible,
            totalHeight,
            scrollTop,
            startIndex,
            endIndex
        };
    });

    // Subject for scroll events
    private scrollSubject = new BehaviorSubject<VirtualScrollData<T>>(this.scrollData());

    /**
     * Observable stream of scroll data updates
     */
    readonly scrollUpdates$ = this.scrollSubject.asObservable();

    /**
     * Configure the virtual scroller with data and settings
     *
     * @param items Array of items to scroll through
     * @param config Virtual scrolling configuration
     */
    configure(items: T[], config: Partial<VirtualScrollConfig> = {}): void {
        this.items = items || [];
        this.config = { ...this.config, ...config };

        // Update computed values
        this.scrollTop.set(0);
        this.containerHeight.set(config.viewportHeight || this.config.viewportHeight);

        // Emit initial scroll data
        this.scrollSubject.next(this.scrollData());
    }

    /**
     * Update the items array
     *
     * @param items New items array
     */
    updateItems(items: T[]): void {
        this.items = items || [];
        this.scrollSubject.next(this.scrollData());
    }

    /**
     * Update container height
     *
     * @param height New container height in pixels
     */
    updateContainerHeight(height: number): void {
        this.containerHeight.set(height);
        this.scrollSubject.next(this.scrollData());
    }

    /**
     * Scroll to a specific index
     *
     * @param index Item index to scroll to
     * @param alignment Where to align the item ('start', 'center', 'end')
     */
    scrollToIndex(index: number, alignment: 'start' | 'center' | 'end' = 'start'): void {
        if (index < 0 || index >= this.items.length) {
            return;
        }

        const itemHeight = this.config.itemHeight;
        const containerHeight = this.containerHeight();
        let scrollTop: number;

        switch (alignment) {
            case 'start':
                scrollTop = index * itemHeight;
                break;
            case 'center':
                scrollTop = (index * itemHeight) - (containerHeight / 2) + (itemHeight / 2);
                break;
            case 'end':
                scrollTop = (index * itemHeight) - containerHeight + itemHeight;
                break;
        }

        // Clamp scroll position to valid range
        const maxScroll = Math.max(0, this.totalHeight() - containerHeight);
        this.scrollTo(Math.max(0, Math.min(scrollTop, maxScroll)));
    }

    /**
     * Scroll to a specific pixel position
     *
     * @param scrollTop Scroll position in pixels
     */
    scrollTo(scrollTop: number): void {
        const maxScroll = Math.max(0, this.totalHeight() - this.containerHeight());
        const clampedScrollTop = Math.max(0, Math.min(scrollTop, maxScroll));

        this.scrollTop.set(clampedScrollTop);
        this.scrollSubject.next(this.scrollData());
    }

    /**
     * Get the current scroll position
     *
     * @returns Current scroll position in pixels
     */
    getScrollTop(): number {
        return this.scrollTop();
    }

    /**
     * Get the total height of the virtual container
     *
     * @returns Total height in pixels
     */
    getTotalHeight(): number {
        return this.totalHeight();
    }

    /**
     * Get the number of items
     *
     * @returns Number of items
     */
    getItemCount(): number {
        return this.items.length;
    }

    /**
     * Setup scroll event listeners for a container element
     *
     * @param container Container element to listen for scroll events
     */
    setupScrollListener(container: HTMLElement): void {
        if (!container) {
            return;
        }

        // Listen to scroll events
        const scrollSubscription = fromEvent(container, 'scroll')
            .pipe(
                map(() => container.scrollTop),
                debounceTime(10), // Debounce for performance
                filter(() => container.isConnected), // Only if element is still connected
            )
            .subscribe(scrollTop => {
                this.scrollTo(scrollTop);
            });

        // Listen to resize events
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const newHeight = entry.contentRect.height;
                if (newHeight > 0) {
                    this.updateContainerHeight(newHeight);
                }
            }
        });

        resizeObserver.observe(container);

        // Cleanup on destroy
        this.destroyRef.onDestroy(() => {
            resizeObserver.disconnect();
            scrollSubscription.unsubscribe();
        });
    }

    /**
     * Find the index of an item using a comparator function
     *
     * @param comparator Function to find the item
     * @returns Item index or -1 if not found
     */
    findItemIndex(comparator: (item: T, index: number) => boolean): number {
        return this.items.findIndex(comparator);
    }

    /**
     * Check if an index is currently visible
     *
     * @param index Item index to check
     * @returns True if the item is visible
     */
    isIndexVisible(index: number): boolean {
        const data = this.scrollData();
        return index >= data.startIndex && index <= data.endIndex;
    }

    /**
     * Get the current configuration
     *
     * @returns Current virtual scroll configuration
     */
    getConfig(): VirtualScrollConfig {
        return { ...this.config };
    }
}