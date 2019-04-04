let arr_date = [],
    set_strt = '',  // 2019-04-03
    crr_mnth = 0,
    tmp_date_s,
    tmp_date_c;

$(function(){

  // day click
  $('.swiper-slide>div>p').click(function(){
    let tmp_day = $(this).attr('id');
    if( $(this).hasClass('checked') ) {
      arr_date.splice(arr_date.indexOf(tmp_day),1);
      $(this).removeClass('checked');
    } else {
      arr_date.push(tmp_day);
      $(this).addClass('checked');
    }
  });

  $('#Purchase_submit').click(function(){
    if( $("input[name='Purchase_date']").val() == undefined || $("input[name='Purchase_date']").val() == '' ) return false;
    set_strt = $("input[name='Purchase_date']").val();
    // DB: Insert/Update
    // reload
  });

});

$(window).on('load',function(){
  // 開始日付を設定
  // ---- ローカルDBに、購入日が設定されていないか確認
  let arr_week_d = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  // ---- ローカルDBに、チェック日付がある場合には変数に格納

  // make calendar
  // ・基本的には当月から１年分／購入月を入力済みの場合には、購入月から１年分を作成
  if( 0 ) {
    // 購入日未設定
    tmp_date_s = new Date();              // today
  } else {
    // 購入日設定済
    set_strt.split('-');
    tmp_date_s = new Date(2019, 0, 3);    // 2019-4-3
  }
  tmp_date_c = new Date();

  let tmp_tag = '';
  for (let index = 1; index <= 12; index++) {
    let tmp_day = 0,
        tmp_yea = ( (tmp_date_s.getMonth()+index) > 12 ) ? (tmp_date_s.getFullYear()+1) : tmp_date_s.getFullYear();
        tmp_mnt = ( (tmp_date_s.getMonth()+index) > 12 ) ? (tmp_date_s.getMonth()+index)-12 : (tmp_date_s.getMonth()+index);
        tmp_tag += '<div class="swiper-slide"><div>';
    switch (tmp_mnt) {
      case  1:
      case  3:
      case  5:
      case  7:
      case  8:
      case 10:
      case 12:
        tmp_day = 31;
        break;
      case  4:
      case  6:
      case  9:
      case 11:
        tmp_day = 30;
        break;
      case  2:
        tmp_day = new Date( tmp_yea, 2, 0 ).getDate();
        break;
    }
    for (let idx = 1; idx <= tmp_day; idx++) {
      let addcls = '',
          set_id = tmp_yea+'.'+('00'+tmp_mnt).slice(-2)+'.'+('00'+idx).slice(-2);
      if( idx == 1 ) {
        let tmp_day = new Date( tmp_yea, tmp_mnt-1, 1).getDay();
        if( tmp_day > 0 ) addcls = ' class="'+arr_week_d[tmp_day];
      }
      if( arr_date.indexOf(set_id) != -1 ) addcls += ( addcls == '' ) ? ' class="checked' : ' checked';
      if( addcls != '' ) addcls += '"';
      tmp_tag += '<p id="'+set_id+'"'+addcls+'>'+idx+'</p>';
    }
    tmp_tag += '</div></div>';
  }
  $('.swiper-wrapper').append(tmp_tag);

  swiper = new Swiper('.swiper-container',{
    init: false,
    on: {
      slideChange: slideChange
    }
  });
  swiper.on('init',function(){
    if( tmp_date_c.getMonth() > tmp_date_s.getMonth() ) {
      swiper.slideTo( tmp_date_c.getMonth() - tmp_date_s.getMonth() );
    }
    else if( tmp_date_c.getMonth() < tmp_date_s.getMonth() ) {
      swiper.slideTo( (tmp_date_c.getMonth()+12) - tmp_date_s.getMonth() );
    }
  });
  swiper.init();


  // ・チェック総数を変数に格納、各種数値に利用
  // ・ローカルDBからチェック済日付を取得して、設定しておく
  // 仮）key: yyyy.mm.dd / value: checked
  // ・



  // 日付セット
  $('p#yyyymm').html(tmp_date_c.getFullYear()+"."+('00'+(tmp_date_c.getMonth()+1)).slice(-2));

});

var swiper;
// var swiper = new Swiper('.swiper-container',{
//   on: {
//     slideChange: slideChange
//   }
// });

function slideChange() {
  let tmp_y = ((tmp_date_s.getMonth()+1+swiper.activeIndex) > 12) ? (tmp_date_s.getFullYear()+1) : tmp_date_s.getFullYear(),
      tmp_m = ((tmp_date_s.getMonth()+1+swiper.activeIndex) > 12) ? (tmp_date_s.getMonth()+1+swiper.activeIndex)-12 : (tmp_date_s.getMonth()+1+swiper.activeIndex);
  $('p#yyyymm').html(tmp_y+"."+('00'+tmp_m).slice(-2));
}

// function init() {
//   // if( tmp_date_c.getMonth() > tmp_date_s.getMonth() ) {
//   //   swiper.slideTo( tmp_date_c.getMonth() - tmp_date_s.getMonth() );
//   // }
//   // else if( tmp_date_c.getMonth() < tmp_date_s.getMonth() ) {
//   //   swiper.slideTo( (tmp_date_c.getMonth()+12) - tmp_date_s.getMonth() );
//   // }
//   swiper.slideTo(1);
// }