<template>
  googlemap view only <br />
  <br />
  <BaseGoogleMap :is-view="true" :data-g-g-map="data" />
</template>
<script setup lang="ts">
import BaseGoogleMap from './BaseGoogleMap.vue'
import { ref } from 'vue'
const props = defineProps<{
  ggData?: { name: string; latlng: { lat: number; lng: number } }
}>()
const data = ref(props.ggData)
const emits = defineEmits<{
  (e: 'update:ggData', value: { name: string; latlng: { lat: number; lng: number } }): void
}>()
function updateParent(data: { name: string; latlng: { lat: number; lng: number } }) {
  emits('update:ggData', data)
}
</script>
