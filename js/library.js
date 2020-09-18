//テストデータ
const libraries = [
    {
      address: "栃木県宇都宮市明保野町7-57",
      libraryName: "宇都宮市立中央図書館",
      tel: "028-636-0231",
      url: "http://www.lib-utsunomiya.jp/"
    },
    {
      address: "栃木県宇都宮市雀宮町56-1",
      libraryName: "宇都宮市立南図書館",
      tel: "028-653-7609",
      url: "http://www.lib-utsunomiya.jp/"
    },
    {
      address: "茨城県つくば市吾妻3-1",
      libraryName: "筑波学院大学附属図書館",
      tel: "029-858-4820",
      url: "http://www.tsukuba-g.ac.jp/library/library_top.html"
    }
];
  
/**
 * 地図に検索対象の図書館のピンを立てる
 */
function libraryMap() {
  document.getElementById('map').innerHTML = '';
  navigator.geolocation.getCurrentPosition(displayPin);
}

/**
 * 現在位置と図書館のピンを表示する
 * @param {*} position 
 */
function displayPin(position) {
  var current_lat = position.coords.latitude;
  var current_lng = position.coords.longitude;
  var current = new navitime.geo.LatLng(current_lat, current_lng);
  map = new navitime.geo.Map('map', current, 8);
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
  infoWindow.setVisible(false);
  var baseUrl = 'https://api-service.instruction.cld.dev.navitime.co.jp/teamc/v1';
  libraries.forEach(library => {
      axios
          .get(baseUrl + `/spot?word=${library.libraryName}`)
          .then(connectSuccess)
          .catch(connectFailure);
  });
}

/**
 * 対象図書館のAPIにアクセスできた時に呼ぶ関数
 * @param {*} response 
 */
function connectSuccess(response) {
  var spot = response.data.items[0];
  var spot_lat = spot.coord.lat;
  var spot_lng = spot.coord.lon;
  var spot_name = spot.name;
  mapLatLng = new navitime.geo.LatLng(spot_lat, spot_lng);
  //ピンを立てる
  pin = new navitime.geo.overlay.Pin({
      icon:'./images/pin.png',
      position:mapLatLng,
      draggable:false,
      map:map,
      title:spot_name,
  });
  //吹き出しを表示
  infoWindow = new navitime.geo.overlay.InfoWindow({
    map:map,
    position:mapLatLng,
    content:spot_name
  });
  //初期表示では吹き出しは隠しておく予定
  // infoWindow.setVisible(false);
}

/**
 * ピンの取得に失敗した時に呼ぶ関数
 * @param {*} error 
 */
function connectFailure(error) {
  alert("error", error);
}