/*
  地点名に対し，その開館情報を返す関数
  @param string placeName 検索したい地点名
  @return dict openingInfo 開館情報
*/
function getOpeningHours(placeName) {
    var placeId = getPlaceId(placeName);
    var url = 'http://ec2-54-178-103-118.ap-northeast-1.compute.amazonaws.com/openinghour?place_id={place_id}';
    var requestURL = url.replace('{place_id}', placeId);
    var response = callAPI(requestURL);
    var openingInfo = response.result.opening_hours;
    return openingInfo;
}
/*
  地点名に対し，そのplaceIdを返す関数
  @param string placeName 検索したい地点名
  @return string placeId placeNameに対応するplaceId
*/
function getPlaceId(placeName) {
    var url = 'http://ec2-54-178-103-118.ap-northeast-1.compute.amazonaws.com/placeid?placename={placename}';
    var requestURL = url.replace('{placename}', placeName);
    var response = callAPI(requestURL);
    var placeId = response.candidates[0].place_id;
    return placeId;
}
/*
  検索クエリに対し，その画像のURLを返す関数
  @param string query 検索したい地点名
  @return string imageURL 画像のURL
*/
function getImage(query) {
    var url = 'http://ec2-54-178-103-118.ap-northeast-1.compute.amazonaws.com/getimage?query={query}';
    var requestURL = url.replace('{query}', query);
    var response = callAPI(requestURL);
    var imageURL = response.items[0].link;
    return imageURL;
}
