<script setup>
import { ref } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
})

const activeTab = ref(0)

function selectTab(index) {
  activeTab.value = index
}
</script>

<template>
  <div class="lesson-tabs">
    <div class="tab-bar">
      <button
        v-for="(tab, i) in tabs"
        :key="tab"
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === i }"
        @click="selectTab(i)"
      >
        {{ tab }}
      </button>
    </div>
    <div class="tab-content">
      <div v-show="activeTab === 0">
        <slot name="tab0" />
      </div>
      <div v-show="activeTab === 1">
        <slot name="tab1" />
      </div>
    </div>
  </div>
</template>
