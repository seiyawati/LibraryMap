var pin = [];
var infoWindow = [];
var pinData = [];
var libraryNames = [];
var libraryAddresses = [];

/**
 * 検索ボタンがクリックされた時に初期化
 */
function refreshMap() {
  pinData = [];
  libraryAddresses = [];
  pin = [];
  infoWindow = [];
  var current = new navitime.geo.LatLng(userPosition[0], userPosition[1]);
  document.getElementById('map').innerHTML = '';
  map = new navitime.geo.Map('map', current, 12);
  current_pin = new navitime.geo.overlay.Pin({
  icon:'./images/pin.png',
  position:current,
  draggable:false,
  map:map,
  title:'現在位置'
  });
  current_infoWindow = new navitime.geo.overlay.InfoWindow({
    map:map,
    position:current,
    content:'現在位置'
  });
}

/**
 * 現在位置と図書館のピンを表示する
 */
function pinMap() {
  var baseUrl = 'https://api-service.instruction.cld.dev.navitime.co.jp/teamc/v1';
  libraryAddresses.forEach(libraryAddress => {
      axios
          .get(baseUrl + `/spot?word=${libraryAddress}`)
          .then(connectPinSuccess)
          .catch(connectPinFailure);
  });
}

/**
 * 対象図書館のAPIにアクセスできた時に呼ぶ関数
 */
function connectPinSuccess(response) {
  var spot = response.data.items[0];
  var spot_lat = spot.coord.lat;
  var spot_lng = spot.coord.lon;
  var spot_name = spot.name.replace(/\s+/g, "");
  pinData.push({name: spot_name, lat: spot_lat, lng: spot_lng});
  displayPin();
}

/**
 * ピンの取得に失敗した時に呼ぶ関数
 */
function connectPinFailure(error) {
  console.log(error);
}

/**
 * ピンを立てる関数
 */
function displayPin() {
  for(var i = 0; i < pinData.length; i++) {
    pinLatLng = new navitime.geo.LatLng(pinData[i].lat, pinData[i].lng);
    pin[i] = new navitime.geo.overlay.Pin({
      icon:'./images/pin.png',
      position:pinLatLng,
      map:map,
      title:pinData[i].name,
    });
    infoWindow[i] = new navitime.geo.overlay.InfoWindow({
      map:map,
      position:pinLatLng,
      content:pinData[i].name
    });
    infoWindow[i].setVisible(false);
    pinEvent(i);
  }
}

/**
 * ピンに対するクリックイベントを追加
 */
function pinEvent(i) {
  new navitime.geo.util.addListener(pin[i] , "click" , function(){
    infoWindow[i].setVisible(true);
  });
}

