<script setup>
import { ref, computed } from 'vue'
import CodePlayground from '../CodePlayground.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { parseVariables } from '../../utils/codeParser.js'
import { addLocalActivity } from '../../inspectorStore.js'

const codigo = ref(`let puntos = 100;
let nombre = "Ana";
let activo = true;
let precio = 9.99;`)

const parsed = computed(() => parseVariables(codigo.value))

function tipoClass(tipo) {
  if (tipo === 'número') return 'type-number'
  if (tipo === 'sí/no') return 'type-boolean'
  return 'type-string'
}

async function demoTipos() {
  const p = parseVariables(codigo.value)
  addLocalActivity({
    titulo: 'Tipos de dato detectados',
    enviaste: { codigo: codigo.value },
    respondio: p.ok ? p.variables.map((v) => ({ nombre: v.nombre, tipo: v.tipo, valor: v.valor })) : { error: p.error },
  })
}

const tiposInfo = [
  { tipo: 'número', icon: '123', desc: 'Cálculos y contadores', ej: '100, 3.14, -5' },
  { tipo: 'texto', icon: 'Aa', desc: 'Palabras y frases entre comillas', ej: '"Ana", "hola"' },
  { tipo: 'sí/no', icon: '✓✗', desc: 'Verdadero o falso', ej: 'true, false' },
]
</script>

<template>
  <div>
    <h2 class="lesson-title">Tipos de datos</h2>
    <p class="lesson-subtitle">
      Cada variable guarda un valor de un tipo. JavaScript detecta el tipo según lo que escribes.
    </p>

    <div class="tipo-cards">
      <div v-for="t in tiposInfo" :key="t.tipo" class="tipo-card">
        <span class="tipo-card-icon">{{ t.icon }}</span>
        <strong>{{ t.tipo }}</strong>
        <p>{{ t.desc }}</p>
        <code class="inline-code">{{ t.ej }}</code>
      </div>
    </div>

    <CodePlayground hint="Cambia los valores. Observa cómo cambia el tipo.">
      <template #code>
        <textarea v-model="codigo" class="code-editor" rows="6" spellcheck="false" />
      </template>
      <template #result>
        <div v-if="parsed.ok" class="result-panel">
          <div v-for="v in parsed.variables" :key="v.nombre" class="var-result-card">
            <div class="result-row">
              <span class="result-key">{{ v.nombre }}</span>
              <span class="result-value highlight">{{ v.valor }}</span>
            </div>
            <div class="result-row">
              <span class="result-key">Tipo</span>
              <span :class="['type-badge', tipoClass(v.tipo)]">{{ v.tipo }}</span>
            </div>
          </div>
        </div>
        <div v-else class="result-error">{{ parsed.error }}</div>
      </template>
    </CodePlayground>

    <LessonNetworkDemo
      descripcion="JavaScript detecta si cada valor es número, texto o sí/no. Todo ocurre en el navegador."
      boton="Ver tipos del editor"
      sin-servidor
      :ejecutar="demoTipos"
    />

    <div class="aha-moment">
      Los textos van entre comillas: <code class="inline-code">"Ana"</code>.
      Los números no: <code class="inline-code">100</code>.
      Los sí/no son <code class="inline-code">true</code> o <code class="inline-code">false</code> sin comillas.
    </div>
  </div>
</template>
