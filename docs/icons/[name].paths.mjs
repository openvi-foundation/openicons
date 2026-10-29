import { loadIcons } from '../../scripts/icons.mjs';

export default {
    paths() {
        return loadIcons().map((icon) => ({ params: { name: icon.name } }));
    }
};
