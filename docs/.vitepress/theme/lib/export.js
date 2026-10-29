/**
 * Copy and download helpers.
 *
 * SVG markup is built from the Vue component's own render output rather than read back from the
 * DOM, so it is available during SSR and is exactly what @openvue/openicons-vue renders.
 */

export function svgMarkup(Icon, { size = 24, color = '' } = {}) {
    const tree = Icon.setup({ size, title: null }, { attrs: {} })();
    const paths = tree.children.map(({ props }) => {
        const attrs = Object.entries(props)
            .filter(([, value]) => value != null)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

        return `  <path ${attrs}/>`;
    });

    return [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color || 'currentColor'}">`,
        ...paths,
        '</svg>'
    ].join('\n');
}

export async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        // Older Safari and insecure origins have no async clipboard.
        const area = Object.assign(document.createElement('textarea'), { value: text });

        area.style.cssText = 'position:fixed;opacity:0';
        document.body.append(area);
        area.select();
        document.execCommand('copy');
        area.remove();
    }
}

function save(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: filename });

    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadSvg(name, Icon, options) {
    save(new Blob([svgMarkup(Icon, options)], { type: 'image/svg+xml' }), `${name}.svg`);
}

/** Rasterises at `px` square. currentColor means nothing outside the page, so a colour is required. */
export function downloadPng(name, Icon, { px = 256, color }) {
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svgMarkup(Icon, { size: px, color })], { type: 'image/svg+xml' }));

    image.onload = () => {
        const canvas = Object.assign(document.createElement('canvas'), { width: px, height: px });

        canvas.getContext('2d').drawImage(image, 0, 0, px, px);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => save(blob, `${name}.png`), 'image/png');
    };

    image.src = url;
}

/** The colour an icon would actually render in on this page, for exports that can't inherit it. */
export function resolvedColor(color) {
    return color || getComputedStyle(document.documentElement).getPropertyValue('--vp-c-text-1').trim() || '#000000';
}
