<script setup>
import { computed, ref } from 'vue'
import ResizeHandle from './ResizeHandle.vue'
import { layoutState, beginResize } from '../layoutStore.js'

const codigo = defineModel({ type: String, required: true })

const props = defineProps({
  resuelto: { type: Boolean, default: false },
  pista: { type: String, default: '' },
})

const estado = computed(() => (props.resuelto ? 'ok' : 'pendiente'))
const challengeRef = ref(null)

function startResize(e) {
  beginResize('playground', e, challengeRef.value)
}
</script>

<template>
  <div class="code-challenge">
    <div class="challenge-banner" :class="estado">
      <span v-if="resuelto">✓ Reto resuelto — el código cuadra</span>
      <span v-else>⚠ Algo en el código no cuadra. Léelo, prueba la actividad y corrígelo.</span>
    </div>

    <div ref="challengeRef" class="playground-columns">
      <div class="playground-col code-col" :style="{ width: layoutState.playgroundSplit + '%' }">
        <div class="code-file-header">
          <div class="code-file-dots">
            <span class="dot dot-red" />
            <span class="dot dot-yellow" />
            <span class="dot dot-green" />
          </div>
          <span class="code-file-name">reto.js</span>
          <span class="code-file-lang">JavaScript</span>
        </div>
        <div class="playground-body code-side">
          <textarea v-model="codigo" class="code-editor code-editor-tall" spellcheck="false" />
          <p v-if="pista && !resuelto" class="code-help challenge-pista">{{ pista }}</p>
        </div>
      </div>

      <ResizeHandle
        axis="horizontal"
        label="Redimensionar código y actividad"
        @resize-start="startResize"
      />

      <div class="playground-col result-col">
        <div class="playground-header">
          <span class="playground-label">Actividad</span>
          <span class="playground-sub">Prueba si funciona</span>
        </div>
        <div class="playground-body result-side">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
