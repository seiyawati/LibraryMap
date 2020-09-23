let libraryInfomationView = `
<div class="p-2 library-info">
<a href="{url}" class="library-name" target="_blank">{library_name}</a>
<p class="">{address}</p>
<div class="row no-gutters">
<div class="col-12 col-md-6 text-center pr-2"><img src="{image_url}" class="w-100"></div>
<div class="col-12 col-md-6 p-0">
<ul class="mb-2">
<li><i class="far fa-clock mr-2"></i><span class="">{open}-{close}</span></li>
<li><i class="far fa-calendar-times mr-2"></i><span class="">年末年始</span></li>
</ul>
<button class="p-2 root-btn"><i class="fas fa-route mr-2"></i>ルートを調べる</button>
</div>
</div>
`;

$(function () {
  $('#search_books').click(function () {
    //要素を空にする
    $(".library-infos").empty();
    //検索フォームから入力を取得
    var bookNames = $('#book_names').val().split(',');
    //近隣の図書館で，蔵書が有る図書館を取得
    var librarys = searchLibrarys(bookNames, getUserPosition());
    for (var isbn in librarys) {
        for (var i in librarys[isbn]['librarys']) {
            var libraryName = librarys[isbn]['librarys'][i]['libraryName'];
            libraryNames.push(libraryName);
            //図書館の開館情報を取得
            librarys[isbn]['librarys'][i]['opening_hours'] = getOpeningHours(libraryName);
            //図書館の外観画像を取得
            librarys[isbn]['librarys'][i]['image_url'] = getImage(libraryName + '+' + '外観');
            $('.library-infos').append(libraryInfomationView.replace('{url}', librarys[isbn]['librarys'][i]['url'])
                        .replace('{library_name}', librarys[isbn]['librarys'][i]['libraryName'])
                        .replace('{image_url}', librarys[isbn]['librarys'][i]['image_url'])
                        .replace('{address}', librarys[isbn]['librarys'][i]['address'])
                        .replace('{open}', hhmm(librarys[isbn]['librarys'][i]['opening_hours']['periods'][0]['open']['time']))
                        .replace('{close}', hhmm(librarys[isbn]['librarys'][i]['opening_hours']['periods'][0]['close']['time'])));
        }
    }
    //マップにピンを立てる
    pinMap();
  });

  //ルート検索のボタンがクリックされた時
  $(document).on('click', '.root-btn', function() {
      var library = $(this).parents('.library-info').find('.library-name').text()
      searchRoute(library);
  })

  //初期表示でマップに現在位置を表示
  window.onload = initMap();
});
