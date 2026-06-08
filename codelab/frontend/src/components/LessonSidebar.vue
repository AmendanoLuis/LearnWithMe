<script setup>
defineProps({
  groups: Array,
  activeLesson: String,
  modoCurioso: Boolean,
})

const emit = defineEmits(['select', 'toggle-modo-curioso'])
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">CL</div>
      <div>
        <h1>CodeLab</h1>
        <p>Aprende paso a paso</p>
      </div>
    </div>

    <nav class="lesson-nav">
      <div v-for="group in groups" :key="group.label" class="lesson-group">
        <div class="lesson-group-label">{{ group.label }}</div>
        <ul class="lesson-list">
          <li
            v-for="lesson in group.lessons"
            :key="lesson.id"
            class="lesson-item"
            :class="{ active: activeLesson === lesson.id, optional: lesson.optional }"
            @click="emit('select', lesson.id)"
          >
            <span class="lesson-num">{{ lesson.num }}</span>
            <span class="lesson-title-text">{{ lesson.title }}</span>
            <span v-if="lesson.optional" class="lesson-badge">extra</span>
          </li>
        </ul>
      </div>
    </nav>

    <div class="sidebar-footer">
      <button
        type="button"
        class="modo-curioso-btn secondary"
        :class="{ active: modoCurioso }"
        @click="emit('toggle-modo-curioso')"
      >
        {{ modoCurioso ? '✓ Modo curioso activo' : 'Modo curioso' }}
      </button>
      <p class="sidebar-hint">Actívalo para ver el panel Network con las actividades de cada lección</p>
    </div>
  </aside>
</template>
