<script setup>
import { withBase } from 'vitepress';
import * as Icons from '@openvue/openicons-vue';
import { data } from '../icons.data.mjs';
import { openviLogo } from '../openvi-logo.mjs';
import CopyButton from './CopyButton.vue';

const { icons } = data;
const byName = new Map(icons.map((icon) => [icon.name, icon]));

// A hand-picked spread across categories, so the first screen shows the range of the set.
const wall = [
    'search', 'home', 'user', 'cog', 'bell', 'envelope', 'calendar', 'clock',
    'heart', 'star', 'bookmark', 'trash', 'pencil', 'copy', 'download', 'upload',
    'folder', 'file-pdf', 'image', 'camera', 'video', 'microphone', 'headphones', 'volume-up',
    'chart-bar', 'chart-pie', 'database', 'server', 'code', 'terminal', 'code-branch', 'github',
    'shopping-cart', 'credit-card', 'wallet', 'receipt', 'map-marker', 'globe', 'compass', 'truck',
    'lock', 'shield', 'key', 'eye', 'filter', 'sliders-h', 'sun', 'moon'
].map((name) => byName.get(name)).filter(Boolean);

const stable = ['check', 'times', 'search', 'trash'].map((name) => byName.get(name)).filter(Boolean);

const install = 'npm install @openvue/openicons';
</script>

<template>
    <div class="home">
        <section class="hero">
            <div class="hero-text">
                <p class="eyebrow">OpenIcons</p>
                <h1>The MIT fork of PrimeIcons.</h1>
                <p class="lead">
                    OpenIcons started from PrimeIcons and goes its own way from there. Every original name and codepoint still works,
                    and on top of them come new icons and Vue 3 components.
                </p>

                <div class="cta">
                    <a class="button primary" :href="withBase('/icons/')">Browse icons</a>
                    <a class="button" :href="withBase('/guide/')">Read the guide</a>
                </div>

                <div class="install">
                    <code><span class="prompt" aria-hidden="true">$</span> {{ install }}</code>
                    <CopyButton class="install-copy" label="Copy" :text="install" />
                </div>

            </div>

            <div class="wall" aria-label="A selection of icons">
                <a v-for="icon in wall" :key="icon.name" :href="withBase(`/icons/${icon.name}`)" :title="icon.name">
                    <component :is="Icons[icon.component]" size="22" />
                </a>
            </div>
        </section>

        <section class="row">
            <div class="row-text">
                <h2>A webfont for any page</h2>
                <p>
                    Load one stylesheet and add a class. It works with any framework or none at all, and the class names follow the ones
                    you already know from PrimeIcons.
                </p>
                <a class="link" :href="withBase('/guide/webfont')">Webfont guide <Icons.OiArrowRight size="12" /></a>
            </div>
            <div class="row-code vp-doc"><slot name="webfont" /></div>
        </section>

        <section class="row">
            <div class="row-text">
                <h2>Vue components for apps that bundle</h2>
                <p>
                    Each icon is its own component and renders a real SVG. Your bundler keeps only what you import, so two icons add
                    about 1.3 KB.
                </p>
                <a class="link" :href="withBase('/guide/vue')">Vue guide <Icons.OiArrowRight size="12" /></a>
            </div>
            <div class="row-code vp-doc"><slot name="vue" /></div>
        </section>

        <section class="row">
            <div class="row-text">
                <h2>Moving off PrimeIcons is one line</h2>
                <p>
                    Change the import. A compatibility stylesheet maps every <code>pi-</code> class onto the new font, so your templates
                    stay as they are. Rename to <code>oi-</code> later, or never.
                </p>
                <a class="link" :href="withBase('/guide/migrating')">Migration guide <Icons.OiArrowRight size="12" /></a>
            </div>
            <div class="row-code vp-doc"><slot name="migrate" /></div>
        </section>

        <section class="row">
            <div class="row-text">
                <h2>Codepoints don't move</h2>
                <p>
                    A release can add icons. It never renames, removes or renumbers one that already exists, and CI checks that on every
                    pull request. Upgrading won't change what's on your screen.
                </p>
                <a class="link" :href="withBase('/guide/versioning')">How versioning works <Icons.OiArrowRight size="12" /></a>
            </div>
            <div class="row-code">
                <table class="codepoints">
                    <thead>
                        <tr>
                            <th scope="col"><span class="sr-only">Icon</span></th>
                            <th scope="col">Class</th>
                            <th scope="col">Component</th>
                            <th scope="col">Codepoint</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="icon in stable" :key="icon.name">
                            <td><component :is="Icons[icon.component]" size="18" /></td>
                            <td>oi-{{ icon.name }}</td>
                            <td>{{ icon.component }}</td>
                            <td>U+{{ icon.code }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="foundation">
            <a class="foundation-logo" href="https://openvi.dev" aria-label="OpenVi Foundation" v-html="openviLogo"></a>
            <div>
                <h2>A project of the OpenVi Foundation</h2>
                <p>
                    The OpenVi Foundation is an independent group of developers who use these libraries in production and keep them
                    maintained and open. OpenIcons is developed alongside OpenVue, the component library that uses it.
                </p>
                <div class="foundation-links">
                    <a class="link" href="https://openvi.dev">openvi.dev <Icons.OiArrowRight size="12" /></a>
                    <a class="link" href="https://openvue.dev">openvue.dev <Icons.OiArrowRight size="12" /></a>
                </div>
            </div>
        </section>

        <section class="closing">
            <h2>Missing an icon?</h2>
            <p>
                Open an issue and tell us where you'd use it. New icons are drawn on the same 24×24 grid and at the same weight as the
                rest of the set, and reviewed before they ship.
            </p>
            <div class="cta">
                <a class="button primary" href="https://github.com/openvi-foundation/openicons/issues/new" target="_blank" rel="noopener">
                    Request an icon
                </a>
                <a class="button" :href="withBase('/guide/contributing')">Contributing guide</a>
            </div>
        </section>
    </div>
</template>

<style scoped>
.home {
    max-width: 1152px;
    margin: 0 auto;
    padding: 0 24px 96px;
}

.hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 440px);
    gap: 64px;
    align-items: center;
    padding: 88px 0 96px;
}

