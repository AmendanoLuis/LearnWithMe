<script setup>
import { ref, computed, onMounted } from 'vue'
import CodeChallenge from '../CodeChallenge.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { api } from '../../api.js'
import { CHALLENGE_CODE, validateNotas } from '../../utils/codeChallenges.js'

const codigo = ref(CHALLENGE_CODE.notas)
const resuelto = computed(() => validateNotas(codigo.value))

const titulo = ref('')
const texto = ref('')
const notas = ref([])
const cargando = ref(false)
const mensaje = ref('')

async function cargar() {
  cargando.value = true
  try {
    notas.value = await api.notas.list()
  } catch {
    mensaje.value = 'No se pudo conectar con el servidor.'
  } finally {
    cargando.value = false
  }
}

async function guardar() {
  if (!titulo.value.trim()) {
    mensaje.value = 'Escribe un título primero.'
    return
  }
  if (!resuelto.value) {
    mensaje.value = 'La nota no se guarda. Algo en el JavaScript no cuadra — revísalo antes de guardar.'
    return
  }
  mensaje.value = ''
  try {
    await api.notas.create({ titulo: titulo.value.trim(), texto: texto.value.trim() })
    titulo.value = ''
    texto.value = ''
    mensaje.value = 'Guardado. Recarga la página: la nota sigue ahí.'
    await cargar()
  } catch {
    mensaje.value = 'Error al guardar. ¿Está el servidor arrancado?'
  }
}

async function borrar(id) {
  try {
    await api.notas.delete(id)
    await cargar()
  } catch {
    mensaje.value = 'No se pudo borrar.'
  }
}

onMounted(cargar)
</script>

<template>
  <div>
    <h2 class="lesson-title">Mis notas — reto</h2>
    <p class="lesson-subtitle">
      La app de notas no guarda. El JavaScript de la izquierda tiene un error: encuéntralo y corrígelo.
    </p>

    <CodeChallenge
      v-model="codigo"
      :resuelto="resuelto"
      pista="Para crear algo nuevo en el servidor suele usarse POST, no GET."
    >
      <div class="activity-panel">
        <div class="form-group" style="margin-bottom:0.75rem">
          <label>Título</label>
          <input v-model="titulo" placeholder="Comprar leche" />
        </div>
        <div class="form-group" style="margin-bottom:0.75rem">
          <label>Texto</label>
          <textarea v-model="texto" rows="3" placeholder="Lo que quieras recordar..." />
        </div>
        <button type="button" :disabled="!titulo.trim()" @click="guardar">Guardar nota</button>
        <p v-if="mensaje" :class="mensaje.includes('Guardado') ? 'success-msg' : 'error-msg'">{{ mensaje }}</p>

        <hr class="activity-divider" />
        <h3 class="activity-subtitle">Notas en el servidor</h3>
        <button type="button" class="secondary" style="margin-bottom:0.75rem" :disabled="cargando" @click="cargar">
          {{ cargando ? 'Cargando...' : 'Actualizar' }}
        </button>
        <div v-if="notas.length" class="notes-list">
          <div v-for="nota in notas" :key="nota.id" class="note-card">
            <div class="note-card-header">
              <strong>{{ nota.titulo }}</strong>
              <button type="button" class="danger" style="padding:0.2rem 0.5rem;font-size:0.7rem" @click="borrar(nota.id)">Borrar</button>
            </div>
            <p v-if="nota.texto" class="note-card-text">{{ nota.texto }}</p>
          </div>
        </div>
        <p v-else class="empty-hint">Sin notas guardadas todavía.</p>
      </div>
    </CodeChallenge>

    <LessonNetworkDemo
      descripcion="Usa el formulario de arriba (Guardar nota / Actualizar). Cada acción aparece en Network → Esta lección."
      boton="Cargar notas del servidor"
      :ejecutar="cargar"
    />

    <div class="aha-moment">
      El formulario llama a <code class="inline-code">guardarNota</code>. Si el <code class="inline-code">fetch</code> está mal, nada se guarda aunque pulses el botón.
    </div>
  </div>
</template>
