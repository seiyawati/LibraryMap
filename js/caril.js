/*
  本の名前の配列を受け取り，それに対応するISBNの配列を返す関数
  @param Array<string> bookNames 検索したい本の配列
  @return Array<string> ISBNs 引数に対するISBNの配列
*/
function bookNamesToISBNs(bookNames) {
    var ISBNs = [];
    var googleBookAPI = "https://www.googleapis.com/books/v1/volumes?q={bookName}";
    for (var _i = 0, bookNames_1 = bookNames; _i < bookNames_1.length; _i++) {
        var bookName = bookNames_1[_i];
        var requestURL = googleBookAPI.replace('{bookName}', bookName);
        var response = callAPI(requestURL);
        var ISBN = response.items[0].volumeInfo.industryIdentifiers[0].identifier;
        ISBNs.push(ISBN);
    }
    return ISBNs;
}
/*
  指定された地点付近の図書館のリストを返す関数
  @param Array<string> userPosition 緯度/経度
  @return dict libraryInfomations 近隣の図書館リストを返す
*/
function getSystemIDs(userPosition) {
    var _a;
    var carilURL = 'http://api.calil.jp/library?geocode={geocode}&limit=100&format=json&callback=';
    var requestURL = carilURL.replace('{geocode}', userPosition[1] + ',' + userPosition[0]);
    var response = callAPI(requestURL);
    var libraryInfomations = {};
    for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
        var library = response_1[_i];
        var libraryInfo = (_a = {},
            _a[library.libkey] = {
                'libraryName': library.formal,
                'url': library.url_pc,
                'address': library.address,
                'tel': library.tel
            },
            _a);
        if (!libraryInfomations[library.systemid]) {
            libraryInfomations[library.systemid] = libraryInfo;
        }
        else {
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
function searchLibrarysByISBNs(ISBNs, userPosition) {
    var libraryInfomations = getSystemIDs(userPosition);
    var systemIDs = [];
    for (var systemid in libraryInfomations) {
        systemIDs.push(systemid);
    }
    var librarys = [];
    var carilURL = 'http://api.calil.jp/check?isbn={isbn}&systemid={systemIDs}&format=json&callback=no';
    for (var _i = 0, ISBNs_1 = ISBNs; _i < ISBNs_1.length; _i++) {
        var ISBN = ISBNs_1[_i];
        var requestURL = carilURL.replace('{isbn}', ISBN).replace('{systemIDs}', systemIDs.join());
        console.log(systemIDs.join());
        var response = callAPI(requestURL);
        for (var systemid in response.books[ISBN]) {
            for (var libkey in response.books[ISBN][systemid].libkey) {
                if (response.books[ISBN][systemid].libkey[libkey] === '貸出可' && libraryInfomations[systemid][libkey]) {
                    librarys.push(libraryInfomations[systemid][libkey]);
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
function searchLibrarys(bookNames, userPosition) {
    //入力された図書名をISBNに変換
    var ISBNs = bookNamesToISBNs(bookNames);
    var librarys = searchLibrarysByISBNs(ISBNs, userPosition);
    return librarys;
}
/*
  webAPIを叩く関数
  @param string url 叩きたいwebAPIのurl
  @return jsonオブジェクト
*/
function callAPI(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    }
    else {
        return [];
    }
}
