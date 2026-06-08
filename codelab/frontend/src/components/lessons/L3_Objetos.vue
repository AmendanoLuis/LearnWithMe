<script setup>
import { ref, computed } from 'vue'
import CodePlayground from '../CodePlayground.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { parseObject } from '../../utils/codeParser.js'
import { addLocalActivity } from '../../inspectorStore.js'
import { api } from '../../api.js'

const codigo = ref(`let personaje = {
  nombre: "Luna",
  nivel: 5,
  tieneEspada: true
};`)

const parsed = computed(() => parseObject(codigo.value))
const ficha = computed(() => parsed.value.ok ? parsed.value.data : null)

async function demoObjetoLocal() {
  const p = parsed.value
  addLocalActivity({
    titulo: 'Objeto del editor',
    enviaste: { codigo: codigo.value },
    respondio: p.ok ? p.data : { error: p.error },
  })
}

async function demoObjetoServidor() {
  const lista = await api.productos.list()
  const primero = lista[0] || { mensaje: 'No hay productos' }
  return primero
}
</script>

<template>
  <div>
    <h2 class="lesson-title">Objetos</h2>
    <p class="lesson-subtitle">
      Un objeto en JavaScript agrupa campos con nombre. Se escribe con llaves <code class="inline-code">{ }</code>.
    </p>

    <CodePlayground hint="Edita las propiedades del objeto. La ficha de la derecha se actualiza sola.">
      <template #code>
        <textarea v-model="codigo" class="code-editor" rows="9" spellcheck="false" />
      </template>
      <template #result>
        <div v-if="ficha" class="result-panel">
          <div class="character-card">
            <div class="character-card-title">{{ ficha.nombre || '—' }}</div>
            <div class="character-card-stat">Nivel {{ ficha.nivel ?? '—' }}</div>
            <div class="character-card-stat">{{ ficha.tieneEspada ? 'Con espada' : 'Sin espada' }}</div>
          </div>
          <p class="result-desc" style="margin-top:1rem">
            Accedes con <code class="inline-code">personaje.nombre</code>, <code class="inline-code">personaje.nivel</code>...
          </p>
        </div>
        <div v-else class="result-error">{{ parsed.error }}</div>
      </template>
    </CodePlayground>

    <LessonNetworkDemo
      descripcion="Objeto del editor (ficha personaje) — corre en el navegador."
      boton="Ver objeto del editor"
      sin-servidor
      :ejecutar="demoObjetoLocal"
    />
    <LessonNetworkDemo
      descripcion="El servidor devuelve objetos JSON. Cada producto es un objeto con nombre, precio..."
      boton="Pedir un producto del servidor"
      :ejecutar="demoObjetoServidor"
    />

    <div class="aha-moment">
      Al guardar notas o productos enviarás objetos JavaScript al servidor, convertidos a texto (JSON).
    </div>
  </div>
</template>
