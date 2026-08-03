/**
 * Category for every icon in the set, used to group the docs catalog.
 *
 * Kept as explicit lists rather than name patterns: `bolt` is weather and `bolt`-like `power-off`
 * is hardware, and no prefix rule gets that right. build-docs.mjs throws when an icon is missing
 * or listed twice, so adding an icon forces a decision here rather than silently landing in a
 * catch-all bucket.
 *
 * Order below is the order sections appear in the docs.
 */
export const categories = {
    'Arrows & Navigation': [
        'angle-double-down', 'angle-double-left', 'angle-double-right', 'angle-double-up',
        'angle-down', 'angle-left', 'angle-right', 'angle-up',
        'arrow-circle-down', 'arrow-circle-left', 'arrow-circle-right', 'arrow-circle-up',
        'arrow-down', 'arrow-down-left', 'arrow-down-right',
        'arrow-down-left-and-arrow-up-right-to-center', 'arrow-up-right-and-arrow-down-left-from-center',
        'arrow-left', 'arrow-right', 'arrow-right-arrow-left',
        'arrow-up', 'arrow-up-left', 'arrow-up-right',
        'arrows-alt', 'arrows-h', 'arrows-v',
        'caret-down', 'caret-left', 'caret-right', 'caret-up',
        'chevron-circle-down', 'chevron-circle-left', 'chevron-circle-right', 'chevron-circle-up',
        'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up',
        'expand', 'external-link', 'history', 'refresh', 'replay', 'sync', 'undo', 'sign-in', 'sign-out'
    ],
    'Interface': [
        'ban', 'bars', 'bullseye', 'check', 'check-circle', 'check-square', 'circle', 'circle-fill',
        'circle-off', 'circle-on', 'cog', 'ellipsis-h', 'ellipsis-v', 'exclamation-circle',
        'exclamation-triangle', 'eye', 'eye-slash', 'info', 'info-circle', 'layers', 'minus', 'minus-circle',
        'plus', 'plus-circle', 'power-off', 'question', 'question-circle', 'search', 'search-minus',
        'search-plus', 'sliders-h', 'sliders-v', 'spinner', 'spinner-dotted', 'times', 'times-circle',
        'window-maximize', 'window-minimize', 'lightbulb', 'sparkles'
    ],
    'Editing & Tools': [
        'bookmark', 'bookmark-fill', 'clipboard', 'clone', 'copy', 'delete-left', 'eraser', 'flag',
        'flag-fill', 'hammer', 'heart', 'heart-fill', 'key', 'lock', 'lock-open', 'unlock', 'pencil',
        'pen-to-square', 'save', 'shield', 'star', 'star-fill', 'star-half', 'star-half-fill',
        'thumbs-down', 'thumbs-down-fill', 'thumbs-up', 'thumbs-up-fill', 'thumbtack', 'trash',
        'trophy', 'wrench', 'palette', 'eject'
    ],
    'Text & Layout': [
        'align-center', 'align-justify', 'align-left', 'align-right', 'asterisk', 'equals', 'filter',
        'filter-fill', 'filter-slash', 'hashtag', 'language', 'list', 'list-check', 'objects-column',
        'percentage', 'sidebar', 'sitemap', 'sort', 'sort-alpha-down', 'sort-alpha-down-alt', 'sort-alpha-up',
        'sort-alpha-up-alt', 'sort-alt', 'sort-alt-slash', 'sort-amount-down', 'sort-amount-down-alt',
        'sort-amount-up', 'sort-amount-up-alt', 'sort-down', 'sort-down-fill', 'sort-numeric-down',
        'sort-numeric-down-alt', 'sort-numeric-up', 'sort-numeric-up-alt', 'sort-up', 'sort-up-fill',
        'table', 'th-large'
    ],
    'Files & Folders': [
        'book', 'box', 'download', 'file', 'file-arrow-up', 'file-check', 'file-edit',
        'file-excel', 'file-export', 'file-import', 'file-o', 'file-pdf', 'file-plus', 'file-word',
        'folder', 'folder-open', 'folder-plus', 'paperclip', 'print', 'upload', 'cloud-download',
        'cloud-upload', 'graduation-cap'
    ],
    'Media': [
        'backward', 'camera', 'fast-backward', 'fast-forward', 'forward', 'headphones', 'image',
        'images', 'microphone', 'pause', 'pause-circle', 'play', 'play-circle', 'step-backward',
        'step-backward-alt', 'step-forward', 'step-forward-alt', 'stop', 'stop-circle', 'video',
        'volume-down', 'volume-off', 'volume-up'
    ],
    'Communication': [
        'at', 'bell', 'bell-slash', 'comment', 'comments', 'envelope', 'inbox', 'link', 'megaphone',
        'phone', 'reply', 'send', 'share-alt'
    ],
    'Users & Accounts': [
        'address-book', 'crown', 'face-smile', 'id-card', 'mars', 'user', 'user-edit', 'user-minus',
        'user-plus', 'users', 'venus', 'verified'
    ],
    'Commerce & Finance': [
        'barcode', 'bitcoin', 'calculator', 'cart-arrow-down', 'cart-minus', 'cart-plus',
        'credit-card', 'dollar', 'ethereum', 'euro', 'gift', 'indian-rupee', 'money-bill', 'pound',
        'qrcode', 'receipt', 'shop', 'shopping-bag', 'shopping-cart', 'tag', 'tags', 'ticket',
        'turkish-lira', 'wallet'
    ],
    'Charts & Data': [
        'chart-bar', 'chart-line', 'chart-pie', 'chart-scatter', 'database', 'gauge', 'server',
        'wave-pulse'
    ],
    'Devices & Tech': [
        'battery', 'bluetooth', 'code', 'code-branch', 'desktop', 'keyboard', 'laptop', 'microchip',
        'microchip-ai', 'mobile', 'rss', 'tablet', 'terminal', 'wifi', 'wifi-slash'
    ],
    'Time': [
        'calendar', 'calendar-clock', 'calendar-minus', 'calendar-plus', 'calendar-times', 'clock',
        'hourglass', 'stopwatch'
    ],
    'Maps & Places': [
        'briefcase', 'building', 'building-columns', 'car', 'compass', 'directions', 'directions-alt',
        'globe', 'home', 'map', 'map-marker', 'truck', 'warehouse'
    ],
    'Nature & Weather': [
        'bolt', 'cloud', 'moon', 'sun'
    ],
    'Brands': [
        'amazon', 'android', 'apple', 'discord', 'facebook', 'github', 'google', 'instagram',
        'linkedin', 'microsoft', 'paypal', 'pinterest', 'reddit', 'slack', 'telegram', 'tiktok',
        'twitch', 'twitter', 'vimeo', 'whatsapp', 'youtube'
    ]
};

/** name -> category, with a hard error on anything listed under two categories. */
export function categoryIndex() {
    const index = new Map();

    for (const [category, names] of Object.entries(categories)) {
        for (const name of names) {
            if (index.has(name)) throw new Error(`${name} is listed under both ${index.get(name)} and ${category}`);

            index.set(name, category);
        }
    }

    return index;
}
