$(function () {
  $('#search_books').click(function () {
    //検索フォームから入力を取得
    const bookNames: Array<string> = $('#book_names').val().split(',');
    //入力された図書名をISBNに変換
    const ISBNs: Array<string> = bookNamesToISBNs(bookNames);
    //近隣の図書館で，蔵書が有る図書館を取得
    const librarys = searchLibrarysByISBNs(ISBNs);
    console.log(librarys);
  });
});
