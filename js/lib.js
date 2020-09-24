var libraryInfomationView = "\n<div class=\"p-2 library-info\">\n<a href=\"{url}\" class=\"library-name\" target=\"_blank\">{library_name}</a>\n<p class=\"\">{address}</p>\n<div class=\"row no-gutters\">\n<div class=\"col-12 col-md-6 text-center pr-2\"><img src=\"{image_url}\" class=\"w-100\"></div>\n<div class=\"col-12 col-md-6 p-0\">\n<ul class=\"mb-2\">\n<li><i class=\"far fa-clock mr-2\"></i><span class=\"\">{open}-{close}</span></li>\n<li><i class=\"far fa-calendar-times mr-2\"></i><span class=\"\">{closing_day}</span></li>\n</ul>\n<button class=\"p-2 root-btn\"><i class=\"fas fa-route mr-2\"></i>\u30EB\u30FC\u30C8\u3092\u8ABF\u3079\u308B</button>\n</div>\n</div>\n";
var weekdays = ['日', '月', '火', '水', '木', '金', '土'];
/*
  @param  hhmm表記の時刻
  @return hh:mm表記の時刻
*/
function hhmm(str) {
    return str.substr(0, 2) + ':' + str.substr(2, 2);
}
/*
  @param  レンダリングする図書館情報
  @return レンダリングした図書館情報のdiv要素
*/
function formatLibraryInfo(args) {
    return libraryInfomationView.replace('{url}', args['url'])
        .replace('{library_name}', args['libraryName'])
        .replace('{image_url}', args['image_url'])
        .replace('{address}', args['address'])
        .replace('{open}', (typeof args.opening_hours === "undefined") ? '??:??' : hhmm(args['opening_hours']['periods'][0]['open']['time']))
        .replace('{close}', (typeof args.opening_hours === "undefined") ? '??:??' : hhmm(args['opening_hours']['periods'][0]['close']['time']))
        .replace('{closing_day}', (typeof args.opening_hours === "undefined") ? '不明' : getClosingDay(args['opening_hours']['periods']));
}
/*
  @param  図書館の開館情報 args['opening_hours']['periods']
  @return 休館日
*/
function getClosingDay(openingHours) {
    var ret = "";
    var closingDays = 127;
    for (var i in openingHours) {
        closingDays -= (1 << openingHours[i]['close']['day']);
    }
    for (var i = 0; i < 7; ++i) {
        if ((1 << i) & closingDays) {
            ret += weekdays[i];
        }
    }
    return ret;
}
