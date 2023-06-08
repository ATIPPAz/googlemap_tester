<template>
  googlemap view only <br />
  <br />
  <div
    style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      row-gap: 30px;
      column-gap: 30px;
    "
  >
    <div>
      <button @click="move = !move" type="button" class="btn btn-primary text-white mb-2">
        {{ move ? 'ไม่ขยับ' : 'ขยับ' }}
      </button>
      <BaseGoogleMap v-if="move" :is-view="true" :data-g-g-map="data" />
      <iframe
        v-show="move"
        width="100%"
        height="100%"
        :src="`http://maps.google.com/maps?q=${props.ggData?.latlng.lat},${props.ggData?.latlng.lng}&z=15&output=embed&language=th`"
      ></iframe>
      <BaseGoogleMap v-show="!move" :is-view="false" :data-g-g-map="data" />
    </div>
    <div>
      embed map search with lat lng {{ props.ggData?.latlng }}
      <iframe
        width="100%"
        height="100%"
        :src="`http://maps.google.com/maps?q=${props.ggData?.latlng.lat},${props.ggData?.latlng.lng}&z=15&output=embed&language=th`"
      ></iframe>
    </div>

    <div>
      search with name clicknext
      <iframe
        width="100%"
        height="100%"
        :src="`http://maps.google.com/maps?q=ClickNext Co.,Ltd.&z=15&output=embed&language=th`"
      ></iframe>
    </div>

    <div>
      search with name : {{ props.ggData?.name }}
      <iframe
        width="100%"
        height="100%"
        :src="`http://maps.google.com/maps?q=${props.ggData?.name}&z=15&output=embed&language=th`"
      ></iframe>
    </div>
    <div>
      embed with key search with name : {{ props.ggData?.name }}
      <iframe
        width="100%"
        height="100%"
        :src="`https://www.google.com/maps/embed/v1/place?key=${key}&q=${props.ggData?.name}&language=th`"
      ></iframe>
    </div>
    <div>
      embed with key search with lat lng : {{ props.ggData?.latlng }}
      <iframe
        width="100%"
        height="100%"
        :src="`https://www.google.com/maps/embed/v1/place?key=${key}&q=${props.ggData?.latlng.lat},${props.ggData?.latlng.lng}&language=th`"
      ></iframe>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseGoogleMap from './BaseGoogleMap.vue'
import { ref } from 'vue'
const props = defineProps<{
  ggData?: { name: string; latlng: { lat: number; lng: number } }
}>()
const move = ref<boolean>(false)
const key = import.meta.env.VITE_GG_MAP_API_KEY
const data = ref(props.ggData)
const emits = defineEmits<{
  (e: 'update:ggData', value: { name: string; latlng: { lat: number; lng: number } }): void
}>()
function updateParent(data: { name: string; latlng: { lat: number; lng: number } }) {
  emits('update:ggData', data)
}
</script>
<style scoped>
iframe {
  border-radius: 10px;
  border: 1px solid black;
}
</style>
