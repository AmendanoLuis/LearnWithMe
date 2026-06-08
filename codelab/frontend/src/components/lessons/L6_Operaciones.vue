<script setup>
import { ref, computed } from 'vue'
import CodePlayground from '../CodePlayground.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { parseOperaciones } from '../../utils/codeParser.js'
import { addLocalActivity } from '../../inspectorStore.js'

const codigo = ref(`let a = 10;
let b = 3;
let suma = a + b;
let resta = a - b;
let esMayor = a > b;`)

const parsed = computed(() => parseOperaciones(codigo.value))

async function demoOperadores() {
  const p = parseOperaciones(codigo.value)
  addLocalActivity({
    titulo: 'Operaciones calculadas',
    enviaste: { codigo: codigo.value },
    respondio: p.ok ? p.resultados : { error: p.error },
  })
}
</script>

<template>
  <div>
    <h2 class="lesson-title">Operadores</h2>
    <p class="lesson-subtitle">
      Con variables puedes calcular: sumar, restar, comparar. En el juego,
      <code class="inline-code">mover(jugador, 0, -VELOCIDAD)</code> usa el signo
      <code class="inline-code">-</code> para subir.
    </p>

    <CodePlayground hint="Cambia a y b. Observa cómo se actualizan suma, resta y esMayor.">
      <template #code>
        <textarea v-model="codigo" class="code-editor" rows="7" spellcheck="false" />
      </template>
      <template #result>
        <div v-if="parsed.ok" class="result-panel">
          <div v-for="r in parsed.resultados" :key="r.nombre" class="var-result-card">
            <div class="result-row">
              <span class="result-key">Variable</span>
              <span class="result-value">{{ r.nombre }}</span>
            </div>
            <div class="result-row">
              <span class="result-key">Expresión</span>
              <code class="inline-code">{{ r.expresion }}</code>
            </div>
            <div class="result-row">
              <span class="result-key">Resultado</span>
              <span class="result-value highlight">{{ r.valor }}</span>
            </div>
          </div>
        </div>
        <div v-else class="result-error">{{ parsed.error }}</div>
      </template>
    </CodePlayground>

    <div class="concept-box">
      <h3 class="concept-box-title">Operadores que usarás mucho</h3>
      <ul class="concept-list">
        <li><code class="inline-code">+</code> <code class="inline-code">-</code> <code class="inline-code">*</code> <code class="inline-code">/</code> — matemáticas</li>
        <li><code class="inline-code">&gt;</code> <code class="inline-code">&lt;</code> <code class="inline-code">&gt;=</code> <code class="inline-code">&lt;=</code> — comparar (devuelve true/false)</li>
        <li><code class="inline-code">===</code> — ¿son iguales? (muy usado en if)</li>
      </ul>
    </div>

    <LessonNetworkDemo
      descripcion="Calcula suma, resta y comparaciones del editor. Resultado en el navegador."
      boton="Calcular operaciones"
      sin-servidor
      :ejecutar="demoOperadores"
    />

    <div class="aha-moment">
      En el juego, cambiar <code class="inline-code">+VELOCIDAD</code> por <code class="inline-code">-VELOCIDAD</code>
      invierte la dirección. Un operador mal puesto cambia todo el comportamiento.
    </div>
  </div>
</template>
