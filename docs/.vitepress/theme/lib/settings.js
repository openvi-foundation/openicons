import { reactive, watch } from 'vue';

/**
 * Preview settings shared by the catalog and the icon pages. They're a convenience, so they live
 * in localStorage, and anything that goes wrong reading or writing them falls back to defaults.
 */
const KEY = 'openicons:preview';
const defaults = { size: 24, color: '' };

export const settings = reactive({ ...defaults });

let restored = false;

export function restoreSettings() {
    if (restored || typeof window === 'undefined') return;

    restored = true;

    try {
        Object.assign(settings, defaults, JSON.parse(localStorage.getItem(KEY) || '{}'));
    } catch {
        // Private mode or blocked storage: keep the defaults.
    }

    watch(settings, (value) => {
        try {
            localStorage.setItem(KEY, JSON.stringify(value));
        } catch {
            // Same as above; the setting just won't survive a reload.
        }
    });
}

export function resetSettings() {
    Object.assign(settings, defaults);
}
