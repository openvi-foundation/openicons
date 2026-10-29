/**
 * Ranks icons against a free-text query. Every word in the query has to match somewhere (name,
 * tag or category); matches on the name outrank matches on tags.
 *
 * Queries are normalised first, so people pasting from existing code still get a hit:
 * `pi pi-check`, `oi-check` and `OiCheck` all search for `check`.
 */
export function normaliseQuery(query) {
    return query
        .trim()
        .replace(/^(?:[op]i\s+)?[op]i-/i, '')
        .replace(/^Oi(?=[A-Z])/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}

function scoreWord(icon, word) {
    const parts = icon.name.split('-');

    if (icon.name === word) return 100;
    if (icon.name.startsWith(word)) return 60;
    if (parts.includes(word)) return 45;
    if (parts.some((part) => part.startsWith(word))) return 35;
    if (icon.name.includes(word)) return 25;
    if (icon.tags.includes(word)) return 20;
    if (icon.tags.some((tag) => tag.startsWith(word))) return 12;
    if (icon.category.toLowerCase().includes(word)) return 5;

    return 0;
}

export function searchIcons(icons, query) {
    const q = normaliseQuery(query);

    if (!q) return icons;

    // A hyphenated query is one word ("arrow-up"); spaces split it into several ("arrow up").
    const words = q.split(/\s+/);
    const whole = q.replace(/\s+/g, '-');

    return icons
        .map((icon) => {
            const scores = words.map((word) => scoreWord(icon, word));
            const bonus = words.length > 1 && icon.name.startsWith(whole) ? 50 : 0;

            return { icon, score: scores.includes(0) ? 0 : scores.reduce((a, b) => a + b, 0) + bonus };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.icon.name.length - b.icon.name.length || a.icon.name.localeCompare(b.icon.name))
        .map((entry) => entry.icon);
}

/** Icons that share a word with this one's name, then the rest of its category. */
export function relatedIcons(icons, icon, limit = 12) {
    const parts = new Set(icon.name.split('-'));

    return icons
        .filter((other) => other.name !== icon.name)
        .map((other) => ({
            other,
            score: other.name.split('-').filter((part) => parts.has(part)).length * 2 + (other.category === icon.category ? 1 : 0)
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.other.name.localeCompare(b.other.name))
        .slice(0, limit)
        .map((entry) => entry.other);
}
