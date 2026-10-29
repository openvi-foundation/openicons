<script setup>
import { computed, onMounted, ref } from 'vue';
import { useData, withBase } from 'vitepress';
import * as Icons from '@openvue/openicons-vue';
import { data } from '../icons.data.mjs';
import { downloadPng, downloadSvg, resolvedColor, svgMarkup } from '../lib/export.js';
import { relatedIcons } from '../lib/search.js';
import { restoreSettings, settings } from '../lib/settings.js';
import CodeBlock from './CodeBlock.vue';
import CopyButton from './CopyButton.vue';
import Customizer from './Customizer.vue';

const { params } = useData();

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const label = (name) => name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

const icon = computed(() => data.icons.find((entry) => entry.name === params.value.name));
const Icon = computed(() => Icons[icon.value.component]);
const related = computed(() => relatedIcons(data.icons, icon.value));
const menu = computed(() => [icon.value, ...related.value.slice(0, 2)]);
const sizes = [16, 20, 24, 32, 48];

const tabs = ['Webfont', 'Vue', 'SVG', 'CSS'];
const tab = ref('Webfont');

const snippets = computed(() => {
    const { name, component, code } = icon.value;

    return {
        Webfont: { lang: 'html', code: `<i class="oi oi-${name}"></i>` },
        Vue: {
            lang: 'vue',
            code: `<script setup>\nimport ${component} from '@openvue/openicons-vue/icons/${component}';\n</` + `script>\n\n<template>\n  <${component} />\n</template>`
        },
        SVG: { lang: 'svg', code: svgMarkup(Icon.value) },
        CSS: { lang: 'css', code: `.icon::before {\n  font-family: 'openicons';\n  content: '\\${code.toLowerCase()}';\n}` }
    };
});

const notes = computed(() => ({
    Webfont: `Needs @openvue/openicons/openicons.css. With the PrimeIcons compatibility stylesheet, pi pi-${icon.value.name} works too.`,
    Vue: 'From @openvue/openicons-vue. Pass size or title as props; everything else goes to the svg.',
    SVG: 'Inherits the surrounding text colour through fill="currentColor".',
    CSS: 'For pseudo-elements. The font comes from openicons.css, so load that first.'
}));

onMounted(restoreSettings);
</script>

<template>
    <div v-if="icon" class="icon-page">
        <nav class="crumbs" aria-label="Breadcrumb">
            <a :href="withBase('/icons/')">Icons</a>
            <span aria-hidden="true">/</span>
            <a :href="withBase(`/icons/?category=${slug(icon.category)}`)">{{ icon.category }}</a>
        </nav>

        <header class="head">
            <h1>{{ icon.name }}</h1>
            <dl class="facts">
                <div>
                    <dt>Class</dt>
                    <dd>oi-{{ icon.name }}</dd>
                </div>
                <div>
                    <dt>Component</dt>
                    <dd>{{ icon.component }}</dd>
                </div>
                <div>
                    <dt>Codepoint</dt>
                    <dd>U+{{ icon.code }}</dd>
                </div>
            </dl>
        </header>

        <div class="columns">
            <section class="stage" aria-label="Preview">
                <div class="canvas" :style="{ color: settings.color || undefined }">
                    <div class="artboard"><component :is="Icon" size="100%" /></div>
                </div>

                <div class="sizes" :style="{ color: settings.color || undefined }">
                    <figure v-for="size in sizes" :key="size">
                        <div class="size-box"><component :is="Icon" :size="size" /></div>
                        <figcaption>{{ size }}</figcaption>
                    </figure>
                </div>

                <div class="stage-actions">
                    <Customizer :size="false" />
                    <div class="buttons">
                        <CopyButton label="Copy SVG" :text="() => svgMarkup(Icon, { color: settings.color })" />
                        <button type="button" class="action" @click="downloadSvg(icon.name, Icon, { color: settings.color })">
                            <Icons.OiDownload size="14" /> SVG
                        </button>
                        <button type="button" class="action" @click="downloadPng(icon.name, Icon, { color: resolvedColor(settings.color) })">
                            <Icons.OiDownload size="14" /> PNG
                        </button>
                    </div>
                </div>
            </section>

            <div class="info">
                <section>
                    <h2>Usage</h2>
                    <div class="tabs" role="tablist">
                        <button
                            v-for="name in tabs"
                            :key="name"
                            type="button"
                            role="tab"
                            :aria-selected="tab === name"
                            @click="tab = name"
                        >
                            {{ name }}
                        </button>
                    </div>
                    <CodeBlock :code="snippets[tab].code" :lang="snippets[tab].lang" />
                    <p class="note">{{ notes[tab] }}</p>
                </section>

                <section>
                    <h2>In context</h2>
                    <div class="context">
                        <div class="context-row">
                            <button type="button" class="demo-button primary" tabindex="-1">
                                <component :is="Icon" /> <span class="demo-label">{{ label(icon.name) }}</span>
                            </button>
                            <button type="button" class="demo-button" tabindex="-1" :aria-label="label(icon.name)">
                                <component :is="Icon" />
                            </button>
                        </div>
                        <ul class="demo-menu" aria-hidden="true">
                            <li v-for="(entry, index) in menu" :key="entry.name" :class="{ current: index === 0 }">
                                <component :is="Icons[entry.component]" /> {{ label(entry.name) }}
                            </li>
                        </ul>
                        <p class="demo-text">
                            In running text, <component :is="Icon" /> takes the size and colour of the words around it.
                        </p>
                    </div>
                </section>

                <section v-if="icon.tags.length">
                    <h2>Keywords</h2>
                    <div class="tags">
                        <a v-for="tag in icon.tags" :key="tag" class="tag" :href="withBase(`/icons/?q=${encodeURIComponent(tag)}`)">{{ tag }}</a>
                    </div>
                </section>
            </div>
        </div>

        <section v-if="related.length" class="related">
            <h2>Related icons</h2>
            <div class="related-grid">
                <a v-for="entry in related" :key="entry.name" class="related-tile" :href="withBase(`/icons/${entry.name}`)">
                    <component :is="Icons[entry.component]" size="24" />
                    <span>{{ entry.name }}</span>
                </a>
            </div>
        </section>
    </div>
