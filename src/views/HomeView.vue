<template>
  logging in vue <br />
  build name = {{ a.name }} <br />
  LAT = {{ a.lat }} <br />
  LNG = {{ a.lng }}<br />
  <iframe :srcdoc="html" frameborder="0" width="700px" height="600px"></iframe>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <script type="module" src='src/google-map/index.js'><\/script>
</head>
<body>
  SDASDSDS
  <div id="map" style="height: 400px"></div>
  สถานที่: <p id="buildingName"></p>
  <div>
    latitude:<p id="lat"></p>
    longitude:<p id="lng"></p>
  </div>
</body>
</html>`
const data = ref<any>('ttest')
function getData(e: any) {
  data.value = e.data
  console.log(data.value)
}
const a = computed(() => data.value || {})
onMounted(() => {
  window.addEventListener('message', getData)
})
onUnmounted(() => {
  window.removeEventListener('message', getData)
})
</script>
