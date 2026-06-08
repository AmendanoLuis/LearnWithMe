<script setup>
import { ref } from 'vue'
import CodePlayground from '../CodePlayground.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { addLocalActivity } from '../../inspectorStore.js'

const codigoFor = ref(`let frutas = ["manzana", "pera", "uva"];

for (let i = 0; i < frutas.length; i++) {
  console.log(frutas[i]);
}`)

const codigoWhile = ref(`let contador = 0;

while (contador < 3) {
  console.log(contador);
  contador++;
}`)

const frutas = ['manzana', 'pera', 'uva']
const indiceActivo = ref(-1)
const valorActivo = ref('')
const procesandoFor = ref(false)

const whileValor = ref(-1)
const procesandoWhile = ref(false)

async function ejecutarFor() {
  procesandoFor.value = true
  indiceActivo.value = -1
  valorActivo.value = ''
  for (let i = 0; i < frutas.length; i++) {
    indiceActivo.value = i
    valorActivo.value = frutas[i]
    await new Promise((r) => setTimeout(r, 600))
  }
  indiceActivo.value = -1
  valorActivo.value = ''
  procesandoFor.value = false
}

async function ejecutarWhile() {
  procesandoWhile.value = true
  whileValor.value = -1
  for (let c = 0; c < 3; c++) {
    whileValor.value = c
    await new Promise((r) => setTimeout(r, 600))
  }
  whileValor.value = -1
  procesandoWhile.value = false
}

async function demoBucle() {
  addLocalActivity({
    titulo: 'Bucle for simulado',
    enviaste: { bucle: 'for (let i = 0; i < frutas.length; i++)' },
    respondio: { pasos: frutas.map((f, i) => ({ i, valor: f })) },
  })
}
</script>

<template>
  <div>
    <h2 class="lesson-title">Bucles (for, while)</h2>
    <p class="lesson-subtitle">
      Los bucles repiten código. <code class="inline-code">for</code> cuando sabes cuántas veces;
      <code class="inline-code">while</code> mientras una condición sea verdadera.
    </p>

    <CodePlayground hint="for: i va de 0 a frutas.length - 1.">
      <template #code>
        <textarea v-model="codigoFor" class="code-editor" rows="7" spellcheck="false" />
      </template>
      <template #result>
        <div class="result-panel">
          <p class="result-desc">frutas.length = <strong>{{ frutas.length }}</strong></p>
          <div v-for="(fruta, i) in frutas" :key="i" class="array-item" :class="{ 'loop-item-active': indiceActivo === i }">
            <span class="array-index">frutas[{{ i }}]</span>
            <span>{{ fruta }}</span>
            <span v-if="indiceActivo === i" class="loop-marker">i = {{ i }}</span>
          </div>
          <div v-if="indiceActivo >= 0" class="loop-step-banner">
            <code class="inline-code">i = {{ indiceActivo }}</code>
            → <code class="inline-code">frutas[{{ indiceActivo }}] = "{{ valorActivo }}"</code>
          </div>
          <button type="button" style="margin-top:0.75rem" :disabled="procesandoFor" @click="ejecutarFor">
            {{ procesandoFor ? 'Recorriendo...' : 'Ejecutar for' }}
          </button>
        </div>
      </template>
    </CodePlayground>

    <div class="playground-spacer" />
    <CodePlayground hint="while: se repite mientras contador &lt; 3.">
      <template #code>
        <textarea v-model="codigoWhile" class="code-editor" rows="7" spellcheck="false" />
      </template>
      <template #result>
        <div class="result-panel">
          <div v-for="n in 3" :key="n" class="array-item" :class="{ 'loop-item-active': whileValor === n - 1 }">
            <span class="array-index">vuelta {{ n - 1 }}</span>
            <span>contador = {{ n - 1 }}</span>
            <span v-if="whileValor === n - 1" class="loop-marker">← ahora</span>
          </div>
          <button type="button" style="margin-top:0.75rem" :disabled="procesandoWhile" @click="ejecutarWhile">
            {{ procesandoWhile ? 'Repitiendo...' : 'Ejecutar while' }}
          </button>
        </div>
      </template>
    </CodePlayground>

    <LessonNetworkDemo
      descripcion="Simula un bucle for que recorre el array de frutas paso a paso."
      boton="Simular bucle for"
      sin-servidor
      :ejecutar="demoBucle"
    />

    <div class="aha-moment">
      <code class="inline-code">for (let i = 0; i &lt; lista.length; i++)</code> recorre arrays.
      <code class="inline-code">while (condición)</code> repite hasta que la condición sea false.
    </div>
  </div>
</template>
