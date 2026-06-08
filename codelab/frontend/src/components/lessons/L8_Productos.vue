<script setup>
import { ref, computed, onMounted } from 'vue'
import CodeChallenge from '../CodeChallenge.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { api } from '../../api.js'
import { CHALLENGE_CODE, validateProductos } from '../../utils/codeChallenges.js'

const codigo = ref(CHALLENGE_CODE.productos)
const resuelto = computed(() => validateProductos(codigo.value))

const nombre = ref('')
const precio = ref(1.5)
const productos = ref([])
const cargando = ref(false)
const mensaje = ref('')

async function cargar() {
  cargando.value = true
  try {
    productos.value = await api.productos.list()
  } finally {
    cargando.value = false
  }
}

async function anadir() {
  if (!nombre.value.trim()) return
  if (!resuelto.value) {
    mensaje.value = 'No se añade. Revisa la URL del fetch en el código.'
    return
  }
  mensaje.value = ''
  try {
    await api.productos.create({
      nombre: nombre.value.trim(),
      precio: Number(precio.value),
      stock: 10,
    })
    nombre.value = ''
    precio.value = 1
    await cargar()
  } catch {
    mensaje.value = 'Error al guardar. ¿Servidor arrancado?'
  }
}

async function borrar(id) {
  try {
    await api.productos.delete(id)
    await cargar()
  } catch { /* */ }
}

onMounted(cargar)
</script>

<template>
  <div>
    <h2 class="lesson-title">Productos — reto <span class="lesson-badge-inline">extra</span></h2>
    <p class="lesson-subtitle">
      El catálogo no recibe productos nuevos. Hay un fallo en la URL del <code class="inline-code">fetch</code>.
    </p>

    <CodeChallenge
      v-model="codigo"
      :resuelto="resuelto"
      pista="La ruta del servidor es /api/productos (en plural)."
    >
      <div class="activity-panel">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="nombre" placeholder="Manzana" />
          </div>
          <div class="form-group">
            <label>Precio (€)</label>
            <input v-model.number="precio" type="number" step="0.01" min="0.01" />
          </div>
          <button type="button" :disabled="!nombre.trim()" @click="anadir">Añadir</button>
        </div>
        <p v-if="mensaje" class="error-msg">{{ mensaje }}</p>
        <p v-else-if="resuelto && productos.length" class="success-msg" style="margin-top:0.5rem">El código cuadra — ya puedes añadir productos.</p>

        <div class="product-grid">
          <div v-for="p in productos" :key="p.id" class="product-tile">
            <div class="product-tile-name">{{ p.nombre }}</div>
            <div class="product-tile-price">{{ p.precio }} €</div>
            <button type="button" class="danger" style="margin-top:0.5rem;padding:0.25rem 0.5rem;font-size:0.7rem" @click="borrar(p.id)">Quitar</button>
          </div>
        </div>
        <p v-if="!productos.length && !cargando" class="empty-hint">Sin productos todavía.</p>
      </div>
    </CodeChallenge>

    <LessonNetworkDemo
      descripcion="Usa el formulario de arriba (Añadir / Actualizar). Cada petición aparece en Network → Esta lección."
      boton="Cargar productos del servidor"
      :ejecutar="cargar"
    />

    <div class="aha-moment">
      Una letra de más o de menos en la URL (<code class="inline-code">/api/producto</code> vs <code class="inline-code">/api/productos</code>) y el servidor no entiende la petición.
    </div>
  </div>
</template>
