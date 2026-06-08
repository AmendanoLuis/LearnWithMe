<script setup>
import { ref } from 'vue'
import ResizeHandle from './ResizeHandle.vue'
import { layoutState, beginResize } from '../layoutStore.js'

defineProps({
  hint: { type: String, default: '' },
  filename: { type: String, default: 'script.js' },
  language: { type: String, default: 'JavaScript' },
})

const playgroundRef = ref(null)

function startPlaygroundResize(e) {
  beginResize('playground', e, playgroundRef.value)
}
</script>

<template>
  <div class="playground">
    <p v-if="hint" class="step-hint playground-hint">{{ hint }}</p>
    <div ref="playgroundRef" class="playground-columns">
      <div class="playground-col code-col" :style="{ width: layoutState.playgroundSplit + '%' }">
        <div class="code-file-header">
          <div class="code-file-dots">
            <span class="dot dot-red" />
            <span class="dot dot-yellow" />
            <span class="dot dot-green" />
          </div>
          <span class="code-file-name">{{ filename }}</span>
          <span class="code-file-lang">{{ language }}</span>
        </div>
        <div class="playground-body code-side">
          <slot name="code" />
        </div>
      </div>

      <ResizeHandle
        axis="horizontal"
        label="Redimensionar código y resultado"
        @resize-start="startPlaygroundResize"
      />

      <div class="playground-col result-col">
        <div class="playground-header">
          <span class="playground-label">Resultado</span>
          <span class="playground-sub">Lo que ocurre</span>
        </div>
        <div class="playground-body result-side">
          <slot name="result" />
        </div>
      </div>
    </div>
  </div>
</template>
