import { reactive, watch } from 'vue'

const STORAGE_KEY = 'codelab-inspector-requests'

function loadRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveRequests(requests) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  } catch {
    /* ignore quota errors */
  }
}

const saved = loadRequests()
let counter = saved.reduce((max, r) => Math.max(max, r.id || 0), 0)

export const inspectorState = reactive({
  requests: saved,
  expandedId: null,
  modoCurioso: false,
  vistaAvanzada: false,
  activeLessonId: 'l0',
  networkTab: 'lesson',
})

watch(
  () => inspectorState.requests,
  (requests) => saveRequests(requests),
  { deep: true }
)

export function setActiveLesson(id) {
  inspectorState.activeLessonId = id
  inspectorState.expandedId = null
}

export function setNetworkTab(tab) {
  inspectorState.networkTab = tab
}

export function addRequest(entry) {
  if (!inspectorState.modoCurioso) return
  const id = ++counter
  inspectorState.requests.unshift({
    id,
    timestamp: new Date().toLocaleTimeString('es-ES'),
    lessonId: inspectorState.activeLessonId,
    ...entry,
  })
  inspectorState.expandedId = id
  inspectorState.networkTab = 'lesson'
  if (inspectorState.requests.length > 50) {
    inspectorState.requests.pop()
  }
}

export function addLocalActivity({ titulo, enviaste, respondio }) {
  addRequest({
    source: 'navegador',
    method: 'LOCAL',
    url: 'JavaScript en el navegador',
    label: titulo,
    payload: enviaste,
    response: respondio,
    status: 200,
    statusLabel: 'Solo en el navegador',
    duration: 0,
  })
}

export function toggleExpanded(id) {
  inspectorState.expandedId = inspectorState.expandedId === id ? null : id
}

export function clearRequests() {
  inspectorState.requests = []
  inspectorState.expandedId = null
  saveRequests([])
}

export function toggleModoCurioso() {
  inspectorState.modoCurioso = !inspectorState.modoCurioso
  if (!inspectorState.modoCurioso) {
    inspectorState.expandedId = null
  }
}

export function toggleVistaAvanzada() {
  inspectorState.vistaAvanzada = !inspectorState.vistaAvanzada
}
