<template>
  <div>
    {{ placeSearch }}
    <input class="form-control" id="pac-input" v-model="placeSearch" @change="a" />
    dynamic map
    {{ props.dataGGMap }} | lat:{{ lat }} lng:{{ lng }} name:{{ name }} <br />
    <div
      ref="map"
      id="map"
      style="height: 100%; border-radius: 20px; height: 200px; border: 1px solid black"
    ></div>
    <button type="button" class="btn btn-success" @click="saveLocation">save</button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
const placeSearch = ref('')
interface PropsOption {
  // dragable: boolean
}
function a() {
  console.log(mapMain.value)
}
function updateLocation(e: any) {
  console.log(e)
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
const markerMain = ref()
const mapMain = ref()
let getPostitionSuccess: any = null
const emits = defineEmits<{
  (e: 'update:dataGGmap', value: { name: string; latlng: { lat: number; lng: number } }): void
}>()
function saveLocation() {
  const dec = new google.maps.Geocoder()
  const latlng = { lat: lat.value, lng: lng.value }
  dec.geocode({ location: latlng }, async (res: any, status) => {
    console.log(res)
    name.value = await res[0].formatted_address
  })
}
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
async function setup2() {
  const { Autocomplete } = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary
  // Create the input HTML element, and append it.
  // const input = document.createElement('input')
  const input = document.getElementById('pac-input') as HTMLInputElement
  const center = { lat: 50.064192, lng: -130.605469 }
  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1
  }
  const options = {
    bounds: defaultBounds,
    componentRestrictions: { country: 'th' },
    fields: ['address_components', 'geometry', 'icon', 'name'],
    strictBounds: false,
    types: ['establishment']
  }
  const a = new Autocomplete(input, options)
  a.addListener('place_changed', () => {
    const location = a.getPlace().geometry?.location
    const latlng = { lat: location?.lat(), lng: location?.lng() }
    markerMain.value.setPosition(latlng)
    markerMain.value.setTitle(a.getPlace().name)
    lat.value = latlng.lat
    lng.value = latlng.lng
    mapMain.value.setCenter(latlng)
  })
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
    keyboardShortcuts: false,
    gestureHandling: 'greedy'
  }
  const maps = new Map(map.value, mapOptions)
  const markerOptions = {
    position: latlng,
    draggable: !props.isView,
    map: maps,
    title: name.value
  }

  const marker = await new google.maps.Marker(markerOptions)
  markerMain.value = marker
  maps.addListener('click', (e: any) => {
    marker.setPosition(e.latLng)
    lat.value = e.latLng.lat()

    lng.value = e.latLng.lng()
    // maps.setOptions({ gestureHandling: 'none' })
    // maps.setOptions({ gestureHandling: 'greedy' })
  })
  // sendData(name.value, lat.value, lng.value)
  mapMain.value = maps
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
  await setup2()
}
const map = ref()
onMounted(() => {
  const loader = new Loader({
    apiKey: apiKey,
    language: 'th'
  })
  loader.load().then(async () => {
    init()
  })
})
</script>
