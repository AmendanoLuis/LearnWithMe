<script setup>
import { ref, computed } from 'vue'
import CodePlayground from '../CodePlayground.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { parseFunctionCall } from '../../utils/codeParser.js'
import { addLocalActivity } from '../../inspectorStore.js'
import { api } from '../../api.js'

const codigo = ref(`function doblar(numero) {
  return numero * 2;
}

doblar(5);`)

const funciones = {
  doblar: (n) => {
    const num = Number(n)
    return isNaN(num) ? '?' : num * 2
  },
  saludar: (nombre) => `Hola, ${nombre}`,
  sumar: (texto) => {
    const nums = String(texto).split(',').map((x) => Number(x.trim())).filter((n) => !isNaN(n))
    return nums.reduce((a, b) => a + b, 0)
  },
}

const parsed = computed(() => parseFunctionCall(codigo.value))

const resultado = computed(() => {
  if (!parsed.value.ok) return null
  const fn = funciones[parsed.value.fn]
  if (!fn) return { error: `Función "${parsed.value.fn}" no definida. Prueba doblar, saludar o sumar.` }
  return { valor: fn(parsed.value.arg) }
})

async function demoFuncionLocal() {
  const p = parsed.value
  addLocalActivity({
    titulo: 'Llamada a función local',
    enviaste: p.ok ? { llamada: `${p.fn}(${JSON.stringify(p.arg)})` } : { error: 'sin llamada' },
    respondio: resultado.value?.error ? { error: resultado.value.error } : { resultado: resultado.value?.valor },
  })
}

async function demoFuncionServidor() {
  await api.get('/api/ping')
}
</script>

<template>
  <div>
    <h2 class="lesson-title">Funciones</h2>
    <p class="lesson-subtitle">
      En JavaScript defines una función con <code class="inline-code">function</code> y la llamas con su nombre y paréntesis.
    </p>

    <CodePlayground hint="Define la función arriba y llámala abajo con doblar(5);">
      <template #code>
        <textarea v-model="codigo" class="code-editor" rows="8" spellcheck="false" />
      </template>
      <template #result>
        <div v-if="parsed.ok && resultado && !resultado.error" class="result-panel">
          <div class="function-flow vertical">
            <div class="flow-step">
              <span class="flow-label">Llamada</span>
              <span class="result-value">{{ parsed.fn }}({{ parsed.arg }})</span>
            </div>
            <span class="flow-arrow-down">↓</span>
            <div class="flow-step">
              <span class="flow-label">return</span>
              <span class="result-value highlight success-text">{{ resultado.valor }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="resultado?.error" class="result-error">{{ resultado.error }}</div>
        <div v-else class="result-error">{{ parsed.error }}</div>
      </template>
    </CodePlayground>

    <LessonNetworkDemo
      descripcion="Llama a la función del editor (doblar, saludar…) — corre en el navegador."
      boton="Ejecutar función local"
      sin-servidor
      :ejecutar="demoFuncionLocal"
    />
    <LessonNetworkDemo
      descripcion="Una función también puede llamar al servidor. Aquí pedimos /api/ping."
      boton="Función que llama al servidor"
      :ejecutar="demoFuncionServidor"
    />

    <div class="aha-moment">
      <code class="inline-code">function</code> + <code class="inline-code">return</code> es el patrón básico de JavaScript para reutilizar lógica.
    </div>
  </div>
</template>
