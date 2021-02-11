## 図書館マップ

![demo](https://user-images.githubusercontent.com/60223961/107649670-08f9ab00-6cc1-11eb-827b-a4bfe8f52afe.png)

#### 概要
ユーザが入力した本の蔵書が有る図書館を検索し，その図書館の情報の取得，またマップ上でその位置を示す．
検索対象の図書館はユーザの現在地から近い順に100軒である．

#### 用いた技術
- javascriptライブラリ: jQuery
- AltJS:                TypeScript
- cssフレームワーク:    Bootstrap3
- APIサーバ:            aws, docker, express(node.js)

#### 用いたデータ
- 地図情報:         NAVITIME API (https://api-sdk.navitime.co.jp/api/)
- 図書館蔵書情報:   カーリル API (https://calil.jp/doc/api.html)
- 図書館の外観画像: Custom Search JSON API (https://developers.google.com/custom-search/v1/overview)
- 図書館の開館情報: google places API (https://developers.google.com/places/web-service/overview)
