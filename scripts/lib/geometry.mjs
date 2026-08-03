/**
 * Path measurement shared by normalize-svg.mjs and add-icon.mjs.
 *
 * Both need the box of what a path actually draws: the normalizer to prove optimization did not
 * move any geometry, add-icon to work out the scale onto the 1024 em grid.
 */

import svgpath from 'svgpath';

/**
 * Bounding box of the rendered outline.
 *
 * Curves are flattened by sampling rather than measured from their control points: svgo's
 * convertPathData legitimately rewrites a path's representation (arcs become cubics, curves get
 * re-fitted) while drawing the identical shape, and a control-point box would report that as a
 * large false change. Sampling compares what is actually drawn.
 */
export function bbox(d) {
    const box = [Infinity, Infinity, -Infinity, -Infinity];
    const STEPS = 48;

    const add = (x, y) => {
        box[0] = Math.min(box[0], x);
        box[1] = Math.min(box[1], y);
        box[2] = Math.max(box[2], x);
        box[3] = Math.max(box[3], y);
    };

    let current = [0, 0];
    let start = [0, 0];

    svgpath(d)
        .abs()
        .unarc()
        .unshort()
        .iterate((seg) => {
            const type = seg[0];

            if (type === 'M' || type === 'L') {
                current = [seg[1], seg[2]];
                if (type === 'M') start = current;
                add(...current);
            } else if (type === 'H') {
                current = [seg[1], current[1]];
                add(...current);
            } else if (type === 'V') {
                current = [current[0], seg[1]];
                add(...current);
            } else if (type === 'Z') {
                current = start;
            } else if (type === 'C' || type === 'Q') {
                const points =
                    type === 'C'
                        ? [current, [seg[1], seg[2]], [seg[3], seg[4]], [seg[5], seg[6]]]
                        : [current, [seg[1], seg[2]], [seg[3], seg[4]]];

                for (let i = 0; i <= STEPS; i++) {
                    const t = i / STEPS;
                    const u = 1 - t;

                    if (points.length === 4) {
                        add(
                            u ** 3 * points[0][0] + 3 * u * u * t * points[1][0] + 3 * u * t * t * points[2][0] + t ** 3 * points[3][0],
                            u ** 3 * points[0][1] + 3 * u * u * t * points[1][1] + 3 * u * t * t * points[2][1] + t ** 3 * points[3][1]
                        );
                    } else {
                        add(
                            u * u * points[0][0] + 2 * u * t * points[1][0] + t * t * points[2][0],
                            u * u * points[0][1] + 2 * u * t * points[1][1] + t * t * points[2][1]
                        );
                    }
                }

                current = points[points.length - 1];
            }
        });

    return box;
}

/**
 * Union of each path's own box. Paths must be measured separately: convertPathData emits
 * relative coordinates, so concatenating two path strings would make the second one be read
 * relative to where the first ended.
 */
export function unionBbox(list) {
    return list
        .map(bbox)
        .reduce((a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])]);
}
