// สร้างตัวแปรสำหรับเก็บ API Key ของคุณ
var apiKey = 'AIzaSyA1WQxkpdVk5CFKHwMbY93nfOJN3loLja8'
var latlng = { lat: 13.756212, lng: 100.532428 }
// สร้างฟังก์ชันสำหรับโหลดแผนที่
async function loadMap() {
  // สร้าง URL สำหรับเรียกใช้งาน Google Maps JavaScript API
  var script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
  script.defer = true
  script.async = true
  document.head.appendChild(script)
  await navigator.geolocation.getCurrentPosition(successLoadLocation, errorLoadLocation)
  setTimeout(async () => {
    var location = await new google.maps.LatLng(latlng)

    latlng.lat = location.lat()
    latlng.lng = location.lng()
    // ตั้งค่าตำแหน่งเริ่มต้นเป็นตำแหน่งในนิวยอร์ก
    console.log(latlng)
    document.getElementById('lat').textContent = location.lat()
    document.getElementById('lng').textContent = location.lng()
    const dec = new google.maps.Geocoder()
    await dec.geocode({ location: latlng }, async (res, status) => {
      document.getElementById('buildingName').textContent = await res[0].formatted_address
    })
    // สร้างตัวแปรสำหรับตั้งค่าแผนที่
    var mapOptions = {
      center: latlng,
      zoom: 12
    }

    // สร้างแผนที่ใน element ที่มี id เป็น "map"
    var map = await new google.maps.Map(document.getElementById('map'), mapOptions)

    // โหลดข้อมูล JSON จากการเรียกใช้งาน API และแสดงบนแผนที่
    // ตัวอย่างนี้ใช้เป็นตัวอย่างเท่านั้น คุณควรปรับใช้งานตามโครงสร้างของ JSON ที่ได้รับ
    // var jsonData = {
    //   results: [
    //     {
    //       formatted_address: 'phayathai ja',
    //       geometry: {
    //         location: {
    //           // lat: 40.712776,
    //           lat: 13.756212,
    //           // lng: -74.005974,
    //           lng: 100.532428,
    //         },
    //       },
    //     },
    //   ],
    // };

    // สร้างตัวแปรสำหรับตำแหน่งจาก JSON
    // var location = jsonData.results[0].geometry.location;

    // สร้างตัวแปรสำหรับตำแหน่งเครื่องหมายบนแผนที่
    var markerOptions = {
      position: latlng,
      draggable: true,
      map: map,
      title: document.getElementById('buildingName').textContent
    }

    // สร้างเครื่องหมายบนแผนที่
    var marker = await new google.maps.Marker(markerOptions)
    // markerOptions = {
    //   position: { lat: location.lat + 1, lng: location.lng + 1 },
    //   map: map,
    //   title: jsonData.results[0].formatted_address,
    // };
    marker.addListener('dragend', (e) => {
      const position = marker.getPosition()
      const sendData = {}
      document.getElementById('lat').textContent = position.lat()
      document.getElementById('lng').textContent = position.lng()
      sendData.lat = position.lat()
      sendData.lng = position.lng()
      const dec = new google.maps.Geocoder()
      dec.geocode({ location: position }, (res, status) => {
        document.getElementById('buildingName').textContent = res[0].formatted_address
        sendData.Bname = res[0].formatted_address
        // res.forEach((element) => {
        //   element.address_components.forEach((e) => {
        //     console.log('short_name:' + e.short_name);
        //     console.log('long_name:' + e.long_name);
        //   });
        // });
        // console.log(res[0].formatted_address);
        sendParentData(sendData)
      })
    })
  }, 2000)
}
function sendParentData(data) {
  window.parent.getParentData(data)
}
// สร้างฟังก์ชันสำหรับเริ่มต้นแผนที่
function successLoadLocation(position) {
  latlng.lat = position.coords.latitude
  latlng.lng = position.coords.longitude
}
function errorLoadLocation() {}

export async function initMap() {
  // สร้างตัวแปรสำหรับตำแหน่งเริ่มต้น
  console.log('asasassa')

  //   marker;
}

// เรียกใช้ฟังก์ชันเพื่อโหลดแผนที่เมื่อเว็บโหลดเสร็จสมบูรณ์
window.onload = loadMap
