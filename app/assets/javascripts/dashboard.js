AppZapp.Users = {
  dashboard: {
    searchByFirstName: function(){
      $('#search_name').on('keyup', function(){
        if($(this).val().length >= 3 || $(this).val().length == 0){
          $.ajax({
            url: '/',
            data: {
              search: $('#search_name').val(),
              deal: $('#Deal').val()
            },
            dataType: 'script'
          });
        }
      });
    },
    dealFilter: function(action){
      $('#Deal').on("select2:select", function(){
        $.ajax({
          url: '/',
          data: {
            search: $('#search_name').val(),
            deal: $('#Deal').val()
          },
          dataType: 'script'
        });
      });
    },
    reinitializeSelect2: function(selector){
      if($(selector).data('select2') == undefined && $(selector).next().hasClass('select2-container')){
        $(selector).next().remove();
      }
      $(selector).select2();
    },
    selectAllStates: function(){
      $('#states_licensed').on('click', function(){
        if($('#states_licensed').is(':checked')){
          $('#user_loan_officer_profile_states_licensed > option').prop('selected', true);
          $('#user_loan_officer_profile_states_licensed').trigger('change');
        }
        else{
          $('#user_loan_officer_profile_states_licensed > option').prop('selected', false);
          $('#user_loan_officer_profile_states_licensed').trigger('change');
        }
      });
      $('#user_loan_officer_profile_states_licensed').on('select2:unselect', function(){
        if($('#states_licensed').is(':checked')){
          $('#states_licensed').prop('checked', false);
        }
      });
      $('#user_loan_officer_profile_states_licensed').on('select2:select', function(){
        AppZapp.Users.dashboard.selectAllStatesOnEdit();
      });
      this.selectAllStatesOnEdit();
    },
    selectAllStatesOnEdit: function(){
      var options = $('#user_loan_officer_profile_states_licensed > option').length;
      var selected = $('#user_loan_officer_profile_states_licensed > option:selected').length;
      if(options == selected){
        $('#states_licensed').prop('checked', true);
      }
    },
    selectAllBuyers: function(){
      $('#select_all_buyers').on('click', function(){
        if($(this).is(':checked')){
          $('.select_buyers_body :checkbox').prop('checked', true);
        }else{
          $('.select_buyers_body :checkbox').prop('checked', false);
        }
      });
    },
    updateInterestRate: function(){
      $('#update_interest_rate').on('click', function(){
        var checkedBuyers = []
        if($("input[name='buyers[]']:checked").length > 0){
          $("input[name='buyers[]']:checked").each(function()
          {
            checkedBuyers.push(parseInt($(this).val()));
            $('#interest_rate_modal').modal();
            $('#buyers').val(checkedBuyers);
          });
        }
        else{
          alert('Please Select Buyers.');
        }
      });

      $("input[name='buyers[]']").on('change', function(){
        if($("input[name='buyers[]']").length == $("input[name='buyers[]']:checked").length){
            $('#select_all_buyers').prop('checked', true);
          }
          else{
            $('#select_all_buyers').prop('checked', false);
          }
      });
    },
    calculateMonthlyPayment: function(){
      AppZapp.Common.maskedCurrencyFields('#deal_sales_price, #deal_loan_amount, #deal_annual_tax_rate, #deal_annual_insurance_premium, #deal_hoa_dues');
      var salesPrice = parseFloat($('#deal_sales_price').autoNumeric('get'));
      var loanAmount = parseFloat($('#deal_loan_amount').autoNumeric('get'));
      var annualTaxes = parseFloat($('#deal_annual_tax_rate').autoNumeric('get'));
      var annualInsurancePremium = parseFloat($('#deal_annual_insurance_premium').autoNumeric('get'));
      var annualMIP = $('#deal_annual_mip').val();
      if($('#deal_hoa_dues').is(':visible')){
        var hoaDues = parseFloat($('#deal_hoa_dues').autoNumeric('get'));
      }else{
        var hoaDues = NaN;
      }
      var interestRate = $('#deal_interest_rate').val();
      $.ajax({
        url: '/calculate_monthly_payment',
        data: {
          sales_price: salesPrice,
          loan_amount: loanAmount,
          annual_tax_rate: annualTaxes,
          annual_insurance_premium: annualInsurancePremium,
          annual_mip: annualMIP,
          interest_rate: interestRate,
          hoa_dues: hoaDues
        },
        dataType: 'script',
        success: function(data){
          $('#monthly_payment').autoNumeric('set', parseFloat(JSON.parse(data)));
        }
      });
    },
    showArchivedDeals: function(){
      var url = window.location.href;
      var deal_type = url.split('=')[1]
      if(deal_type){
        $('#Deal').val(deal_type);
        $('.select_buyers_head').remove();
        $('.select_buyers_body').remove();
        $('#update_interest_rate').hide();
      }
    },
    showPreApprovalModal: function(){
      $('#pre_match_modal').on('click', function(e){
        $('#preApprovalMatchModal').modal();
      });
      $('#realtorsModal').on('hidden.bs.modal', function(){
        $('#preApprovalPdfBtn').prop('disabled', false);
      });
    }
  }
}
$(document).ready(function() {
  AppZapp.Users.dashboard.searchByFirstName();
  AppZapp.Users.dashboard.dealFilter();
  AppZapp.Users.dashboard.reinitializeSelect2('.deal-dropdown');
})