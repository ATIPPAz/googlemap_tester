import { type Plugin, type InjectionKey, ref, watch, reactive, computed } from 'vue'
export type PluginInstance = ReturnType<typeof googlemap>
export const googlemapPluginSymbol: InjectionKey<PluginInstance> = Symbol('googlemap')
import { Loader } from '@googlemaps/js-api-loader'
const apiKey = import.meta.env.VITE_GG_MAP_API_KEY

export function googlemap() {
  function setup(element: HTMLElement) {
    if (!window.google) {
      const loader = new Loader({
        apiKey: apiKey
      })
      loader.load().then(async () => {
        await awaitGetPosition()
        await setupMap(element)
      })
      return
    }
    awaitGetPosition()

    // setupMap()
  }
  const state = reactive({ lat: 0, lng: 0, name: '' })
  let getPostitionSuccess: any = null
  function successLoadLocation(position: any) {
    state.lat = position.coords.latitude
    state.lng = position.coords.longitude
    getPostitionSuccess()
  }
  function errorLoadLocation() {}
  function awaitGetPosition() {
    navigator.geolocation.getCurrentPosition(successLoadLocation, errorLoadLocation)
    return new Promise((resolve) => {
      getPostitionSuccess = resolve
    })
  }
  async function setupMap(map: HTMLElement) {
    const dec = new google.maps.Geocoder()
    const latlng = { lat: state.lat, lng: state.lng }
    await dec.geocode({ location: latlng }, async (res: any) => {
      state.name = await res[0].formatted_address
    })
    const { Map } = await google.maps.importLibrary('maps')
    const mapOptions = { center: latlng, zoom: 12 }
    const maps = new Map(map, mapOptions)
    const markerOptions = {
      position: latlng,
      draggable: true,
      map: maps,
      title: state.name
    }
    const marker = await new google.maps.Marker(markerOptions)
    marker.addListener('dragend', (e: any) => {
      const position = marker.getPosition()!
      state.lat = position.lat()
      state.lng = position.lng()
      const dec = new google.maps.Geocoder()
      dec.geocode({ location: position }, (res: any) => {
        state.name = res[0].formatted_address
        marker.setTitle(state.name)
      })
    })
  }

  return {
    ggMapState: computed(() => state),
    setup
  }
}

const plugin: Plugin = {
  install: (app, options) => {
    const sample = googlemap()
    app.provide(googlemapPluginSymbol, sample)
  }
}
export default plugin
