import { h } from 'vue';

export function createIcon(name, paths) {
    return {
        name,
        props: {
            size: { type: [Number, String], default: '1em' },
            title: { type: String, default: null }
        },
        setup(props, { attrs }) {
            return () =>
                h(
                    'svg',
                    {
                        xmlns: 'http://www.w3.org/2000/svg',
                        viewBox: '0 0 24 24',
                        width: props.size,
                        height: props.size,
                        fill: 'currentColor',
                        'aria-hidden': props.title ? undefined : 'true',
                        role: props.title ? 'img' : undefined,
                        ...attrs
                    },
                    [
                        // Built conditionally rather than with a null placeholder, which Vue
                        // would render as a stray <!----> comment in SSR output.
                        ...(props.title ? [h('title', props.title)] : []),
                        ...paths.map(([d, fillRule, clipRule]) =>
                            h('path', { d, 'fill-rule': fillRule, 'clip-rule': clipRule })
                        )
                    ]
                );
        }
    };
}
