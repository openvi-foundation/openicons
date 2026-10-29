import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';
import { loadIcons } from '../../scripts/icons.mjs';
import { openviLogo } from './theme/openvi-logo.mjs';

// Loaded here as well as in the data loader so a broken icon set fails the build outright;
// VitePress only warns when a dynamic route's paths file throws.
const icons = new Map(loadIcons().map((icon) => [icon.name, icon]));

const repo = 'https://github.com/openvi-foundation/openicons';

export default defineConfig({
    title: 'OpenIcons',
    description: `${icons.size} icons for Vue and the web, as a webfont and as Vue 3 components. An MIT fork of PrimeIcons.`,
    lang: 'en-US',
    // Hosting isn't settled; a project page on GitHub Pages would need DOCS_BASE=/openicons/.
    base: process.env.DOCS_BASE || '/',
    cleanUrls: true,
    lastUpdated: false,

    head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: `${process.env.DOCS_BASE || '/'}favicon.svg` }],
        ['meta', { name: 'theme-color', content: '#2da055' }]
    ],

    transformPageData(page) {
        const icon = page.params?.name && icons.get(page.params.name);

        if (icon) {
            page.title = icon.name;
            page.description = `The ${icon.name} icon from OpenIcons. Use it as oi-${icon.name} in CSS or ${icon.component} in Vue.`;
        }
    },

    themeConfig: {
        logo: { src: '/logo.svg', width: 24, height: 24 },

        nav: [
            { text: 'Guide', link: '/guide/', activeMatch: '^/guide/' },
            { text: 'Icons', link: '/icons/', activeMatch: '^/icons/' },
            { text: 'Changelog', link: `${repo}/blob/master/CHANGELOG.md` },
            {
                text: 'Ecosystem',
                items: [
                    { text: 'OpenVue', link: 'https://openvue.dev' },
                    { text: 'OpenVi Foundation', link: 'https://openvi.dev' }
                ]
            }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: 'Getting started',
                    items: [
                        { text: 'Introduction', link: '/guide/' },
                        { text: 'Installation', link: '/guide/installation' }
                    ]
                },
                {
                    text: 'Usage',
                    items: [
                        { text: 'Webfont', link: '/guide/webfont' },
                        { text: 'Vue components', link: '/guide/vue' },
                        { text: 'Accessibility', link: '/guide/accessibility' }
                    ]
                },
                {
                    text: 'Reference',
                    items: [
                        { text: 'Migrating from PrimeIcons', link: '/guide/migrating' },
                        { text: 'Versioning', link: '/guide/versioning' },
                        { text: 'Contributing', link: '/guide/contributing' }
                    ]
                }
            ]
        },

        socialLinks: [{ icon: 'github', link: repo }],

        search: { provider: 'local' },

        editLink: {
            pattern: `${repo}/edit/master/docs/:path`,
            text: 'Edit this page on GitHub'
        },

        footer: {
            message: `<a class="footer-openvi" href="https://openvi.dev" aria-label="OpenVi Foundation">${openviLogo}</a>Released under the MIT License.`,
            copyright:
                'Maintained by the <a href="https://openvi.dev">OpenVi Foundation</a>, alongside <a href="https://openvue.dev">OpenVue</a>. Not affiliated with PrimeTek.'
        }
    },

    vite: {
        resolve: {
            alias: {
                // The site renders icons with the package it documents, straight from the build output.
                '@openvue/openicons-vue': fileURLToPath(new URL('../../packages/vue/index.js', import.meta.url))
            }
        }
    }
});
