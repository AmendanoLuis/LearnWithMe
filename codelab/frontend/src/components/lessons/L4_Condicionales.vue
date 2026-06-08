<script setup>
import { ref, computed } from 'vue'
import CodePlayground from '../CodePlayground.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { parseCondition } from '../../utils/codeParser.js'
import { addLocalActivity } from '../../inspectorStore.js'

const codigo = ref(`let puntos = 50;
let mensaje;

if (puntos >= 30) {
  mensaje = "Sigues en el juego";
} else {
  mensaje = "Game over";
}`)

const parsed = computed(() => parseCondition(codigo.value))
const mensaje = computed(() =>
  parsed.value.ok
    ? (parsed.value.puntos >= 30 ? 'Sigues en el juego' : 'Game over')
    : ''
)

async function demoIf() {
  const p = parsed.value
  addLocalActivity({
    titulo: 'Decisión del if',
    enviaste: { puntos: p.ok ? p.puntos : null, condicion: 'puntos >= 30' },
    respondio: p.ok
      ? { rama: p.puntos >= 30 ? 'if' : 'else', mensaje: mensaje.value }
      : { error: p.error },
  })
}
</script>

<template>
  <div>
    <h2 class="lesson-title">Condicionales (if)</h2>
    <p class="lesson-subtitle">
      Con <code class="inline-code">if / else</code> el programa decide qué hacer según una condición.
    </p>

    <CodePlayground hint="Cambia let puntos = 50 y observa qué rama se ejecuta.">
      <template #code>
        <textarea v-model="codigo" class="code-editor" rows="10" spellcheck="false" />
      </template>
      <template #result>
        <div v-if="parsed.ok" class="result-panel">
          <p class="result-desc">puntos = <strong>{{ parsed.puntos }}</strong></p>
          <div :class="parsed.puntos >= 30 ? 'branch-active' : 'branch-inactive'">
            if (puntos >= 30) → <strong>{{ parsed.puntos >= 30 ? mensaje : '...' }}</strong>
          </div>
          <div :class="parsed.puntos < 30 ? 'branch-active' : 'branch-inactive'" style="margin-top:0.5rem">
            else → <strong>{{ parsed.puntos < 30 ? mensaje : '...' }}</strong>
          </div>
        </div>
        <div v-else class="result-error">{{ parsed.error }}</div>
      </template>
    </CodePlayground>

    <div class="concept-box">
      <h3 class="concept-box-title">Estructura de un if</h3>
      <pre class="stack-code lang-javascript" style="margin-top:0.5rem"><code>if (condición) {
  // se ejecuta si es true
} else {
  // se ejecuta si es false
}</code></pre>
    </div>

    <LessonNetworkDemo
      descripcion="Ejecuta el if del editor y mira qué rama se elige (if o else)."
      boton="Ejecutar condicional"
      sin-servidor
      :ejecutar="demoIf"
    />

    <div class="aha-moment">
      La condición devuelve <code class="inline-code">true</code> o <code class="inline-code">false</code> — por eso los operadores <code class="inline-code">&gt;</code>, <code class="inline-code">===</code> son tan útiles.
    </div>
  </div>
</template>
