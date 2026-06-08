<script setup>
import { ref, computed, watch } from 'vue'
import CodePlayground from '../CodePlayground.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { parseArray, parseArrayIndex } from '../../utils/codeParser.js'
import { api } from '../../api.js'

const codigo = ref(`let compras = ["manzana", "pera", "uva", "naranja", "kiwi", "fresa"];`)

const indiceInput = ref('compras[0]')
const indiceSeleccionado = ref(0)

const parsed = computed(() => parseArray(codigo.value))

const indexResult = computed(() => {
  if (!parsed.value.ok) return null
  return parseArrayIndex(indiceInput.value, parsed.value.nombre, parsed.value.items)
})

function seleccionarIndice(i) {
  indiceSeleccionado.value = i
  if (parsed.value.ok) {
    indiceInput.value = `${parsed.value.nombre}[${i}]`
  }
}

function onInputIndice() {
  if (!parsed.value.ok) return
  const result = parseArrayIndex(indiceInput.value, parsed.value.nombre, parsed.value.items)
  if (result.ok) {
    indiceSeleccionado.value = result.index
  }
}

async function demoArrayServidor() {
  await api.productos.list()
}

watch(parsed, (p) => {
  if (!p.ok) return
  if (indiceSeleccionado.value >= p.items.length) {
    indiceSeleccionado.value = 0
  }
  indiceInput.value = `${p.nombre}[${indiceSeleccionado.value}]`
})
</script>

<template>
  <div>
    <h2 class="lesson-title">Arrays / Listas</h2>
    <p class="lesson-subtitle">
      En JavaScript una lista es un <code class="inline-code">array</code>: varios valores en orden, entre corchetes <code class="inline-code">[ ]</code>.
      El primer elemento es el índice <code class="inline-code">0</code>, no el 1.
    </p>

    <CodePlayground hint="Edita el array. Luego selecciona un índice para ver su valor.">
      <template #code>
        <textarea v-model="codigo" class="code-editor" rows="4" spellcheck="false" />
      </template>
      <template #result>
        <div v-if="parsed.ok" class="result-panel">
          <p class="result-desc">
            <strong>{{ parsed.nombre }}</strong> tiene {{ parsed.items.length }} elementos
            (índices de 0 a {{ parsed.items.length - 1 }}):
          </p>

          <div class="array-index-picker">
            <span class="array-picker-label">Selecciona índice:</span>
            <button
              v-for="(_, i) in parsed.items"
              :key="i"
              type="button"
              class="index-btn"
              :class="{ active: indiceSeleccionado === i }"
              @click="seleccionarIndice(i)"
            >
              {{ i }}
            </button>
          </div>

          <div
            v-for="(item, i) in parsed.items"
            :key="i"
            class="array-item"
            :class="{ 'array-item-selected': indiceSeleccionado === i }"
          >
            <span class="array-index">{{ parsed.nombre }}[{{ i }}]</span>
            <span>{{ item }}</span>
            <span v-if="indiceSeleccionado === i" class="loop-marker">← seleccionado</span>
          </div>

          <div class="array-access-box">
            <label class="array-access-label" :for="'idx-' + parsed.nombre">Accede con corchetes:</label>
            <input
              :id="'idx-' + parsed.nombre"
              v-model="indiceInput"
              type="text"
              class="array-access-input"
              :placeholder="parsed.nombre + '[2]'"
              spellcheck="false"
              @input="onInputIndice"
            />
          </div>

          <div v-if="indexResult?.ok" class="array-access-result ok">
            <code class="inline-code">{{ indexResult.expression }}</code>
            =
            <strong>"{{ indexResult.value }}"</strong>
            <span class="array-position-hint">(posición {{ indexResult.index + 1 }} en la lista)</span>
          </div>
          <div v-else-if="indexResult" class="array-access-result" :class="indexResult.outOfRange ? 'warn' : 'error'">
            <template v-if="indexResult.outOfRange">
              <code class="inline-code">{{ parsed.nombre }}[{{ indexResult.index }}]</code>
              = <strong>undefined</strong>
            </template>
            {{ indexResult.error }}
          </div>
        </div>
        <div v-else class="result-error">{{ parsed.error }}</div>
      </template>
    </CodePlayground>

    <LessonNetworkDemo
      descripcion="El servidor devuelve una lista (array) de productos. GET /api/productos → [{...}, {...}]"
      boton="Pedir lista al servidor"
      :ejecutar="demoArrayServidor"
    />

    <div class="aha-moment">
      <code class="inline-code">compras[3]</code> devuelve el cuarto elemento porque los índices empiezan en 0.
    </div>
  </div>
</template>
