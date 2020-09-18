//現在位置表示
function initMap() {  
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success);
        } else {
        navigator.geolocation.getCurrentPosition(error);
    }
}

//現在位置を取得できる場合の関数
function success(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  var current = new navitime.geo.LatLng(lat, lng);
  map = new navitime.geo.Map('map', current, 15);
  pin = new navitime.geo.overlay.Pin({
  icon:'./images/pin.png',
  position:current,
  draggable:false,
  map:map,
  title:'現在位置'
  });
}

//現在位置を取得できない時の関数
function error() {
    alert("現在位置を取得できません。");
}

window.onload = initMap();