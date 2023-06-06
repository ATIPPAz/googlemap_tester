// สร้างตัวแปรสำหรับเก็บ API Key ของคุณ
var apiKey = 'AIzaSyA1WQxkpdVk5CFKHwMbY93nfOJN3loLja8';

// สร้างฟังก์ชันสำหรับโหลดแผนที่
// function loadMap() {
//   // สร้าง URL สำหรับเรียกใช้งาน Google Maps JavaScript API
//   var script = document.createElement('script');
//   script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMaps`;
//   script.defer = true;
//   script.async = true;
//   document.head.appendChild(script);
// }

// สร้างฟังก์ชันสำหรับเริ่มต้นแผนที่
function initMap() {
  // สร้างตัวแปรสำหรับตำแหน่งเริ่มต้น
  var latlng = { lat: 13.756212, lng: 100.532428 }; // ตั้งค่าตำแหน่งเริ่มต้นเป็นตำแหน่งในนิวยอร์ก

  // สร้างตัวแปรสำหรับตั้งค่าแผนที่
  var mapOptions = {
    center: latlng,
    zoom: 12,
  };

  // สร้างแผนที่ใน element ที่มี id เป็น "map"
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // โหลดข้อมูล JSON จากการเรียกใช้งาน API และแสดงบนแผนที่
  // ตัวอย่างนี้ใช้เป็นตัวอย่างเท่านั้น คุณควรปรับใช้งานตามโครงสร้างของ JSON ที่ได้รับ
  var jsonData = {
    results: [
      {
        formatted_address: 'phayathai ja',
        geometry: {
          location: {
            // lat: 40.712776,
            lat: 13.756212,
            // lng: -74.005974,
            lng: 100.532428,
          },
        },
      },
    ],
  };

  // สร้างตัวแปรสำหรับตำแหน่งจาก JSON
  var location = jsonData.results[0].geometry.location;

  // สร้างตัวแปรสำหรับตำแหน่งเครื่องหมายบนแผนที่
  var markerOptions = {
    position: location,
    map: map,
    title: jsonData.results[0].formatted_address,
  };

  // สร้างเครื่องหมายบนแผนที่
  var marker = new google.maps.Marker(markerOptions);
  markerOptions = {
    position: { lat: location.lat + 1, lng: location.lng + 1 },
    map: map,
    title: jsonData.results[0].formatted_address,
  };
  google.maps.event.addListener(marker, 'dragend', (e) => {
    console.log(e);
  });
  //   marker;
  console.log(google.maps.event);
}

// เรียกใช้ฟังก์ชันเพื่อโหลดแผนที่เมื่อเว็บโหลดเสร็จสมบูรณ์
// window.onload = loadMap;
