<template>
  {{ latlng }}
  <button type="button" class="btn btn-primary">เพิ่มเเบบปักหมุดอัตโนมัติ</button>
  <button type="button" class="btn btn-primary">เพิ่มเเบบกรอก latlng</button>
  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
    เพิ่มเเบบเลือกเอง
  </button>

  <button type="button" class="btn btn-primary">แก้ไข</button>

  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">name</th>
        <th scope="col">lat</th>
        <th scope="col">long</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(gps, index) in dataGps" :key="index" @click="setData(gps)">
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ gps.locationName }}</td>
        <td>{{ gps.locationLat }}</td>
        <td>{{ gps.locationLng }}</td>
      </tr>
    </tbody>
  </table>
  <GoogleMapView :gg-data="{ name, latlng }" :name="name" :latlng="latlng!" />

  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">lat lng</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import GoogleMapView from '@/components/googlemap/GoogleMapView.vue'
import { computed, ref } from 'vue'
import { onMounted } from 'vue'
const name = ref('')
const latlng = ref<{ lat: number; lng: number }>({ lat: 1, lng: 1 })
const _dataGps = ref()
const dataGps = computed(() => _dataGps.value)
function setData(data: any) {
  name.value = data.locationName
  latlng.value.lat = data.locationLat
  latlng.value.lng = data.locationLng
}
onMounted(() => {
  fetch('https://localhost:7077/gps/getAllGps', { method: 'GET' })
    .then((e) => e.json())
    .then((data) => (_dataGps.value = data))
})
</script>
