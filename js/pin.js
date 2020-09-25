var pin = [];
var infoWindow = [];
var pinData = [];
var libraryNames = [];
var libraryAddresses = [];
var librarysArr = [];
var flag = -1;


/**
 * 検索ボタンがクリックされた時に初期化
 */
function refreshMap() {
  pin = [];
  infoWindow = [];
  pinData = [];
  librarysArr = [];
  libraryAddresses = [];
  var current = new navitime.geo.LatLng(userPosition[0], userPosition[1]);
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

/**
 * 現在位置と図書館のピンを表示する
 */
function pinMap() {
  var baseUrl = 'https://api-service.instruction.cld.dev.navitime.co.jp/teamc/v1';
  libraryAddresses.forEach(libraryAddress => {
      axios
          .get(baseUrl + `/address?word=${libraryAddress}`)
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
  var spot_name = spot.name.replace("丁目", "-");
  var library_name = librarysArr.find(library => splitAddress(library) === spot_name);
  pinData.push({name: library_name.libraryName, lat: spot_lat, lng: spot_lng});
  displayPin();
}

/**
 * カーリルの住所表記とnavitimeの住所表記を一致させる関数
 */
function splitAddress(library) {
  var pos = library.address.indexOf(" ");
  if(pos < 0) {
    return library.address;
  } else {
    return library.address.substring(0, pos);
  }
}

/**
 * APIにアクセスできなかった時に呼ぶ関数
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
    if(flag == -1) {
      infoWindow[i].setVisible(true);
  } else {
      infoWindow[flag].setVisible(false);
      infoWindow[i].setVisible(true);
  }
  flag = i;
  });
}

