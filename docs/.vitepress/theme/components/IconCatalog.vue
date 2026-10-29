<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { withBase } from 'vitepress';
import * as Icons from '@openvue/openicons-vue';
import { data } from '../icons.data.mjs';
import { searchIcons } from '../lib/search.js';
import { restoreSettings, settings } from '../lib/settings.js';
import Customizer from './Customizer.vue';
import IconDetail from './IconDetail.vue';

const { icons, categories } = data;

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const query = ref('');
const category = ref('');
const selectedName = ref('');
const input = ref(null);

const searching = computed(() => query.value.trim() !== '');
const scoped = computed(() => (category.value ? icons.filter((icon) => icon.category === category.value) : icons));
const results = computed(() => searchIcons(scoped.value, query.value));
const selected = computed(() => icons.find((icon) => icon.name === selectedName.value));

const status = computed(() => {
    const count = `${results.value.length} ${results.value.length === 1 ? 'icon' : 'icons'}`;

    return `${count} for “${query.value.trim()}”${category.value ? ` in ${category.value}` : ''}`;
});

/** Grouped by category while browsing; a single ranked list once there's a query. */
const sections = computed(() =>
    searching.value
        ? [{ title: null, items: results.value }]
        : categories
              .filter((title) => !category.value || title === category.value)
              .map((title) => ({ title, items: icons.filter((icon) => icon.category === title) }))
);

function select(icon) {
    selectedName.value = selectedName.value === icon.name ? '' : icon.name;
}

function pickCategory(title) {
    category.value = title;
    window.scrollTo({ top: 0 });
}

function searchTag(tag) {
    category.value = '';
    query.value = tag;
}

function onKeydown(event) {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;

    // Capture phase, so "/" focuses this field instead of opening the site-wide search.
    if (event.key === '/' && !typing) {
        event.preventDefault();
        event.stopImmediatePropagation();
        input.value?.focus();
    } else if (event.key === 'Escape') {
        if (selectedName.value) selectedName.value = '';
        else if (event.target === input.value) query.value = '';
    }
}

onMounted(() => {
    restoreSettings();

    const params = new URLSearchParams(location.search);

    query.value = params.get('q') ?? '';
    category.value = categories.find((title) => slug(title) === params.get('category')) ?? '';
    selectedName.value = icons.some((icon) => icon.name === params.get('icon')) ? params.get('icon') : '';

    window.addEventListener('keydown', onKeydown, true);
});

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown, true));

watch([query, category, selectedName], () => {
    const params = new URLSearchParams();

    if (query.value) params.set('q', query.value);
    if (category.value) params.set('category', slug(category.value));
    if (selectedName.value) params.set('icon', selectedName.value);

    const search = params.toString();

    history.replaceState(history.state, '', `${location.pathname}${search ? `?${search}` : ''}`);
});
</script>

<template>
    <div class="catalog" :class="{ 'has-detail': selected }">
        <header class="intro">
            <h1>Icons</h1>
        </header>

        <div class="toolbar">
            <label class="search">
                <Icons.OiSearch class="search-icon" size="16" />
                <input
                    ref="input"
                    v-model="query"
                    type="search"
                    placeholder="Search by name or keyword"
                    autocomplete="off"
                    spellcheck="false"
                    aria-label="Search icons"
                />
                <kbd v-if="!query" aria-hidden="true">/</kbd>
            </label>
            <Customizer class="toolbar-options" />
        </div>

        <div class="layout">
            <nav class="categories" aria-label="Categories">
                <button type="button" :aria-pressed="!category" @click="pickCategory('')">All icons</button>
                <button
                    v-for="title in categories"
                    :key="title"
                    type="button"
                    :aria-pressed="category === title"
                    @click="pickCategory(title)"
                >
                    {{ title }}
                </button>
            </nav>

            <div class="results">
                <p v-if="searching && results.length" class="status">{{ status }}</p>

                <div v-if="searching && !results.length" class="empty">
                    <p class="empty-title">Nothing matches “{{ query.trim() }}”.</p>
                    <p>
                        Try a broader word, or
                        <template v-if="category"><button type="button" class="inline" @click="category = ''">search every category</button>. If it's still missing, </template>
                        <a href="https://github.com/openvi-foundation/openicons/issues/new" target="_blank" rel="noopener">request it on GitHub</a>.
                    </p>
                </div>

                <section v-for="section in sections" :key="section.title ?? 'results'" class="section">
                    <h2 v-if="section.title" :id="slug(section.title)">
                        {{ section.title }} <span>{{ section.items.length }}</span>
                    </h2>
                    <!-- vp-raw: the router intercepts link clicks in the capture phase; this opts the grid out so a plain click selects. -->
                    <div class="grid vp-raw" :style="{ '--tile': `${Math.max(104, settings.size + 80)}px` }">
                        <a
                            v-for="icon in section.items"
                            :key="icon.name"
                            class="tile"
                            :class="{ active: icon.name === selectedName }"
                            :href="withBase(`/icons/${icon.name}`)"
                            :title="icon.name"
                            @click.exact.prevent="select(icon)"
                        >
                            <component :is="Icons[icon.component]" :size="settings.size" :style="{ color: settings.color || undefined }" />
                            <span class="name">{{ icon.name }}</span>
                        </a>
                    </div>
                </section>
            </div>
        </div>

        <Transition name="rise">
            <div v-if="selected" class="dock">
                <IconDetail :icon="selected" @close="selectedName = ''" @tag="searchTag" />
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.catalog {
    max-width: 1376px;
    margin: 0 auto;
    padding: 48px 24px 96px;
}

