<script setup>
import { ref, computed, watch } from 'vue'
import LessonSidebar from './components/LessonSidebar.vue'
import NetworkInspector from './components/NetworkInspector.vue'
import { inspectorState, toggleModoCurioso, setActiveLesson } from './inspectorStore.js'
import { layoutState, beginResize } from './layoutStore.js'
import ResizeHandle from './components/ResizeHandle.vue'

import L0_ComoFuncionaWeb from './components/lessons/L0_ComoFuncionaWeb.vue'
import L1_Variables from './components/lessons/L1_Variables.vue'
import L2_TiposDatos from './components/lessons/L2_TiposDatos.vue'
import L6_Operaciones from './components/lessons/L6_Operaciones.vue'
import L4_Condicionales from './components/lessons/L4_Condicionales.vue'
import L5_Bucles from './components/lessons/L5_Bucles.vue'
import L4_Funciones from './components/lessons/L4_Funciones.vue'
import L2_Arrays from './components/lessons/L2_Arrays.vue'
import L3_Objetos from './components/lessons/L3_Objetos.vue'
import L6_Juego from './components/lessons/L6_Juego.vue'
import L7_Notas from './components/lessons/L7_Notas.vue'
import L8_Productos from './components/lessons/L8_Productos.vue'

const lessonGroups = [
  {
    label: 'Aprende',
    lessons: [
      { id: 'l0', num: 1, title: 'Cómo funciona una web', component: L0_ComoFuncionaWeb, phase: 'Aprende' },
      { id: 'l1', num: 2, title: 'Variables', component: L1_Variables, phase: 'Aprende' },
      { id: 'l2', num: 3, title: 'Tipos de datos', component: L2_TiposDatos, phase: 'Aprende' },
      { id: 'l3', num: 4, title: 'Operadores', component: L6_Operaciones, phase: 'Aprende' },
      { id: 'l4', num: 5, title: 'Condicionales (if)', component: L4_Condicionales, phase: 'Aprende' },
      { id: 'l5', num: 6, title: 'Bucles (for, while)', component: L5_Bucles, phase: 'Aprende' },
      { id: 'l6', num: 7, title: 'Funciones', component: L4_Funciones, phase: 'Aprende' },
      { id: 'l7', num: 8, title: 'Arrays / Listas', component: L2_Arrays, phase: 'Aprende' },
      { id: 'l8', num: 9, title: 'Objetos', component: L3_Objetos, phase: 'Aprende' },
    ],
  },
  {
    label: 'Proyectos simples',
    lessons: [
      { id: 'l9', num: 10, title: 'El juego', component: L6_Juego, phase: 'Proyecto' },
      { id: 'l10', num: 11, title: 'Mis notas', component: L7_Notas, phase: 'Proyecto' },
      { id: 'l11', num: 12, title: 'Productos', component: L8_Productos, phase: 'Proyecto', optional: true },
    ],
  },
]

const allLessons = lessonGroups.flatMap((g) => g.lessons)
const totalSteps = allLessons.length
const activeLesson = ref('l0')

watch(activeLesson, (id) => setActiveLesson(id), { immediate: true })

const currentLesson = computed(() => allLessons.find((l) => l.id === activeLesson.value))
const currentComponent = computed(() => currentLesson.value?.component ?? null)
const currentStep = computed(() => currentLesson.value?.num ?? 1)
const progressPercent = computed(() => (currentStep.value / totalSteps) * 100)
const showNetwork = computed(() => inspectorState.modoCurioso === true)
</script>

<template>
  <div class="app-layout" :class="{ 'is-resizing-layout': layoutState.resizing }">
    <div class="sidebar-shell" :style="{ width: layoutState.sidebarWidth + 'px' }">
      <LessonSidebar
        :groups="lessonGroups"
        :active-lesson="activeLesson"
        :modo-curioso="inspectorState.modoCurioso"
        @select="activeLesson = $event"
        @toggle-modo-curioso="toggleModoCurioso"
      />
      <ResizeHandle
        axis="horizontal"
        label="Redimensionar menú lateral"
        @resize-start="beginResize('sidebar', $event)"
      />
    </div>
    <div class="main-area">
      <header class="lesson-topbar">
        <div class="progress-info">
          <span class="progress-phase">{{ currentLesson?.phase }}</span>
          <span class="progress-step">Paso {{ currentStep }} de {{ totalSteps }}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
        </div>
      </header>
      <div class="lesson-panel">
        <component :is="currentComponent" />
      </div>
      <NetworkInspector v-if="showNetwork" />
    </div>
  </div>
</template>
