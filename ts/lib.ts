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

function hhmm(str) {
  return str.substr(0, 2) + ':' + str.substr(2, 2);
}

function formatLibraryInfo(args) {
  return libraryInfomationView.replace('{url}', args['url'])
         .replace('{library_name}', args['libraryName'])
         .replace('{image_url}', args['image_url'])
         .replace('{address}', args['address'])
         .replace('{open}', hhmm(args['opening_hours']['periods'][0]['open']['time']))
         .replace('{close}', hhmm(args['opening_hours']['periods'][0]['close']['time']));
}
