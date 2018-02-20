AppZapp.RateAdmin = {
  getRate: function(){
    $('#update_rate_loan_type').on('change', function(){
      if($(this).val()){
        $.ajax({
          url: '/get_rate',
          data: {loan_type: $(this).val()},
          dataType: 'json',
          success: function(rate){
            $('#confirm_rate').prop('disabled', false);
            $('#update_rate_rate').prop('disabled', false);
            $('#old_unchaged_rate').val(rate);
            if(rate <= 0){
              $('#change_rate_sign').prop('checked', false);
              rate = Math.abs(rate);
            }
            else{
              $('#change_rate_sign').prop('checked', true);
              rate = rate;
            }
            $('#update_rate_rate').autoNumeric('set', rate)
          }
        });
      }
      else{
        $('#confirm_rate').prop('disabled', true);
        $('#update_rate_rate').prop('disabled', true);
        $('#update_rate_rate').val('');
        $('#old_unchaged_rate').val('');
      }
    });
  },
  confirmRateChange: function(){
    $('#confirm_rate').on('click', function(e){
      e.preventDefault();
      AppZapp.RateAdmin.maskedPercentField('#update_rate_rate');
      var loan_type = $('#update_rate_loan_type').val();
      var new_rate = parseFloat($('#update_rate_rate').autoNumeric('get'));
      var rate_value = parseFloat($('#update_rate_rate').autoNumeric('get'));
      var old_rate = parseFloat($('#old_unchaged_rate').val());
      var rate_change;

      if(new_rate >= 0){
        if(new_rate == 0){
          rate_change = 'update';
        }
        else if($('#change_rate_sign').is(':checked')){
          rate_change = 'increase';
        }
        else{
          rate_change = 'decrease';
          new_rate*=-1;
        }
        $('#update_rate_new_rate').val(new_rate);
        var msg = 'This will '+rate_change+' the '+loan_type+' rate by '+rate_value+'%. Please confirm this is accurate';
        $('.modal-body p').html(msg);
        $('#rate_confirmation').modal();
      }
      else{
        $('#confirm_rate_change').prop('disabled', true);
      }
    });
  },
  maskedPercentField: function(selector){
    $(selector).autoNumeric('init', { decimalPlacesOverride: 3, allowDecimalPadding: false, minimumValue: '0', maximumValue: '20.00', currencySymbol : '%', currencySymbolPlacement: 's', unformatOnSubmit: true});
  }
}
