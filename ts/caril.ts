/*
  本の名前の配列を受け取り，それに対応するISBNの配列を返す関数
  @param Array<string> bookNames 検索したい本の配列
  @return dict bookInfomaitons 引数に対する本の情報の配列
*/
function bookNamesToISBNs(bookNames: Array<string>) {
  const bookInfomaitons = [];
  const googleBookAPI = "https://www.googleapis.com/books/v1/volumes?q={bookName}";
  for(let bookName of bookNames) {
    const requestURL: string = googleBookAPI.replace('{bookName}', bookName);
    const response = callAPI(requestURL);
    const i: number = 0;
    while(response.items[i].volumeInfo.industryIdentifiers[0].identifier.length !== 10 || response.items[i].volumeInfo.industryIdentifiers[0].identifier.length !== 13) ++i;
    const ISBN = response.items[i].volumeInfo.industryIdentifiers[0].identifier;
    const imageURL = response.items[i].volumeInfo.imageLinks.thumbnail;
    bookInfomaitons.push({'isbn': ISBN, 'image_url': imageURL});
  }
  return bookInfomaitons;
}
/*
  指定された地点付近の図書館のリストを返す関数
  @param Array<string> userPosition 緯度/経度
  @return dict libraryInfomations 近隣の図書館リストを返す
*/
function getSystemIDs(userPosition: Array<string>) {
  const carilURL: string = 'http://api.calil.jp/library?geocode={geocode}&limit=100&format=json&callback=';
  const requestURL: string = carilURL.replace('{geocode}', userPosition[1] + ',' + userPosition[0]);
  const response = callAPI(requestURL);
  const libraryInfomations = {};
  for(let library of response) {
    const libraryInfo = {
      [library.libkey]: {
        'libraryName': library.formal,
        'url': library.url_pc,
        'address': library.address,
        'tel': library.tel
      }
    };
    if(!libraryInfomations[library.systemid]) {
      libraryInfomations[library.systemid] = libraryInfo;
    } else {
      libraryInfomations[library.systemid] = Object.assign(libraryInfomations[library.systemid], libraryInfo);
    }
  }
  return libraryInfomations;
}
/*
  ISBNの配列を受け取り，その蔵書が有る図書館の情報を返す関数
  @param Array<string> ISBNs 検索したい本のISBNの配列
  @param Array<string> userPosition 緯度/経度
  @return dict librarys 蔵書のある図書館の情報の連想配列
*/
function searchLibrarysByISBNs(bookInfomaitons, userPosition: Array<string>) {
  const libraryInfomations = getSystemIDs(userPosition);
  const systemIDs = [];
  for (let systemid in libraryInfomations) {
    systemIDs.push(systemid);
  }
  const librarys = {};
  const carilURL: string = 'http://api.calil.jp/check?isbn={isbn}&systemid={systemIDs}&format=json&callback=no';
  for(let bookInfomaiton of bookInfomaitons) {
    const ISBN = bookInfomaiton.isbn;
    librarys[ISBN] = {};
    librarys[ISBN]['librarys'] = [];
    const requestURL: string = carilURL.replace('{isbn}', ISBN).replace('{systemIDs}', systemIDs.join());
    let response = callAPI(requestURL);
    while(response['continue'] === '1') {
      let tmp = callAPI('http://ec2-54-178-103-118.ap-northeast-1.compute.amazonaws.com/sleep2sec');
      response = callAPI(requestURL);
    }
    for (let systemid in response.books[ISBN]) {
      for (let libkey in response.books[ISBN][systemid].libkey) {
        if(response.books[ISBN][systemid].libkey[libkey] === '貸出可' && libraryInfomations[systemid][libkey]) {
          librarys[ISBN]['librarys'].push(libraryInfomations[systemid][libkey]);
        }
      }
    }
  }
  return librarys;
}
/*
  bookNamesに対し，蔵書のある図書館を返す関数
  @param Array<string> bookNames 図書名の配列
  @param Array<string> userPosition ユーザの現在位置(緯度/経度)
  @return dict librarys 蔵書の有る図書館の情報
*/
function searchLibrarys(bookNames: Array<string>, userPosition: Array<string>) {
  //入力された図書名をISBNに変換
  const bookInfomaitons = bookNamesToISBNs(bookNames);
  const librarys = searchLibrarysByISBNs(bookInfomaitons, userPosition);
  for(let i in bookInfomaitons) {
    librarys[bookInfomaitons[i]['isbn']]['book_name'] = bookNames[i];
    librarys[bookInfomaitons[i]['isbn']]['book_image_url'] = bookInfomaitons[i]['image_url'];
  }
  return librarys;
}
/*
  webAPIを叩く関数
  @param string url 叩きたいwebAPIのurl
  @return jsonオブジェクト
*/
function callAPI(url: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send();
  if (xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  } else {
    return [];
  }
}
