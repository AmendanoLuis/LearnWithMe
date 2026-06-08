<script setup>
import { ref, computed, watch } from 'vue'
import CodePlayground from '../CodePlayground.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { parseVariables } from '../../utils/codeParser.js'
import { addLocalActivity } from '../../inspectorStore.js'

const codigo = ref(`const VELOCIDAD = 12;
let puntos = 100;
let jugador1 = { x: 50, y: 180 };`)

const parsed = computed(() => parseVariables(codigo.value))

const comparativa = [
  { kw: 'let', uso: 'Valor que puede cambiar', ejemplo: 'let puntos = 100;', clase: 'kw-let' },
  { kw: 'const', uso: 'Valor fijo', ejemplo: 'const VELOCIDAD = 12;', clase: 'kw-const' },
  { kw: 'var', uso: 'Forma antigua (evítala)', ejemplo: 'var nombre = "Ana";', clase: 'kw-var' },
]

const ejemplosError = [
  {
    id: 'mayuscula',
    codigo: 'Let puntos = 100;',
    desc: 'Mayúscula en let',
    porque:
      'JavaScript distingue mayúsculas y minúsculas. Let no es una palabra que el navegador reconozca — solo let.',
  },
  {
    id: 'numero',
    codigo: 'let 1nombre = "Ana";',
    desc: 'Empieza por número',
    porque:
      'Un nombre no puede empezar por número porque JavaScript lo confundiría con un valor numérico.',
  },
  {
    id: 'espacio',
    codigo: 'let mi nombre = "Ana";',
    desc: 'Espacio en el nombre',
    porque:
      'Un espacio parte el nombre en dos palabras: mi y nombre. Usa camelCase: miNombre.',
  },
]

const ejemploActivo = ref(null)

function probarEjemplo(ej) {
  codigo.value = ej.codigo
  ejemploActivo.value = ej.id
}

const explicacionActiva = computed(() =>
  ejemplosError.find((e) => e.id === ejemploActivo.value)?.porque ?? null
)

watch(codigo, (v) => {
  const linea = v.split('\n').find((l) => l.trim())?.trim()
  const match = ejemplosError.find((e) => e.codigo === linea)
  ejemploActivo.value = match?.id ?? null
})

function keywordClass(kw) {
  return `kw-badge kw-${kw}`
}

async function demoVariables() {
  const p = parseVariables(codigo.value)
  addLocalActivity({
    titulo: 'Variables en el navegador',
    enviaste: { codigo: codigo.value },
    respondio: p.ok
      ? { variables: p.variables, nota: 'Esto ocurre solo en tu navegador — no llama al servidor' }
      : { error: p.error },
  })
}

function keywordHint(kw) {
  if (kw === 'const') return 'No se reasigna. const VELOCIDAD = 20 daría error.'
  if (kw === 'let') return 'Puedes cambiar el valor: puntos = 50'
  return 'Funciona, pero let/const son más claros'
}
</script>

<template>
  <div>
    <h2 class="lesson-title">Variables</h2>
    <p class="lesson-subtitle">
      Una variable es una caja con nombre. En JavaScript la creas con
      <code class="inline-code">let</code>, <code class="inline-code">const</code> o <code class="inline-code">var</code>.
    </p>

    <div class="kw-compare">
      <div v-for="item in comparativa" :key="item.kw" class="kw-compare-card" :class="item.clase">
        <span :class="keywordClass(item.kw)">{{ item.kw }}</span>
        <p class="kw-compare-uso">{{ item.uso }}</p>
        <code class="inline-code">{{ item.ejemplo }}</code>
      </div>
    </div>

    <CodePlayground hint="Edita las declaraciones. Observa let, const y var.">
      <template #code>
        <textarea v-model="codigo" class="code-editor" rows="6" spellcheck="false" />
      </template>
      <template #result>
        <div v-if="parsed.ok" class="result-panel">
          <div v-for="v in parsed.variables" :key="v.nombre" class="var-result-card">
            <div class="result-row">
              <span class="result-key">Declaración</span>
              <span :class="keywordClass(v.keyword)">{{ v.keyword }}</span>
              <span class="result-value">{{ v.nombre }}</span>
            </div>
            <div class="result-row">
              <span class="result-key">Valor</span>
              <span class="result-value highlight">{{ v.valor }}</span>
            </div>
            <p class="kw-hint">{{ keywordHint(v.keyword) }}</p>
          </div>
        </div>
        <div v-else class="result-panel">
          <div class="result-error">{{ parsed.error }}</div>
          <p v-if="explicacionActiva" class="error-why">{{ explicacionActiva }}</p>
        </div>
      </template>
    </CodePlayground>

    <div class="error-examples">
      <h3 class="error-examples-title">¿Qué pasa si…?</h3>
      <p class="error-examples-desc">Pulsa un ejemplo para ver por qué rompe el código.</p>
      <div class="error-examples-list">
        <div
          v-for="ej in ejemplosError"
          :key="ej.id"
          class="error-example-card"
          :class="{ active: ejemploActivo === ej.id }"
        >
          <button type="button" class="error-example-btn" @click="probarEjemplo(ej)">
            <code class="inline-code">{{ ej.codigo }}</code>
            <span class="error-example-label">{{ ej.desc }}</span>
          </button>
          <p class="error-example-why">{{ ej.porque }}</p>
        </div>
      </div>
    </div>

    <LessonNetworkDemo
      descripcion="Ejecuta las variables del editor. Verás que todo pasa en el navegador — todavía no hay llamada al servidor."
      boton="Ejecutar variables del editor"
      sin-servidor
      :ejecutar="demoVariables"
    />

    <div class="aha-moment">
      Regla práctica: <code class="inline-code">const</code> por defecto; si el valor cambia, usa <code class="inline-code">let</code>.
    </div>
  </div>
</template>
