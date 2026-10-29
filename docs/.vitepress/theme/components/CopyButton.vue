<script setup>
import { ref } from 'vue';
import { copyText } from '../lib/export.js';

const props = defineProps({
    text: { type: [String, Function], required: true },
    label: { type: String, required: true }
});

const copied = ref(false);
let timer;

async function copy() {
    await copyText(typeof props.text === 'function' ? props.text() : props.text);
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 1400);
}
</script>

<template>
    <button type="button" class="action" :class="{ done: copied }" @click="copy">
        <span aria-live="polite">{{ copied ? 'Copied' : label }}</span>
    </button>
</template>
