<script setup>
import { ref, computed } from 'vue'
import ResizeHandle from './ResizeHandle.vue'
import {
  inspectorState,
  toggleExpanded,
  clearRequests,
  toggleVistaAvanzada,
  setNetworkTab,
} from '../inspectorStore.js'
import { layoutState, beginResize } from '../layoutStore.js'

const collapsed = ref(false)

const filteredRequests = computed(() => {
  if (inspectorState.networkTab === 'all') return inspectorState.requests
  return inspectorState.requests.filter(
    (r) => r.lessonId === inspectorState.activeLessonId
  )
})

const expandedRequest = computed(() =>
  filteredRequests.value.find((r) => r.id === inspectorState.expandedId)
  ?? inspectorState.requests.find((r) => r.id === inspectorState.expandedId)
  ?? null
)

const lessonCount = computed(() =>
  inspectorState.requests.filter((r) => r.lessonId === inspectorState.activeLessonId).length
)

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}

function formatJson(obj) {
  if (obj === null || obj === undefined) return '—'
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj)
  }
}

/** Muestra el payload con saltos de línea reales (JSON.stringify escapa \\n como texto). */
function formatPayload(payload) {
  if (payload === null || payload === undefined) return '—'
  if (typeof payload === 'string') return payload
  if (typeof payload !== 'object') return String(payload)

  const entries = Object.entries(payload)
  if (entries.length === 1) {
    const [key, value] = entries[0]
    if (typeof value === 'string' && (key === 'codigo' || value.includes('\n'))) {
      return value
    }
  }

  const blocks = []
  for (const [key, value] of entries) {
    if (typeof value === 'string' && (key === 'codigo' || value.includes('\n'))) {
      blocks.push(`${key}:\n${value}`)
    } else if (typeof value === 'object' && value !== null) {
      blocks.push(`${key}:\n${formatJson(value)}`)
    } else {
      blocks.push(`${key}: ${JSON.stringify(value)}`)
    }
  }
  return blocks.join('\n\n')
}

function formatRequestPayload(payload) {
  if (payload === null || payload === undefined) return '—'
  if (typeof payload === 'string') return payload
  if (typeof payload === 'object' && ('codigo' in payload || Object.values(payload).some(
    (v) => typeof v === 'string' && v.includes('\n')
  ))) {
    return formatPayload(payload)
  }
  return formatJson(payload)
}

function statusClass(status) {
  if (status >= 200 && status < 300) return 'status-ok'
  if (status === 422 || status === 400) return 'status-client-error'
  if (status >= 400) return 'status-error'
  return 'status-error'
}

function cleanResponse(data) {
  if (!data || typeof data !== 'object') return data
  const { _sql_log, ...rest } = data
  if (Array.isArray(rest.items)) return rest.items
  return rest
}

function statusLabel(status) {
  if (!status) return '—'
  if (status >= 200 && status < 300) return `${status} OK`
  return String(status)
}

function simpleLabel(req) {
  if (req.label) return req.label
  if (req.source === 'navegador') return 'Actividad en el navegador'
  if (req.payload) return 'Guardaste algo'
  return 'Pediste datos'
}

function selectRow(id) {
  toggleExpanded(id)
}
</script>

