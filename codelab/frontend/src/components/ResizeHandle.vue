<script setup>
defineProps({
  axis: {
    type: String,
    default: 'horizontal', // horizontal = divide left/right | vertical = divide top/bottom
  },
  label: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['resize-start'])

function onMouseDown(e) {
  emit('resize-start', e)
}
</script>

<template>
  <div
    class="resize-handle"
    :class="'resize-' + axis"
    role="separator"
    :aria-orientation="axis === 'horizontal' ? 'vertical' : 'horizontal'"
    :aria-label="label || 'Redimensionar panel'"
    :title="label || 'Arrastra para cambiar el tamaño'"
    @mousedown="onMouseDown"
  >
    <span class="resize-handle-grip" aria-hidden="true" />
  </div>
</template>
