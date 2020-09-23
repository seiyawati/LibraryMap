function searchCafe() {
    var baseUrl = 'https://api-service.instruction.cld.dev.navitime.co.jp/teamc/v1';
    axios
        .get(baseUrl + `/spot?coord=${userPosition[0]},${userPosition[1]}&word=カフェ`)
        .then(connectCafeSuccess)
}

function connectCafeSuccess(response) {
    console.log(response);
    cafes = response.data.items;
    for(var i = 0; i < response.data.items.length; i++) {
        var cafe_lat = cafes[i].coord.lat;
        var cafe_lng = cafes[i].coord.lon;
        var cafe_name = cafes[i].name;
        cafeLatLng = new navitime.geo.LatLng(cafe_lat, cafe_lng);
        cafe_pin = new navitime.geo.overlay.Pin({
        icon:'./images/pin.png',
        position:cafeLatLng,
        map:map,
        title:cafe_name,
        });
        cafe_infoWindow = new navitime.geo.overlay.InfoWindow({
        map:map,
        position:cafeLatLng,
        content:cafe_name
        });
        cafe_infoWindow.setVisible(false);
    }
}

function connectCafeFailure(error) {
    alert('error', error);
}

