<template>
  lat:{{ lat }} <br />
  lng:{{ lng }} <br />
  name:{{ name }} <br />
  {{ props.dataGGMap }}
  <div
    ref="map"
    id="map"
    style="height: 500px; border-radius: 20px; height: 350px; border: 1px solid black"
  ></div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
interface PropsOption {
  // dragable: boolean
}

const props = defineProps<{
  isView: boolean
  dataGGMap?: { name: string; latlng: { lat: number; lng: number } }
}>()

const apiKey = import.meta.env.VITE_GG_MAP_API_KEY
// const apiPath = import.meta.env.VITE_GG_MAP_PATH
const lat = ref()
const lng = ref()
const name = ref()
let getPostitionSuccess: any = null
const emits = defineEmits<{
  (e: 'update:dataGGmap', value: { name: string; latlng: { lat: number; lng: number } }): void
}>()

function successLoadLocation(position: any) {
  console.log(props.isView && props.dataGGMap)

  if (props.isView && props.dataGGMap) {
    lat.value = props.dataGGMap.latlng.lat
    lng.value = props.dataGGMap.latlng.lng
  } else {
    lat.value = position.coords.latitude
    lng.value = position.coords.longitude
  }

  getPostitionSuccess()
}
function errorLoadLocation() {}
function awaitGetPosition() {
  navigator.geolocation.getCurrentPosition(successLoadLocation, errorLoadLocation)
  return new Promise((resolve) => {
    getPostitionSuccess = resolve
  })
}
watch(
  () => props.dataGGMap,
  () => {
    init()
  },
  { deep: true }
)
function sendData(name: string, lat: number, lng: number) {
  emits('update:dataGGmap', { name, latlng: { lat, lng } })
}
async function setupMap() {
  // const location = await new google.maps.LatLng({ lat: lat.value, lng: lng.value })

  const dec = new google.maps.Geocoder()
  const latlng = { lat: lat.value, lng: lng.value }
  await dec.geocode({ location: latlng }, async (res: any, status) => {
    console.log(res)
    name.value =
      props.isView && props.dataGGMap ? props.dataGGMap.name : await res[0].formatted_address
  })
  const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary
  const mapOptions: google.maps.MapOptions = {
    center: latlng,
    zoom: 12,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    keyboardShortcuts: false
  }
  const maps = new Map(map.value, mapOptions)
  const markerOptions = {
    position: latlng,
    draggable: !props.isView,
    map: maps,
    title: name.value
  }
  // sendData(name.value, lat.value, lng.value)
  const marker = await new google.maps.Marker(markerOptions)
  marker.addListener('dragend', (e: any) => {
    const position = marker.getPosition()!
    lat.value = position.lat()
    lng.value = position.lng()
    const dec = new google.maps.Geocoder()
    dec.geocode({ location: position }, (res: any, status) => {
      name.value = res[0].formatted_address
      marker.setTitle(name.value)
      // sendData(name.value, lat.value, lng.value)
    })
  })
}
async function init() {
  await awaitGetPosition()
  await setupMap()
}
const map = ref()
onMounted(() => {
  const loader = new Loader({
    apiKey: apiKey
  })
  loader.load().then(async () => {
    init()
  })
})
</script>