</template>

<style scoped>
.icon-page {
    max-width: 1152px;
    margin: 0 auto;
    padding: 40px 24px 96px;
}

.crumbs {
    display: flex;
    gap: 8px;
    font-size: 14px;
    color: var(--vp-c-text-3);
}

.crumbs a {
    color: var(--vp-c-text-2);
}

.crumbs a:hover {
    color: var(--vp-c-brand-1);
}

.head {
    margin-top: 12px;
}

h1 {
    font: 650 36px/1.15 var(--vp-font-family-mono);
    letter-spacing: -0.03em;
    overflow-wrap: anywhere;
}

.facts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 32px;
    margin-top: 16px;
}

.facts dt {
    font-size: 12px;
    color: var(--vp-c-text-3);
}

.facts dd {
    margin: 2px 0 0;
    font: 500 14px var(--vp-font-family-mono);
}

.columns {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 48px;
    margin-top: 40px;
}

.stage {
    align-self: start;
    position: sticky;
    top: calc(var(--vp-nav-height) + 24px);
}

.canvas {
    padding: 8%;
    border: 1px solid var(--vp-c-divider);
    border-radius: 14px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
}

/* The 24-unit grid the set is drawn on, behind the icon at full scale. */
.artboard {
    aspect-ratio: 1;
    background-image:
        linear-gradient(var(--vp-c-divider) 1px, transparent 1px),
        linear-gradient(90deg, var(--vp-c-divider) 1px, transparent 1px);
    background-size: calc(100% / 24) calc(100% / 24);
    box-shadow: inset -1px -1px 0 var(--vp-c-divider);
}

.artboard svg {
    display: block;
}

.sizes {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 16px;
    color: var(--vp-c-text-1);
}

.sizes figure {
    flex: 1;
    margin: 0;
    text-align: center;
}

.size-box {
    display: grid;
    place-items: center;
    height: 64px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
}

.sizes figcaption {
    margin-top: 6px;
    font: 500 12px var(--vp-font-family-mono);
    color: var(--vp-c-text-3);
}

.stage-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 20px;
}

.buttons {
    display: flex;
    gap: 8px;
}

.info section + section {
    margin-top: 40px;
}

h2 {
    margin-bottom: 14px;
    font-size: 15px;
    font-weight: 600;
}

.tabs {
    display: flex;
    gap: 20px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--vp-c-divider);
}

.tabs button {
    margin-bottom: -1px;
    padding: 6px 0 10px;
    border-bottom: 2px solid transparent;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    transition: color 0.15s;
}

.tabs button:hover {
    color: var(--vp-c-text-1);
}

.tabs button[aria-selected='true'] {
    border-bottom-color: var(--vp-c-brand-1);
    color: var(--vp-c-text-1);
}

.note {
    margin-top: 10px;
    font-size: 13px;
    color: var(--vp-c-text-2);
}

.context {
    display: grid;
    gap: 20px;
    padding: 24px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 14px;
}

.context-row {
    display: flex;
    gap: 10px;
}

.demo-button {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: default;
}

.demo-button svg {
    flex: none;
}

.demo-label {
    overflow: hidden;
    text-overflow: ellipsis;
}

.demo-button.primary {
    flex: 0 1 auto;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    padding: 0 14px;
    white-space: nowrap;
    border-color: transparent;
    background: var(--vp-button-brand-bg);
    color: var(--vp-button-brand-text);
}

.demo-menu {
    max-width: 260px;
    margin: 0;
    padding: 6px;
    list-style: none;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    background: var(--vp-c-bg-elv);
    box-shadow: var(--vp-shadow-2);
}

.demo-menu li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 6px;
    font-size: 14px;
    color: var(--vp-c-text-2);
}

.demo-menu li.current {
    background: var(--vp-c-default-soft);
    color: var(--vp-c-text-1);
}

.demo-text {
    max-width: 440px;
    font-size: 15px;
    color: var(--vp-c-text-2);
}

.demo-text svg {
    display: inline-block;
    vertical-align: -0.125em;
    color: var(--vp-c-text-1);
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.related {
    margin-top: 64px;
    padding-top: 40px;
    border-top: 1px solid var(--vp-c-divider);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
    gap: 8px;
}

.related-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px 8px 14px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    color: var(--vp-c-text-1);
    transition: border-color 0.15s, background-color 0.15s;
}

.related-tile:hover {
    border-color: var(--vp-c-gray-2);
    background: var(--vp-c-bg-soft);
}

.related-tile span {
    max-width: 100%;
    overflow: hidden;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--vp-c-text-2);
}

@media (max-width: 860px) {
    .columns {
        grid-template-columns: minmax(0, 1fr);
        gap: 40px;
    }

    .stage {
        position: static;
    }

    .canvas {
        max-width: 360px;
    }
}

@media (max-width: 640px) {
    .icon-page {
        padding: 32px 16px 80px;
    }

    h1 {
        font-size: 28px;
    }
}
</style>