.catalog.has-detail {
    padding-bottom: 260px;
}

.intro h1 {
    font-size: 32px;
    font-weight: 650;
    letter-spacing: -0.02em;
    line-height: 1.2;
}


/* Sticks under the nav bar; the background hides tiles scrolling beneath it. */
.toolbar {
    position: sticky;
    top: var(--vp-nav-height);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 16px 32px;
    flex-wrap: wrap;
    margin-top: 32px;
    padding: 16px 0;
    background: var(--vp-c-bg);
    border-bottom: 1px solid var(--vp-c-divider);
}

.search {
    flex: 1 1 320px;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 40px;
    padding: 0 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg-alt);
    transition: border-color 0.2s;
}

.search:focus-within {
    border-color: var(--vp-c-brand-1);
}

.search-icon {
    flex: none;
    color: var(--vp-c-text-3);
}

.search input {
    flex: 1;
    min-width: 0;
    height: 100%;
    font-size: 15px;
}

.search input::placeholder {
    color: var(--vp-c-text-3);
}

.search input::-webkit-search-cancel-button {
    cursor: pointer;
}

kbd {
    padding: 1px 7px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 5px;
    font: 500 12px var(--vp-font-family-mono);
    color: var(--vp-c-text-3);
}

.layout {
    display: grid;
    grid-template-columns: 176px minmax(0, 1fr);
    gap: 32px;
}

.categories {
    padding-top: 24px;
}

/* Runs the full height of the grid, not just the length of the category list. */
.results {
    min-height: 100vh;
    padding: 24px 0 0 32px;
    border-left: 1px solid var(--vp-c-divider);
}

.categories {
    position: sticky;
    top: calc(var(--vp-nav-height) + 96px);
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.categories button {
    padding: 5px 0;
    font-size: 14px;
    text-align: left;
    color: var(--vp-c-text-2);
    transition: color 0.15s;
}

.categories button:hover {
    color: var(--vp-c-text-1);
}

.categories button[aria-pressed='true'] {
    color: var(--vp-c-brand-1);
    font-weight: 500;
}

.status {
    margin-bottom: 16px;
    font-size: 14px;
    color: var(--vp-c-text-2);
}

.empty {
    padding: 64px 0;
    color: var(--vp-c-text-2);
    text-align: center;
}

.empty-title {
    margin-bottom: 4px;
    font-size: 16px;
    font-weight: 500;
    color: var(--vp-c-text-1);
}

.empty a,
.inline {
    color: var(--vp-c-brand-1);
    font-weight: 500;
}

.empty a:hover,
.inline:hover {
    text-decoration: underline;
}

.section + .section {
    margin-top: 40px;
}

/* Off-screen sections skip layout and paint until scrolled near. */
.section {
    content-visibility: auto;
    contain-intrinsic-size: auto 600px;
}

.section h2 {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    scroll-margin-top: calc(var(--vp-nav-height) + 96px);
}

.section h2 span {
    margin-left: 6px;
    font-weight: 400;
    color: var(--vp-c-text-3);
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--tile), 1fr));
    gap: 2px;
    margin: 0 -8px;
}

.tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 22px 8px 14px;
    border-radius: 10px;
    color: var(--vp-c-text-1);
    transition: background-color 0.15s;
}

.tile:hover {
    background: var(--vp-c-default-soft);
}

.tile:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 1px;
}

.tile.active {
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
}

.tile.active .name {
    color: var(--vp-c-brand-1);
}

.tile svg {
    flex: none;
}

.name {
    max-width: 100%;
    overflow: hidden;
    font-size: 12px;
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--vp-c-text-3);
    transition: color 0.15s;
}

.tile:hover .name {
    color: var(--vp-c-text-1);
}

.dock {
    position: fixed;
    right: 0;
    bottom: 16px;
    left: 0;
    z-index: 20;
    max-width: 960px;
    margin: 0 auto;
    padding: 0 16px;
}

.rise-enter-active,
.rise-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.rise-enter-from,
.rise-leave-to {
    opacity: 0;
    transform: translateY(12px);
}

@media (max-width: 960px) {
    .layout {
        grid-template-columns: minmax(0, 1fr);
        gap: 16px;
    }

    .results {
        min-height: 0;
        padding: 0;
        border-left: 0;
    }

    .categories {
        padding-top: 16px;
    }

    /* The category list becomes a row of chips that scrolls sideways. */
    .categories {
        position: static;
        flex-direction: row;
        gap: 6px;
        overflow-x: auto;
        margin: 0 -24px;
        padding: 0 24px 4px;
        scrollbar-width: none;
    }

    .categories {
        gap: 20px;
    }

    .categories button {
        flex: none;
        white-space: nowrap;
    }

    .section h2 {
        scroll-margin-top: calc(var(--vp-nav-height) + 140px);
    }
}

@media (max-width: 640px) {
    .catalog {
        padding: 32px 16px 96px;
    }

    .categories {
        margin: 0 -16px;
        padding: 0 16px 4px;
    }

    .toolbar-options {
        gap: 16px;
    }

    .grid {
        gap: 6px;
        grid-template-columns: repeat(auto-fill, minmax(min(var(--tile), 30%), 1fr));
    }

    .catalog.has-detail {
        padding-bottom: 380px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rise-enter-active,
    .rise-leave-active {
        transition: none;
    }
}
</style>
