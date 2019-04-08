let arr_date = [],
    crr_mnth = 0,
    tmp_date_s,
    str_date_s,
    day_length = 1,
    tmp_date_c;

$(function(){

  // day click
  $(document).on('click','.swiper-slide>div>p',function(){
    let tmp_day = $(this).attr('id');
    if( str_date_s == tmp_day ) return false;
    if( $(this).hasClass('checked') ) {
      day_length--;
      arr_date.splice(arr_date.indexOf(tmp_day),1);
      $(this).removeClass('checked');
    } else {
      day_length++;
      arr_date.push(tmp_day);
      $(this).addClass('checked');
    }
    $('p#days_total').html( day_length );
    $('p#days_place').html( (39960 / day_length).toLocaleString() );
    // insert columb
    let tmp_arr = {id:'check_date', val: arr_date};
    data_put(tmp_arr);
  });

  $('#Purchase_submit').click(function(){
    if( $("input[name='Purchase_date']").val() == undefined || $("input[name='Purchase_date']").val() == '' ) return false;
    let set_strt = $("input[name='Purchase_date']").val();
    if( arr_date.indexOf(set_strt.replace('-','.')) ==! -1 ) arr_date.splice(arr_date.indexOf(set_strt.replace('-','.')),1);
    // DB: Insert/Update
    let tmp_arr = {id:'purchase_date', val: set_strt};
    data_put(tmp_arr);
    location.reload();
  });

});

$(window).on('load',function(){
  // 開始日付を設定
  // ---- ローカルDBに、購入日が設定されていないか確認
  let arr_week_d = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  // ---- ローカルDBに、チェック日付がある場合には変数に格納
  data_get('purchase_date').then(function(v){
    // make calendar
    if( v == false ) {
      // 購入日未設定
      tmp_date_s = new Date();
    } else {
      // 購入日設定済
      $("input[name='Purchase_date']").val(v);
      let tmp_split = v.split('-');
      tmp_date_s = new Date(tmp_split[0], tmp_split[1]-1, tmp_split[2]);
      str_date_s = tmp_split[0]+"."+tmp_split[1]+"."+tmp_split[2];
    }
    tmp_date_c = new Date();

    data_get('check_date').then(function(vv){
      // ######################################################################################################################
      // ######################################################################################################################
      let tmp_tag = '';

      if( vv instanceof Array === true ) {
        arr_date = vv;
        day_length += arr_date.length;
      }
      for (let index = 1; index <= 13; index++) {
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
          if( str_date_s == set_id ) addcls += ( addcls == '' ) ? ' class="start' : ' start';
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

      // 日付セット
      $('p#yyyymm').html(tmp_date_c.getFullYear()+"."+('00'+(tmp_date_c.getMonth()+1)).slice(-2));

      $('p#days_total').html( day_length );
      $('p#days_place').html( (39960 / day_length).toLocaleString() );
      // ######################################################################################################################
      // ######################################################################################################################
    });
  });

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