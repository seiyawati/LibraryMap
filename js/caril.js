/*
  本の名前の配列を受け取り，それに対応するISBNの配列を返す関数
  @param Array<string> bookNames 検索したい本の配列
  @return dict bookInfomaitons 引数に対する本の情報の配列
*/
function bookNamesToISBNs(bookNames) {
    var bookInfomaitons = [];
    var googleBookAPI = "https://www.googleapis.com/books/v1/volumes?q={bookName}";
    for (var _i = 0, bookNames_1 = bookNames; _i < bookNames_1.length; _i++) {
        var bookName = bookNames_1[_i];
        var requestURL = googleBookAPI.replace('{bookName}', bookName);
        var response = callAPI(requestURL);
        var i = 0;
        while (isNaN(response.items[i].volumeInfo.industryIdentifiers[0].identifier))
            ++i;
        var ISBN = response.items[i].volumeInfo.industryIdentifiers[0].identifier;
        var imageURL = (typeof response.items[i].volumeInfo.imageLinks === "undefined") ? '' : response.items[i].volumeInfo.imageLinks.thumbnail;
        var author = response.items[i].volumeInfo.authors;
        var publisher = response.items[i].volumeInfo.publisher;
        var bookNameByGoogle = response.items[i].volumeInfo.title;
        bookInfomaitons.push({ 'book_name': bookNameByGoogle, 'isbn': ISBN, 'image_url': imageURL, 'author': author, 'publisher': publisher });
    }
    return bookInfomaitons;
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
function searchLibrarysByISBNs(bookInfomaitons, userPosition) {
    var libraryInfomations = getSystemIDs(userPosition);
    var systemIDs = [];
    for (var systemid in libraryInfomations) {
        systemIDs.push(systemid);
    }
    var librarys = {};
    var carilURL = 'http://api.calil.jp/check?isbn={isbn}&systemid={systemIDs}&format=json&callback=no';
    for (var _i = 0, bookInfomaitons_1 = bookInfomaitons; _i < bookInfomaitons_1.length; _i++) {
        var bookInfomaiton = bookInfomaitons_1[_i];
        var ISBN = bookInfomaiton.isbn;
        librarys[ISBN] = {};
        librarys[ISBN]['librarys'] = [];
        var requestURL = carilURL.replace('{isbn}', ISBN).replace('{systemIDs}', systemIDs.join());
        var response = callAPI(requestURL);
        var cnt = 0;
        while (response['continue'] === 1) {
            if (cnt == 1)
                break;
            ++cnt;
            var tmp = callAPI('http://ec2-54-178-103-118.ap-northeast-1.compute.amazonaws.com/sleep2sec');
            response = callAPI(requestURL);
        }
        for (var systemid in response.books[ISBN]) {
            for (var libkey in response.books[ISBN][systemid].libkey) {
                if (response.books[ISBN][systemid].libkey[libkey] === '貸出可' && libraryInfomations[systemid][libkey]) {
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
function searchLibrarys(bookNames, userPosition) {
    //入力された図書名をISBNに変換
    var bookInfomaitons = bookNamesToISBNs(bookNames);
    var librarys = searchLibrarysByISBNs(bookInfomaitons, userPosition);
    for (var i in bookInfomaitons) {
        librarys[bookInfomaitons[i]['isbn']]['book_name'] = bookInfomaitons[i]['book_name'];
        librarys[bookInfomaitons[i]['isbn']]['book_image_url'] = bookInfomaitons[i]['image_url'];
        librarys[bookInfomaitons[i]['isbn']]['authors'] = bookInfomaitons[i]['author'];
        librarys[bookInfomaitons[i]['isbn']]['publisher'] = bookInfomaitons[i]['publisher'];
    }
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
