import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service for managing dropdown state and communication
 */
@Injectable({ providedIn: 'root' })
export class DropdownService {
    /** Subject for dropdown close events */
    private closeSubject = new Subject<string>();

    /** Observable for close events */
    public close$ = this.closeSubject.asObservable();

    /** Registry of active dropdowns */
    private activeDropdowns = new Map<string, { close: () => void }>();

    /**
     * Registers a dropdown as active
     */
    registerDropdown(id: string, closeFn: () => void): void {
        this.activeDropdowns.set(id, { close: closeFn });
    }

    /**
     * Unregisters a dropdown
     */
    unregisterDropdown(id: string): void {
        this.activeDropdowns.delete(id);
    }

    /**
     * Closes a specific dropdown
     */
    closeDropdown(id: string): void {
        const dropdown = this.activeDropdowns.get(id);
        if (dropdown) {
            dropdown.close();
        }
    }

    /**
     * Closes all active dropdowns
     */
    closeAllDropdowns(): void {
        this.activeDropdowns.forEach(dropdown => dropdown.close());
    }

    /**
     * Notifies about dropdown close event
     */
    notifyClose(id: string): void {
        this.closeSubject.next(id);
    }
}