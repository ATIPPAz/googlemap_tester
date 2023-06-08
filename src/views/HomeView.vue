<template>
  <a href="GpsList">ไปหน้าตาราง</a>
  <div style="width: 1600px">
    <div class="flex" style="100%">
      <div style="width: 700px">
        <GoogleMapEdit />
      </div>
      <div style="width: 700px">
        <!-- <GoogleMapView /> -->
      </div>
      <!-- <BaseGoogleMap /> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import GoogleMapEdit from '@/components/googlemap/GoogleMapEdit.vue'
import GoogleMapView from '@/components/googlemap/GoogleMapView.vue'
import BaseGoogleMap from '@/components/googlemap/BaseGoogleMap.vue'
</script>
<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex {
  display: flex;
  /* gap: 20px; */
  justify-content: space-between;
  /* align-items: center; */
}
</style>
