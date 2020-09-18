$(function () {
  $('#search_books').click(function () {
    //検索フォームから入力を取得
    const bookNames: Array<string> = $('#book_names').val().split(',');
    //ユーザの位置情報を取得
    const userPosition: Array<string> = ['35.667339', '139.7148'];
    //近隣の図書館で，蔵書が有る図書館を取得
    const librarys = searchLibrarys(bookNames, userPosition);
    for(let isbn in librarys) {
      for(let i in librarys[isbn]['librarys']) {
        const libraryName: string = librarys[isbn]['librarys'][i]['libraryName'];
        //図書館の開館情報を取得
        librarys[isbn]['librarys'][i]['opening_hours'] = getOpeningHours(libraryName);
        //図書館の外観画像を取得
        librarys[isbn]['librarys'][i]['image_url'] = getImage(libraryName+'+'+'外観');
      }
    }
    console.log(librarys);
  });
});
