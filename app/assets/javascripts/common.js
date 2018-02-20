AppZapp = {};
AppZapp.Common = {
  toggleSidebar: function(){
    $(".sidebar-toggle").bind("click", function (e) {
      $("#sidebar").toggleClass("active");
      $(".app-container").toggleClass("__sidebar");
    });
    $(".navbar-toggle").bind("click", function (e) {
      $("#navbar").toggleClass("active");
      $(".app-container").toggleClass("__navbar");
    });
  },
  buyerListCancelBtn: function(selector){
    $(selector).on('click', function(e){
      if($('#Deal').val()){
        e.preventDefault();
        $.ajax({
          url: '/',
          data: {deal: $('#Deal').val()},
          dataType: 'script'
        });
      }
    });
  },
  maskedPhoneNumber: function(selector){
    $(selector).mask("(000) 000-0000");
  },
  maskedCurrencyFields: function(selector){
    $(selector).autoNumeric('init', { decimalPlacesOverride: 2, currencySymbol : '$', unformatOnSubmit: true});
  },
  maskedPercentFields: function(selector){
    $(selector).autoNumeric('init', { decimalPlacesOverride: 3, allowDecimalPadding: false, minimumValue: '0', maximumValue: '100.00', currencySymbol : '%', currencySymbolPlacement: 's', unformatOnSubmit: true});
  },
  maskedNumberFields: function(selector){
    $(selector).mask('999999999999');
  },
  disableRightMouseClick: function(){
    $(document).on('click contextmenu mouseup', function(e){
      if(e.which == 2 || e.which == 3){e.preventDefault();}
    });
  },
  addTooltip: function(element){
    $('.tooltip').hide();
    $(element).next('i').attr({'data-toggle': 'tooltip', 'data-placement': 'top'});
    $(element).next('i').tooltip();
  },
  closeHeaderMenu: function(){
    $(document).on('click touchstart', function(e){
      if ($(e.target).closest('#header-menu').length === 0) {
        $('#header-menu').removeClass('in');
      }
    });
  }
}
$(document).ready(function(){
  AppZapp.Common.disableRightMouseClick();
  $('.close').click(function(){
    $("#flash-message").hide();
  })
});
$(document).on('turbolinks:load', function(){
  AppZapp.Common.toggleSidebar();
});
