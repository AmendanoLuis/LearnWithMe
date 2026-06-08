<script setup>
import { ref } from 'vue'

const props = defineProps({
  activeLayer: {
    type: String,
    default: 'preview',
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const titulo = ref('')
const notas = ref(['Comprar pan', 'Estudiar JavaScript'])
const guardando = ref(false)
const inputError = ref(false)
const btnPressed = ref(false)
const feedback = ref(null)
const ultimaNotaId = ref(null)
let notaId = 2

async function guardar() {
  const t = titulo.value.trim()
  if (!t) {
    inputError.value = true
    feedback.value = { type: 'error', text: 'Escribe un título en el campo de texto' }
    setTimeout(() => { inputError.value = false }, 700)
    return
  }

  guardando.value = true
  feedback.value = { type: 'js', text: 'JavaScript: fetch("/api/notas", { method: "POST" })' }

  await new Promise((r) => setTimeout(r, 450))

  feedback.value = { type: 'server', text: 'Servidor: INSERT INTO notas...' }
  await new Promise((r) => setTimeout(r, 350))

  notaId += 1
  ultimaNotaId.value = notaId
  notas.value = [t, ...notas.value]
  titulo.value = ''
  guardando.value = false
  feedback.value = { type: 'success', text: `✓ Nota guardada: "${t}"` }

  setTimeout(() => {
    ultimaNotaId.value = null
    if (feedback.value?.type === 'success') feedback.value = null
  }, 2800)
}

function onBtnDown() {
  btnPressed.value = true
}

function onBtnUp() {
  btnPressed.value = false
}

function eliminarNota(index) {
  notas.value = notas.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="web-preview-wrap" :class="{ compact }">
    <div class="web-preview-chrome">
      <span class="chrome-dot red" />
      <span class="chrome-dot yellow" />
      <span class="chrome-dot green" />
      <span class="chrome-url">localhost:5173/mis-notas</span>
    </div>

    <div class="web-preview-page" :class="'highlight-' + activeLayer">
      <p v-if="activeLayer === 'preview'" class="demo-hint">Prueba a escribir una nota y pulsar Guardar</p>

      <h1 class="pv-html" :class="{ 'layer-glow': activeLayer === 'html' }">Mis notas</h1>

      <div class="pv-form pv-html">
        <input
          v-model="titulo"
          type="text"
          class="pv-input"
          :class="{ 'layer-glow': activeLayer === 'html', 'input-shake': inputError, 'input-focus-demo': activeLayer === 'html' }"
          placeholder="Título de la nota"
          :disabled="guardando"
          @keyup.enter="guardar"
        >
        <button
          type="button"
          class="pv-btn pv-html pv-js"
          :class="{
            'layer-glow': activeLayer === 'html' || activeLayer === 'javascript',
            pressed: btnPressed,
            loading: guardando,
          }"
          :disabled="guardando"
          @mousedown="onBtnDown"
          @mouseup="onBtnUp"
          @mouseleave="onBtnUp"
          @click="guardar"
        >
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>

      <ul class="pv-list pv-html" :class="{ 'layer-glow': activeLayer === 'html' }">
        <li
          v-for="(nota, i) in notas"
          :key="nota + i"
          class="pv-list-item"
          :class="{ 'nota-nueva': ultimaNotaId && i === 0 }"
        >
          <span>{{ nota }}</span>
          <button
            type="button"
            class="pv-delete"
            title="Eliminar nota"
            @click="eliminarNota(i)"
          >
            ×
          </button>
        </li>
      </ul>

      <div
        v-if="feedback"
        class="demo-feedback"
        :class="'feedback-' + feedback.type"
      >
        {{ feedback.text }}
      </div>

      <div v-if="activeLayer === 'css' && !feedback" class="layer-callout layer-callout-css">
        CSS define el cursor del botón, el hover azul oscuro y el borde del input al enfocar
      </div>
      <div v-if="activeLayer === 'javascript' && !guardando && !feedback" class="layer-callout layer-callout-js">
        <span>Al pulsar Guardar, JavaScript lee el input y llama al servidor</span>
        <code>fetch("/api/notas", { method: "POST", body: JSON.stringify({ titulo }) })</code>
      </div>
      <div v-if="activeLayer === 'servidor' && !guardando && !feedback" class="layer-callout layer-callout-srv">
        <div class="srv-box">
          <strong>Servidor (Python + FastAPI)</strong>
          <span>POST /api/notas</span>
          <span>INSERT INTO notas (titulo, contenido) VALUES (...)</span>
          <span class="srv-ok">Responde: { "id": 3, "titulo": "..." }</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.web-preview-wrap {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: white;
  box-shadow: var(--shadow-sm);
}

.web-preview-chrome {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.65rem;
  background: #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
}

.chrome-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.chrome-dot.red { background: #ef4444; }
.chrome-dot.yellow { background: #eab308; }
.chrome-dot.green { background: #22c55e; }

.chrome-url {
  flex: 1;
  margin-left: 0.35rem;
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: #64748b;
  background: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.web-preview-page {
  padding: 1.25rem;
  background: #f8fafc;
  min-height: 200px;
  position: relative;
}

.web-preview-page.compact {
  min-height: 180px;
}

.demo-hint {
  font-size: 0.78rem;
  color: #64748b;
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  margin: 0 0 0.75rem;
}

.web-preview-page h1 {
  color: #2563eb;
  font-size: 1.35rem;
  margin: 0 0 0.85rem;
  font-weight: 700;
}

.pv-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}

.pv-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: text;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.pv-input:hover {
  border-color: #cbd5e1;
}

.pv-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.pv-input:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.pv-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.12s, transform 0.1s, box-shadow 0.12s;
  white-space: nowrap;
}

.pv-btn:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
}

.pv-btn:active:not(:disabled),
.pv-btn.pressed:not(:disabled) {
  background: #1e40af;
  transform: scale(0.97);
  box-shadow: none;
}

.pv-btn:disabled {
  cursor: wait;
  opacity: 0.85;
}

.pv-btn.loading {
  cursor: wait;
}

.pv-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pv-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.55rem 0.55rem 0.55rem 0.8rem;
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
  transition: border-color 0.12s, background 0.12s;
}

.pv-list-item:hover {
  border-color: #bfdbfe;
  background: #f8fafc;
}

.pv-list-item.nota-nueva {
  animation: notaEntra 0.45s ease;
  border-color: #86efac;
  background: #f0fdf4;
}

@keyframes notaEntra {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.pv-delete {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: none;
  transition: color 0.12s, background 0.12s;
}

.pv-delete:hover {
  color: #dc2626;
  background: #fee2e2;
}

.input-shake {
  animation: shake 0.45s ease;
  border-color: #f87171 !important;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.demo-feedback {
  margin-top: 0.75rem;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.4;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.feedback-error {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #b91c1c;
}

.feedback-js {
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #166534;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.feedback-server {
  background: #ede9fe;
  border: 1px solid #c4b5fd;
  color: #5b21b6;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.feedback-success {
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #15803d;
}

.layer-glow {
  outline: 2px dashed;
  outline-offset: 3px;
}

.highlight-html .layer-glow { outline-color: #f472b6; }

.highlight-css .pv-btn,
.highlight-css h1,
.highlight-css .pv-input,
.highlight-css .pv-list-item {
  box-shadow: 0 0 0 2px #60a5fa;
}

.highlight-javascript .pv-btn.layer-glow:not(:disabled) {
  outline-color: #4ade80;
}

.layer-callout {
  margin-top: 0.85rem;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  line-height: 1.45;
}

.layer-callout-css {
  background: #dbeafe;
  border: 1px solid #93c5fd;
  color: #1e40af;
}

.layer-callout-js {
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #166534;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.layer-callout-js code {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  background: rgba(0, 0, 0, 0.06);
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  word-break: break-all;
}

.layer-callout-srv {
  background: #ede9fe;
  border: 1px solid #c4b5fd;
}

.srv-box {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.78rem;
  color: #5b21b6;
}

.srv-box strong {
  font-size: 0.85rem;
}

.srv-ok {
  color: #15803d;
  font-weight: 600;
}
</style>
