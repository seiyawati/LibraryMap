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
  const openingInfo = response.result.opening_hours;
  return openingInfo;
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
  const placeId: string = response.candidates[0].place_id;
  return placeId;
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
  const imageURL: string = response.items[0].link;
  return imageURL;
}
