/*
  地点名に対し，その開館情報を返す関数
  @param string placeName 検索したい地点名
  @return dict openingInfo 開館情報
*/
function getOpeningHours(placeName: string) {
  const placeId: string = getPlaceId(placeName);
  const url: string = 'http://ec2-54-178-103-118.ap-northeast-1.compute.amazonaws.com/openinghour?place_id={place_id}';
  const requestURL: string = url.replace('{place_id}', placeId);
  const response = callAPI(requestURL);
  const openingInfos = [];
  for(var i in response) {
    if(response[i].status !== "OK") continue;
    openingInfos.push(response[i].result.opening_hours);
  }
  return openingInfos;
}
/*
  地点名に対し，そのplaceIdを返す関数
  @param string placeName 検索したい地点名
  @return string placeId placeNameに対応するplaceId
*/
function getPlaceId(placeName: string): string {
  const url: string = 'http://ec2-54-178-103-118.ap-northeast-1.compute.amazonaws.com/placeid?placename={placename}';
  const requestURL: string = url.replace('{placename}', placeName);
  const response = callAPI(requestURL);
  const placeIds = [];
  for(var i in response) {
    if(response[i].status !== "OK") continue;
    placeIds.push(response[i].candidates[0].place_id);
  }
  return placeIds;
}
/*
  検索クエリに対し，その画像のURLを返す関数
  @param string query 検索したい地点名
  @return string imageURL 画像のURL
*/
function getImage(query: string): string {
  const url: string = 'http://ec2-54-178-103-118.ap-northeast-1.compute.amazonaws.com/getimage?query={query}';
  const requestURL: string = url.replace('{query}', query);
  const response = callAPI(requestURL);
  const imageURLs = [];
  for(var i in response) {
    if (response.length - 1 == i) continue;
    imageURLs.push(response[i].items[0].link);
  }
  return imageURLs;
}
