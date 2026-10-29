<script setup>
import { computed } from 'vue';
import { withBase } from 'vitepress';
import * as Icons from '@openvue/openicons-vue';
import { downloadPng, downloadSvg, resolvedColor, svgMarkup } from '../lib/export.js';
import { settings } from '../lib/settings.js';
import CopyButton from './CopyButton.vue';

const props = defineProps({ icon: { type: Object, required: true } });

defineEmits(['close', 'tag']);

const Icon = computed(() => Icons[props.icon.component]);
const html = computed(() => `<i class="oi oi-${props.icon.name}"></i>`);
const vue = computed(() => `import ${props.icon.component} from '@openvue/openicons-vue/icons/${props.icon.component}';`);
</script>

<template>
    <aside class="detail" :aria-label="`${icon.name} icon`">
        <div class="preview" :style="{ color: settings.color || undefined }">
            <component :is="Icon" :size="56" />
        </div>

        <div class="body">
            <div class="heading">
                <h2>{{ icon.name }}</h2>
                <span class="meta">{{ icon.category }} · U+{{ icon.code }}</span>
            </div>

            <div v-if="icon.tags.length" class="tags">
                <button v-for="tag in icon.tags" :key="tag" type="button" class="tag" @click="$emit('tag', tag)">{{ tag }}</button>
            </div>

            <div class="actions">
                <CopyButton label="Copy HTML" :text="html" />
                <CopyButton label="Copy Vue import" :text="vue" />
                <CopyButton label="Copy SVG" :text="() => svgMarkup(Icon, { color: settings.color })" />
                <span class="sep" aria-hidden="true"></span>
                <button type="button" class="action" @click="downloadSvg(icon.name, Icon, { color: settings.color })">
                    <Icons.OiDownload size="14" /> SVG
                </button>
                <button type="button" class="action" @click="downloadPng(icon.name, Icon, { color: resolvedColor(settings.color) })">
                    <Icons.OiDownload size="14" /> PNG
                </button>
                <a class="more" :href="withBase(`/icons/${icon.name}`)">Details <Icons.OiArrowRight size="12" /></a>
            </div>
        </div>

        <button type="button" class="close" aria-label="Close" @click="$emit('close')">
            <Icons.OiTimes size="16" />
        </button>
    </aside>
</template>

<style scoped>
.detail {
    position: relative;
    display: flex;
    gap: 24px;
    align-items: center;
    padding: 20px 56px 20px 20px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 14px;
    background: var(--vp-c-bg-elv);
    box-shadow: var(--vp-shadow-4);
}

.preview {
    flex: none;
    display: grid;
    place-items: center;
    width: 112px;
    height: 112px;
    border-radius: 10px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
}

.body {
    min-width: 0;
    flex: 1;
}

.heading {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px 12px;
}

h2 {
    margin: 0;
    font: 600 18px var(--vp-font-family-mono);
    letter-spacing: -0.01em;
}

.meta {
    font-size: 13px;
    color: var(--vp-c-text-2);
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
}

.sep {
    width: 1px;
    height: 20px;
    margin: 0 4px;
    background: var(--vp-c-divider);
}

.more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    font-size: 13px;
    font-weight: 500;
    color: var(--vp-c-brand-1);
}

.more:hover {
    text-decoration: underline;
}

.close {
    position: absolute;
    top: 12px;
    right: 12px;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    color: var(--vp-c-text-2);
}

.close:hover {
    background: var(--vp-c-default-soft);
    color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
    .detail {
        flex-direction: column;
        align-items: stretch;
        padding: 16px;
    }

    .preview {
        width: 100%;
        height: 96px;
    }

    .more {
        margin-left: 0;
    }

    .sep {
        display: none;
    }
}
</style>
