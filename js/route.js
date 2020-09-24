function searchRoute(library) {
    var routeSpot = pinData.find(spot => spot.name === library);
    var routeUrl = `https://api-service.instruction.cld.dev.navitime.co.jp/teamc/v1/shape_transit?start=${userPosition[0]},${userPosition[1]}&goal=${routeSpot.lat},${routeSpot.lng}&start_time=2020-09-20T09:00:00&options=transport_shape`;
    axios
        .get(routeUrl)
        .then(connectSuccessRouteShape) 
        .catch(connectFailureRouteShape)
}

function connectSuccessRouteShape(response) {
    route = response.data;
    infoWindow.forEach(info => info.setVisible(true));
    renderer = new navitime.geo.route.Renderer(route, {
        map: map,
        unit: 'degree',
        allRoute: true,
        arrow: true,
        originalColor: true,
    });
    renderer.draw();
}

function connectFailureRouteShape() {
    alert('ルートの形状を取得できませんでした。');
}

