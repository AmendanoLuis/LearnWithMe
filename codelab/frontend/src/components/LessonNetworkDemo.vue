<script setup>
import { ref, computed } from 'vue'
import { inspectorState } from '../inspectorStore.js'

const props = defineProps({
  descripcion: { type: String, required: true },
  boton: { type: String, default: 'Probar actividad' },
  ejecutar: { type: Function, required: true },
  sinServidor: { type: Boolean, default: false },
})

const loading = ref(false)
const modoCurioso = computed(() => inspectorState.modoCurioso)

async function run() {
  if (!modoCurioso.value) return
  loading.value = true
  try {
    await props.ejecutar()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="lesson-network-demo" :class="{ disabled: !modoCurioso }">
    <div class="lesson-network-demo-head">
      <span class="lesson-network-demo-icon">↕</span>
      <div>
        <h3 class="lesson-network-demo-title">Actividad de esta lección</h3>
        <p class="lesson-network-demo-desc">{{ descripcion }}</p>
      </div>
    </div>

    <button type="button" :disabled="loading || !modoCurioso" @click="run">
      {{ loading ? 'Ejecutando...' : boton }}
    </button>

    <p v-if="modoCurioso" class="lesson-network-demo-hint ok">
      Mira el panel <strong>Network</strong> abajo → pestaña <strong>Esta lección</strong>.
    </p>
    <p v-else class="lesson-network-demo-hint warn">
      Activa <strong>Modo curioso</strong> en el menú lateral para ver el panel Network y probar esta actividad.
    </p>

    <p v-if="sinServidor && modoCurioso" class="lesson-network-demo-note">
      Esta lección corre en el navegador — no llama al servidor de verdad.
    </p>
  </div>
</template>
