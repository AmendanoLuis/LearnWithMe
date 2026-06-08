<script setup>
import WebStackExplainer from '../WebStackExplainer.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { api } from '../../api.js'

async function demoPing() {
  await api.get('/api/ping')
}
</script>

<template>
  <div>
    <h2 class="lesson-title">Cómo funciona una web</h2>
    <p class="lesson-subtitle">
      Una app web combina HTML, CSS, JavaScript y un servidor. Esta lección explica las capas
      antes de programar.
    </p>

    <WebStackExplainer highlight="javascript" />

    <LessonNetworkDemo
      descripcion="El navegador pregunta al servidor si está vivo. Es la forma más simple de comunicarse: una petición GET y una respuesta."
      boton="Preguntar al servidor (GET /api/ping)"
      :ejecutar="demoPing"
    />

    <div class="aha-moment">
      Cuando pulses el botón, el navegador envía una petición y el servidor responde.
      Eso es exactamente lo que verás en Network.
    </div>
  </div>
</template>
