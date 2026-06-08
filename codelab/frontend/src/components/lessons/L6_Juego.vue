<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CodeChallenge from '../CodeChallenge.vue'
import LessonNetworkDemo from '../LessonNetworkDemo.vue'
import { addLocalActivity } from '../../inspectorStore.js'
import { CHALLENGE_CODE, validateJuego } from '../../utils/codeChallenges.js'

const SIZE = 400
const PLAYER = 32
const SPEED = 12

const codigo = ref(CHALLENGE_CODE.juego)
const resuelto = computed(() => validateJuego(codigo.value))

const p1 = ref({ x: 50, y: 180 })
const p2 = ref({ x: 300, y: 180 })
const choque = ref(false)
const keys = new Set()

function mover(jugador, dx, dy) {
  const max = SIZE - PLAYER
  jugador.x = Math.max(0, Math.min(max, jugador.x + dx))
  jugador.y = Math.max(0, Math.min(max, jugador.y + dy))
  comprobarChoque()
}

function comprobarChoque() {
  const colision =
    p1.value.x < p2.value.x + PLAYER &&
    p1.value.x + PLAYER > p2.value.x &&
    p1.value.y < p2.value.y + PLAYER &&
    p1.value.y + PLAYER > p2.value.y
  if (colision) {
    choque.value = true
    p1.value = { x: 50, y: 180 }
    p2.value = { x: 300, y: 180 }
    setTimeout(() => { choque.value = false }, 800)
  }
}

function tick() {
  const wDy = resuelto.value ? -SPEED : SPEED
  const sDy = resuelto.value ? SPEED : -SPEED

  if (keys.has('w')) mover(p1.value, 0, wDy)
  if (keys.has('s')) mover(p1.value, 0, sDy)
  if (keys.has('a')) mover(p1.value, -SPEED, 0)
  if (keys.has('d')) mover(p1.value, SPEED, 0)
  if (keys.has('arrowup')) mover(p2.value, 0, -SPEED)
  if (keys.has('arrowdown')) mover(p2.value, 0, SPEED)
  if (keys.has('arrowleft')) mover(p2.value, -SPEED, 0)
  if (keys.has('arrowright')) mover(p2.value, SPEED, 0)
}

function onKeyDown(e) {
  keys.add(e.key.toLowerCase())
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
    e.preventDefault()
  }
  tick()
}

function onKeyUp(e) {
  keys.delete(e.key.toLowerCase())
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
})

async function demoJuego() {
  addLocalActivity({
    titulo: 'Movimiento del juego',
    enviaste: { teclas: 'W A S D / flechas', codigo: 'const VELOCIDAD, let jugador1...' },
    respondio: {
      jugador1: p1.value,
      jugador2: p2.value,
      nota: 'El juego no llama al servidor — todo es JavaScript en el navegador',
    },
  })
}
</script>

<template>
  <div>
    <h2 class="lesson-title">El juego — reto</h2>
    <p class="lesson-subtitle">
      Aquí verás <code class="inline-code">const VELOCIDAD</code> y <code class="inline-code">let jugador1</code> en acción.
      El juego no se comporta bien: léelo, juega, y corrige el error en los signos <code class="inline-code">+</code> / <code class="inline-code">-</code>.
    </p>

    <CodeChallenge
      v-model="codigo"
      :resuelto="resuelto"
      pista="W debería subir (y menor) y S debería bajar (y mayor). Mira los signos en mover(jugador1, 0, ...)."
    >
      <div class="game-tab-content">
        <div class="game-arena" :style="{ width: SIZE + 'px', height: SIZE + 'px' }">
          <div class="game-player p1" :style="{ left: p1.x + 'px', top: p1.y + 'px', width: PLAYER + 'px', height: PLAYER + 'px' }" />
          <div class="game-player p2" :style="{ left: p2.x + 'px', top: p2.y + 'px', width: PLAYER + 'px', height: PLAYER + 'px' }" />
          <div v-if="choque" class="game-choque">Choque</div>
        </div>
        <div class="game-controls-info">
          <p><span class="player-tag p1-tag">Azul</span> W A S D</p>
          <p><span class="player-tag p2-tag">Rojo</span> Flechas</p>
          <p v-if="!resuelto" class="challenge-hint-inline">¿W sube o baja? Algo está al revés.</p>
        </div>
      </div>
    </CodeChallenge>

    <LessonNetworkDemo
      descripcion="Mueve los jugadores y registra el estado. El juego es 100% navegador — sin servidor."
      boton="Registrar estado del juego"
      sin-servidor
      :ejecutar="demoJuego"
    />

    <div class="aha-moment">
      Un signo cambiado en JavaScript (<code class="inline-code">+</code> por <code class="inline-code">-</code>) cambia por completo lo que hace la app.
    </div>
  </div>
</template>
