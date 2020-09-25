var map;
var userPosition = [];//ユーザーの現在位置

//現在位置の緯度軽度だけを返す関数
function getUserPosition() {
    return userPosition;
}

//現在地を取得して,デフォルト位置の地図を表示
function initMap() {
    var default_spot = new navitime.geo.LatLng('35.689614', '139.691634');
    map = new navitime.geo.Map('map', default_spot, 12);
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success);
        } else {
        navigator.geolocation.getCurrentPosition(error);
    }
}

//現在位置を取得できる場合に呼ばれる関数
function success(position) {
  var current_lat = position.coords.latitude;
  var current_lng = position.coords.longitude;
  userPosition = [current_lat, current_lng];
  var current = new navitime.geo.LatLng(current_lat, current_lng);
  document.getElementById('map').innerHTML = '';
  map = new navitime.geo.Map('map', current, 12);
  current_pin = new navitime.geo.overlay.Pin({
  icon:'./images/now_pin.png',
  position:current,
  draggable:false,
  map:map,
  title:'現在位置'
  });
}

//現在位置を取得できない時に呼ばれる関数
function error() {
    alert("現在位置を取得できません。");
}