.eyebrow {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-brand-1);
}

h1 {
    margin-top: 12px;
    font-size: 56px;
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.035em;
}

.lead {
    max-width: 520px;
    margin-top: 20px;
    font-size: 18px;
    line-height: 1.6;
    color: var(--vp-c-text-2);
}

.cta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 32px;
}

.button {
    display: inline-flex;
    align-items: center;
    height: 42px;
    padding: 0 20px;
    border: 1px solid var(--vp-button-alt-border);
    border-radius: 8px;
    background: var(--vp-button-alt-bg);
    font-size: 15px;
    font-weight: 600;
    color: var(--vp-button-alt-text);
    transition: background-color 0.15s, border-color 0.15s;
}

.button:hover {
    border-color: var(--vp-button-alt-hover-border);
    background: var(--vp-button-alt-hover-bg);
}

.button.primary {
    border-color: var(--vp-button-brand-border);
    background: var(--vp-button-brand-bg);
    color: var(--vp-button-brand-text);
}

.button.primary:hover {
    border-color: var(--vp-button-brand-hover-border);
    background: var(--vp-button-brand-hover-bg);
}

.install {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    max-width: 100%;
    margin-top: 24px;
    padding: 6px 6px 6px 14px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
}

.install code {
    overflow-x: auto;
    font: 500 14px var(--vp-font-family-mono);
    white-space: nowrap;
}

.prompt {
    margin-right: 4px;
    color: var(--vp-c-text-3);
    user-select: none;
}


.wall {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    border-top: 1px solid var(--vp-c-divider);
    border-left: 1px solid var(--vp-c-divider);
}

.wall a {
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    border-right: 1px solid var(--vp-c-divider);
    border-bottom: 1px solid var(--vp-c-divider);
    color: var(--vp-c-text-1);
    transition: background-color 0.15s, color 0.15s;
}

.wall a:hover {
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
}

.row {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 64px;
    align-items: center;
    padding: 56px 0;
    border-top: 1px solid var(--vp-c-divider);
}

h2 {
    font-size: 26px;
    font-weight: 650;
    line-height: 1.25;
    letter-spacing: -0.02em;
}

.row-text p,
.closing p {
    margin-top: 12px;
    font-size: 16px;
    line-height: 1.65;
    color: var(--vp-c-text-2);
}

.row-text code {
    padding: 2px 5px;
    border-radius: 4px;
    background: var(--vp-c-default-soft);
    font: 500 0.875em var(--vp-font-family-mono);
    color: var(--vp-c-text-1);
}

.link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 16px;
    font-size: 15px;
    font-weight: 500;
    color: var(--vp-c-brand-1);
}

.link:hover {
    text-decoration: underline;
}

.row-code :deep(div[class*='language-']) {
    margin: 0;
    border-radius: 12px;
}

.codepoints {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.codepoints th {
    padding: 0 16px 10px 0;
    font-size: 12px;
    font-weight: 500;
    text-align: left;
    color: var(--vp-c-text-3);
}

.codepoints td {
    padding: 12px 16px 12px 0;
    border-top: 1px solid var(--vp-c-divider);
    font-family: var(--vp-font-family-mono);
    font-size: 13px;
}

.codepoints td:first-child {
    width: 34px;
    color: var(--vp-c-text-1);
}

.codepoints td:last-child {
    color: var(--vp-c-brand-1);
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
}

.foundation {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 64px;
    align-items: center;
    padding: 64px 0;
    border-top: 1px solid var(--vp-c-divider);
}

.foundation-logo {
    display: grid;
    place-items: center;
    height: 140px;
    padding: 0 40px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 14px;
    background: var(--vp-c-bg-soft);
}

.foundation-logo :deep(.openvi-logo) {
    height: 52px;
}

.foundation p {
    max-width: 560px;
    margin-top: 12px;
    font-size: 16px;
    line-height: 1.65;
    color: var(--vp-c-text-2);
}

.foundation-links {
    display: flex;
    gap: 24px;
}

.closing {
    padding: 72px 0 0;
    border-top: 1px solid var(--vp-c-divider);
}

.closing p {
    max-width: 560px;
}

@media (max-width: 960px) {
    .hero {
        grid-template-columns: minmax(0, 1fr);
        gap: 48px;
        padding: 56px 0 64px;
    }

    .wall {
        max-width: 480px;
    }

    .row,
    .foundation {
        grid-template-columns: minmax(0, 1fr);
        gap: 24px;
        padding: 48px 0;
    }

    .foundation-logo {
        width: 200px;
        height: 112px;
    }
}

@media (max-width: 640px) {
    .home {
        padding: 0 16px 72px;
    }

    h1 {
        font-size: 40px;
    }

    .lead {
        font-size: 17px;
    }

    h2 {
        font-size: 22px;
    }

    .wall {
        grid-template-columns: repeat(6, 1fr);
    }

    .wall a:nth-child(n + 37) {
        display: none;
    }

    .codepoints th:nth-child(3),
    .codepoints td:nth-child(3) {
        display: none;
    }
}
</style>
