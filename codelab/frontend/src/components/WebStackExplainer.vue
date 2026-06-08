<script setup>
import { ref, computed } from 'vue'
import DemoNotasPreview from './DemoNotasPreview.vue'

const props = defineProps({
  highlight: {
    type: String,
    default: 'javascript',
  },
})

const WEB_STACK_KEY = 'codelab-web-stack-expanded'

function loadExpanded() {
  const saved = localStorage.getItem(WEB_STACK_KEY)
  if (saved === null) return false
  return saved === 'true'
}

const expanded = ref(loadExpanded())
const activeView = ref('preview')

const layers = [
  {
    id: 'html',
    label: 'HTML',
    filename: 'index.html',
    role: 'Estructura',
    desc: 'Define qué hay en la página: títulos, botones, campos. Es el esqueleto.',
    code: `<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Mis notas</title>
    <link rel="stylesheet" href="estilos.css">
  </head>
  <body>
    <div class="app">
      <h1>Mis notas</h1>

      <div class="formulario">
        <input type="text" placeholder="Título de la nota">
        <button id="btn-guardar">Guardar</button>
      </div>

      <ul id="lista-notas">
        <li>Comprar pan</li>
        <li>Estudiar JavaScript</li>
      </ul>
    </div>

    <script src="app.js"><\/script>
  </body>
</html>`,
    lang: 'html',
    cardClass: 'card-html',
    tabClass: 'tab-html',
  },
  {
    id: 'css',
    label: 'CSS',
    filename: 'estilos.css',
    role: 'Estilo',
    desc: 'Define cómo se ve: colores, tamaños, espacios. El botón cambia al pasar el ratón.',
    code: `/* estilos.css */
body {
  font-family: system-ui, sans-serif;
  background: #f8fafc;
  margin: 0;
  padding: 2rem;
}

h1 {
  color: #2563eb;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.formulario {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: text;
}

input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;       /* ← el ratón cambia aquí */
}

button:hover {
  background: #1d4ed8;   /* ← reacción al pasar el ratón */
}

button:active {
  transform: scale(0.97); /* ← reacción al pulsar */
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.6rem 0.85rem;
  margin-bottom: 0.4rem;
}`,
    lang: 'css',
    cardClass: 'card-css',
    tabClass: 'tab-css',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    filename: 'app.js',
    role: 'Lógica',
    desc: 'Define qué pasa al interactuar: leer el formulario, decidir, llamar al servidor.',
    code: `// app.js
const btn = document.querySelector("#btn-guardar");
const input = document.querySelector("input");
const lista = document.querySelector("#lista-notas");

btn.addEventListener("click", async () => {
  const titulo = input.value.trim();
  if (!titulo) return;

  btn.textContent = "Guardando...";
  btn.disabled = true;

  const respuesta = await fetch("/api/notas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, contenido: "" })
  });

  const nota = await respuesta.json();

  // Añadir la nota a la lista en pantalla
  const li = document.createElement("li");
  li.textContent = nota.titulo;
  lista.prepend(li);

  input.value = "";
  btn.textContent = "Guardar";
  btn.disabled = false;
});`,
    lang: 'javascript',
    cardClass: 'card-js',
    tabClass: 'tab-js',
  },
  {
    id: 'servidor',
    label: 'Servidor',
    filename: 'main.py',
    role: 'Datos',
    desc: 'Guarda información de forma permanente. La página le pide datos y él responde.',
    code: `# main.py — Python + FastAPI
from fastapi import FastAPI

app = FastAPI()

@app.post("/api/notas")
def guardar_nota(nota: dict):
    # Guardar en la base de datos
    db.execute(
        "INSERT INTO notas (titulo, contenido) VALUES (?, ?)",
        (nota["titulo"], nota["contenido"])
    )
    return { "id": 3, "titulo": nota["titulo"] }`,
    lang: 'python',
    cardClass: 'card-servidor',
    tabClass: 'tab-srv',
  },
]

const views = [
  { id: 'preview', label: 'Página completa', tabClass: 'tab-preview' },
  ...layers,
]

const activeLayer = computed(() => layers.find((l) => l.id === activeView.value))
const highlightLabel = computed(() => layers.find((l) => l.id === props.highlight)?.label || 'JavaScript')
const previewLayer = computed(() => (activeView.value === 'preview' ? 'preview' : activeView.value))

function toggle() {
  expanded.value = !expanded.value
  localStorage.setItem(WEB_STACK_KEY, String(expanded.value))
}

function selectView(id) {
  activeView.value = id
}
</script>

<template>
  <div class="web-stack">
    <button type="button" class="web-stack-toggle" @click="toggle">
      <span class="web-stack-toggle-title">Capas de una web</span>
      <span class="web-stack-pipeline-mini">
        <span class="pipe-html">HTML</span>
        <span class="pipe-arrow">→</span>
        <span class="pipe-css">CSS</span>
        <span class="pipe-arrow">→</span>
        <span class="pipe-js">JS</span>
        <span class="pipe-arrow">→</span>
        <span class="pipe-srv">Servidor</span>
      </span>
      <span class="web-stack-chevron">{{ expanded ? '▲' : '▼' }}</span>
    </button>

    <div v-if="expanded" class="web-stack-body">
      <p class="web-stack-intro">
        Esta mini app de <strong>Mis notas</strong> es funcional: escribe, guarda y elimina notas.
        En esta lección trabajas sobre todo con <strong>{{ highlightLabel }}</strong>.
      </p>

      <div class="web-stack-tabs">
        <button
          v-for="view in views"
          :key="view.id"
          type="button"
          class="web-stack-tab"
          :class="[view.tabClass, { active: activeView === view.id, 'is-lesson': view.id === highlight }]"
          @click="selectView(view.id)"
        >
          {{ view.label }}
          <span v-if="view.id === highlight && view.id !== 'preview'" class="tab-lesson-dot" />
        </button>
      </div>

      <div v-if="activeView === 'preview'" class="web-stack-preview-only">
        <DemoNotasPreview :active-layer="previewLayer" />
        <div class="web-stack-legend">
          <div class="legend-item legend-html"><span>HTML</span> estructura: título, input, botón, lista</div>
          <div class="legend-item legend-css"><span>CSS</span> estilo: cursor, hover, colores</div>
          <div class="legend-item legend-js"><span>JS</span> lógica: al pulsar Guardar → fetch al servidor</div>
          <div class="legend-item legend-srv"><span>Servidor</span> datos: guarda la nota en la base de datos</div>
        </div>
      </div>

      <div v-else class="web-stack-split">
        <div class="web-stack-code-panel" :class="activeLayer?.cardClass">
          <div class="web-stack-code-head">
            <div>
              <span class="web-stack-card-label">{{ activeLayer?.label }}</span>
              <span class="stack-role">{{ activeLayer?.role }}</span>
            </div>
            <span v-if="activeView === highlight" class="stack-you-are">Esta lección</span>
          </div>
          <p class="web-stack-desc">{{ activeLayer?.desc }}</p>
          <div class="stack-code-file">
            <span class="stack-code-filename">{{ activeLayer?.filename }}</span>
          </div>
          <pre class="stack-code stack-code-tall" :class="'lang-' + activeLayer?.lang"><code>{{ activeLayer?.code }}</code></pre>
        </div>

        <div class="web-stack-preview-panel">
          <div class="preview-panel-label">Pruébala — es una web de verdad</div>
          <DemoNotasPreview :active-layer="previewLayer" compact />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-lesson-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  margin-left: 0.25rem;
  vertical-align: middle;
}
</style>
