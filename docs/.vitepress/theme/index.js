import DefaultTheme from 'vitepress/theme';
import { defineAsyncComponent } from 'vue';
import './style.css';

// Async so the icon components, which these pages pull in wholesale, stay out of the guide pages' bundle.
export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('HomePage', defineAsyncComponent(() => import('./components/HomePage.vue')));
        app.component('IconCatalog', defineAsyncComponent(() => import('./components/IconCatalog.vue')));
        app.component('IconPage', defineAsyncComponent(() => import('./components/IconPage.vue')));
    }
};
