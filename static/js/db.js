// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// indexedDB
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let db,
    dbName    = 'passportDB',
    dbVersion = '1',
    storeName = 'date_info';

// DB名を指定して接続／なければ新規作成
let openReq = indexedDB.open(dbName, dbVersion);

// DBのバージョン更新（DBの新規作成も含む）時のみ実行
openReq.onupgradeneeded = function (event) {

  window.alert('db upgrade');

  db = event.target.result;
  // オブジェクトストア（TABLEのようなもの）新規作成
  db.createObjectStore(storeName, {keyPath : 'id'});

}

// onupgradeneededの後に実行。更新がない場合はこれだけ実行
openReq.onsuccess = function (event) {

  window.alert('db open success');

  db = event.target.result;
  // 接続の解除
  // db.close();

}

// 接続に失敗
openReq.onerror = function (event) {
  window.alert('接続失敗');
}

function data_put(data){
  
  if( data.id == undefined || data.val == undefined ) return false;

  var putdt = { id: data.id, name: data.val };
  var trans = db.transaction(storeName, 'readwrite');
  var store = trans.objectStore(storeName);
  var putRq = store.put(putdt);

  console.log( putRq );

}

function data_delete(data){

  if( data.id == undefined ) return false;

  var putdt = data.id;
  var trans = db.transaction(storeName, 'readwrite');
  var store = trans.objectStore(storeName);

  store.delete(putdt);

}

function data_get(data){
  return new Promise(function(resolve, reject){

    var putdt = data;
    var trans = db.transaction(storeName);
    var store = trans.objectStore(storeName);
    var request = store.get(putdt);

    request.onerror = function(e){
      resolve(false);
    };
    request.onsuccess = function(e){
      if( e.target.result == undefined ) {
        resolve(false);
      } else {
        resolve(e.target.result.name);
      }
    };

  });
}
