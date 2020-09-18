var userPosition = ['35.667339', '139.7148'];//default: navitime japan

//現在位置の緯度軽度だけを返す関数
function getUserPosition() {
    return userPosition;
}

//現在位置表示をマップに表示する関数
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
  userPosition = [lat, lng];
  var current = new navitime.geo.LatLng(lat, lng);
  map = new navitime.geo.Map('map', current, 15);
  pin = new navitime.geo.overlay.Pin({
  icon:'./images/pin.png',
  position:current,
  draggable:false,
  map:map,
  title:'現在位置'
  });
  infoWindow = new navitime.geo.overlay.InfoWindow({
    map:map,
    position:current,
    content:'現在位置'
  });
}

//現在位置を取得できない時の関数
function error() {
    alert("現在位置を取得できません。");
}
