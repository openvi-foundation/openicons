import { CATEGORIES, SELECTION, SVG_DIR, categoryOrder, loadIcons } from '../../../scripts/icons.mjs';

export default {
    watch: [`${SVG_DIR}/*.svg`, SELECTION, CATEGORIES],
    load() {
        return { icons: loadIcons(), categories: categoryOrder };
    }
};
