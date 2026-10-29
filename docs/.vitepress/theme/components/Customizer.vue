<script setup>
import { computed } from 'vue';
import { resetSettings, settings } from '../lib/settings.js';

defineProps({ size: { type: Boolean, default: true } });

const changed = computed(() => settings.size !== 24 || settings.color !== '');
</script>

<template>
    <div class="customizer">
        <label v-if="size" class="field">
            <span class="field-label">Size</span>
            <input v-model.number="settings.size" type="range" min="16" max="48" step="4" />
            <output class="field-value">{{ settings.size }}px</output>
        </label>
        <label class="field">
            <span class="field-label">Color</span>
            <span class="swatch" :class="{ auto: !settings.color }" :style="{ background: settings.color || undefined }">
                <input
                    type="color"
                    :value="settings.color || '#2da055'"
                    aria-label="Icon color"
                    @input="settings.color = $event.target.value"
                />
            </span>
            <span class="field-value">{{ settings.color || 'Auto' }}</span>
        </label>
        <button v-if="changed" type="button" class="reset" @click="resetSettings">Reset</button>
    </div>
</template>

<style scoped>
.customizer {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.field {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}

.field-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--vp-c-text-2);
}

.field-value {
    min-width: 40px;
    font: 500 12px var(--vp-font-family-mono);
    color: var(--vp-c-text-2);
}

input[type='range'] {
    width: 96px;
    accent-color: var(--vp-c-brand-1);
}

.swatch {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid var(--vp-c-divider);
    overflow: hidden;
}

/* "Auto" follows the theme's text colour; shown as half light, half dark. */
.swatch.auto {
    background: linear-gradient(135deg, var(--vp-c-text-1) 50%, var(--vp-c-bg) 50%);
}

.swatch input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
}

.reset {
    font-size: 13px;
    font-weight: 500;
    color: var(--vp-c-brand-1);
}

.reset:hover {
    text-decoration: underline;
}
</style>
