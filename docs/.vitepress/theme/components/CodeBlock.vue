<script setup>
// Same markup as a fenced code block, so it picks up the theme's styling and its copy button.
defineProps({
    code: { type: String, required: true },
    lang: { type: String, default: 'html' }
});
</script>

<template>
    <div class="vp-doc code-block">
        <div :class="`language-${lang}`">
            <button title="Copy Code" class="copy"></button>
            <span class="lang">{{ lang }}</span>
            <pre class="vp-code"><code>{{ code }}</code></pre>
        </div>
    </div>
</template>

<style scoped>
.code-block :deep(div[class*='language-']) {
    margin: 0;
}

.code-block pre {
    white-space: pre;
}
</style>