<template>
  <div
    class="inspector"
    :class="{ 'is-collapsed': collapsed }"
    :style="!collapsed ? { height: layoutState.inspectorHeight + 'px' } : undefined"
  >
    <ResizeHandle
      v-if="!collapsed"
      axis="vertical"
      label="Redimensionar panel Network"
      @resize-start="beginResize('inspector', $event)"
    />
    <div class="inspector-header">
      <button type="button" class="inspector-header-toggle" @click="toggleCollapsed">
        <span class="inspector-chevron" :class="{ collapsed }">▼</span>
        <span>Network</span>
      </button>
      <div class="inspector-actions">
        <button
          v-if="!collapsed"
          type="button"
          class="secondary"
          style="font-size:0.75rem;padding:0.25rem 0.6rem"
          @click="toggleVistaAvanzada"
        >
          {{ inspectorState.vistaAvanzada ? 'Vista simple' : 'Más detalle' }}
        </button>
        <button
          v-if="!collapsed"
          type="button"
          class="secondary"
          style="font-size:0.75rem;padding:0.25rem 0.6rem"
          @click="clearRequests"
        >
          Limpiar
        </button>
        <button type="button" class="secondary inspector-toggle-btn" @click="toggleCollapsed">
          {{ collapsed ? '▲' : '▼' }}
        </button>
      </div>
    </div>

    <div v-if="!collapsed" class="network-tabs">
      <button
        type="button"
        class="network-tab"
        :class="{ active: inspectorState.networkTab === 'lesson' }"
        @click="setNetworkTab('lesson')"
      >
        Esta lección
        <span v-if="lessonCount" class="network-tab-count">{{ lessonCount }}</span>
      </button>
      <button
        type="button"
        class="network-tab"
        :class="{ active: inspectorState.networkTab === 'all' }"
        @click="setNetworkTab('all')"
      >
        Todas
        <span v-if="inspectorState.requests.length" class="network-tab-count">{{ inspectorState.requests.length }}</span>
      </button>
    </div>

    <div v-if="!collapsed" class="inspector-body">
      <div v-if="filteredRequests.length === 0" class="inspector-empty">
        <template v-if="inspectorState.networkTab === 'lesson'">
          Pulsa <strong>Probar actividad</strong> en la lección de arriba.
          Lo que ocurra aparecerá aquí.
        </template>
        <template v-else>
          Aún no hay peticiones. Prueba las actividades de cada lección.
        </template>
      </div>

      <template v-else>
        <div class="network-list">
          <table class="network-table">
            <thead>
              <tr>
                <th v-if="inspectorState.vistaAvanzada">Método</th>
                <th>{{ inspectorState.vistaAvanzada ? 'URL' : 'Qué pasó' }}</th>
                <th>Estado</th>
                <th>Tiempo</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="req in filteredRequests"
                :key="req.id"
                class="network-row"
                :class="{ expanded: inspectorState.expandedId === req.id }"
                @click="selectRow(req.id)"
              >
                <td v-if="inspectorState.vistaAvanzada">
                  <span :class="['method-badge', `method-${req.method}`]">{{ req.method }}</span>
                </td>
                <td class="network-url">
                  {{ inspectorState.vistaAvanzada ? req.url : simpleLabel(req) }}
                </td>
                <td>
                  <span v-if="req.status" :class="['status-badge', statusClass(req.status)]">
                    {{ inspectorState.vistaAvanzada ? statusLabel(req.status) : (req.source === 'navegador' ? '◉ Local' : (req.status >= 200 && req.status < 300 ? '✓ OK' : '✗ Error')) }}
                  </span>
                  <span v-else class="status-badge status-error">Error</span>
                </td>
                <td class="network-duration">{{ req.duration }}ms</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="expandedRequest" class="network-detail-panel">
          <div class="network-detail-toolbar">
            <span class="network-detail-title">Detalle</span>
            <span v-if="inspectorState.vistaAvanzada" class="network-detail-meta">
              <span :class="['method-badge', `method-${expandedRequest.method}`]">{{ expandedRequest.method }}</span>
              <span class="network-detail-url">{{ expandedRequest.url }}</span>
            </span>
          </div>

          <div class="network-detail-panels">
            <div v-if="expandedRequest.payload" class="network-panel">
              <div class="network-panel-label">
                {{ expandedRequest.source === 'navegador' ? 'Lo que hiciste' : 'Request' }}
              </div>
              <pre class="network-panel-code network-panel-code--source">{{ formatRequestPayload(expandedRequest.payload) }}</pre>
            </div>
            <div class="network-panel">
              <div class="network-panel-label">
                {{ expandedRequest.source === 'navegador' ? 'Resultado' : 'Response' }}
              </div>
              <pre class="network-panel-code">{{ formatJson(inspectorState.vistaAvanzada ? expandedRequest.response : cleanResponse(expandedRequest.response)) }}</pre>
            </div>
          </div>

          <template v-if="inspectorState.vistaAvanzada">
            <div v-if="expandedRequest.schemaInfo" class="network-extra-panel">
              <div class="network-panel-label">Validación</div>
              <pre class="network-panel-code network-panel-error">{{ formatJson(expandedRequest.schemaInfo) }}</pre>
            </div>
            <div v-if="expandedRequest.sqlLog && expandedRequest.sqlLog.length" class="network-extra-panel">
              <div class="network-panel-label">SQL ejecutado</div>
              <pre
                v-for="(q, i) in expandedRequest.sqlLog"
                :key="i"
                class="network-panel-code"
              >{{ q.sql }}</pre>
            </div>
          </template>

          <div v-if="expandedRequest.error" class="network-extra-panel">
            <div class="network-panel-label">Error</div>
            <pre class="network-panel-code network-panel-error">{{ expandedRequest.error }}</pre>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
