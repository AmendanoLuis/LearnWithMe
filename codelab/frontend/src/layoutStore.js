import { reactive, watch } from 'vue'

const KEYS = {
  sidebar: 'codelab-layout-sidebar',
  inspector: 'codelab-layout-inspector',
  playground: 'codelab-layout-playground-split',
}

function loadInt(key, fallback) {
  const n = parseInt(localStorage.getItem(key), 10)
  return Number.isFinite(n) ? n : fallback
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

export const layoutState = reactive({
  sidebarWidth: loadInt(KEYS.sidebar, 260),
  inspectorHeight: loadInt(KEYS.inspector, 260),
  playgroundSplit: loadInt(KEYS.playground, 50),
  resizing: null,
})

watch(
  () => layoutState.sidebarWidth,
  (v) => localStorage.setItem(KEYS.sidebar, String(v))
)
watch(
  () => layoutState.inspectorHeight,
  (v) => localStorage.setItem(KEYS.inspector, String(v))
)
watch(
  () => layoutState.playgroundSplit,
  (v) => localStorage.setItem(KEYS.playground, String(v))
)

function endResize() {
  layoutState.resizing = null
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.body.classList.remove('is-resizing')
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

let activeType = null
let startX = 0
let startY = 0
let startSidebar = 0
let startInspector = 0
let startSplit = 0
let playgroundRect = null

function onMouseMove(e) {
  if (activeType === 'sidebar') {
    layoutState.sidebarWidth = clamp(startSidebar + (e.clientX - startX), 200, 420)
  } else if (activeType === 'inspector') {
    const maxH = Math.floor(window.innerHeight * 0.72)
    layoutState.inspectorHeight = clamp(startInspector + (startY - e.clientY), 120, maxH)
  } else if (activeType === 'playground' && playgroundRect) {
    const ratio = ((e.clientX - playgroundRect.left) / playgroundRect.width) * 100
    layoutState.playgroundSplit = clamp(ratio, 28, 72)
  }
}

function onMouseUp() {
  endResize()
}

export function beginResize(type, event, containerEl = null) {
  event.preventDefault()
  activeType = type
  layoutState.resizing = type
  startX = event.clientX
  startY = event.clientY
  startSidebar = layoutState.sidebarWidth
  startInspector = layoutState.inspectorHeight
  startSplit = layoutState.playgroundSplit
  playgroundRect = containerEl?.getBoundingClientRect() ?? null

  const cursor = type === 'sidebar' || type === 'playground' ? 'col-resize' : 'row-resize'
  document.body.classList.add('is-resizing')
  document.body.style.cursor = cursor
  document.body.style.userSelect = 'none'

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
