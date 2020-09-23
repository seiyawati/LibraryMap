var libraryInfomationView = "\n<div class=\"p-2 library-info\">\n<a href=\"{url}\" class=\"library-name\" target=\"_blank\">{library_name}</a>\n<p class=\"\">\u56F3\u66F8\u9928\u306E\u4F4F\u6240\u56F3\u66F8\u9928\u306E\u4F4F\u6240\u56F3\u66F8\u9928\u306E\u4F4F\u6240</p>\n<div class=\"row no-gutters\">\n<div class=\"col-12 col-md-6 text-center pr-2\"><img src=\"{image_url}\" class=\"w-100\"></div>\n<div class=\"col-12 col-md-6 p-0\">\n<ul class=\"mb-2\">\n<li><i class=\"far fa-clock mr-2\"></i><span class=\"\">10:00-19:00</span></li>\n<li><i class=\"far fa-calendar-times mr-2\"></i><span class=\"\">\u5E74\u672B\u5E74\u59CB</span></li>\n</ul>\n<button class=\"p-2 root-btn\"><i class=\"fas fa-route mr-2\"></i>\u30EB\u30FC\u30C8\u3092\u8ABF\u3079\u308B</button>\n</div>\n</div>\n";
$(function () {
    $('#search_books').click(function () {
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
                    .replace('{image_url}', librarys[isbn]['librarys'][i]['image_url']));
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
