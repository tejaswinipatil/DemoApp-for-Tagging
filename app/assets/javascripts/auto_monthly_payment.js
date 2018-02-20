AppZapp.autoMonthlyPayment = {
  calculate: function(action, loan_amount, loan_type){
    AppZapp.Common.maskedCurrencyFields('#deal_sales_price, #deal_annual_tax_rate, #deal_annual_insurance_premium');
    AppZapp.Common.maskedPercentFields('#deal_interest_rate, #deal_mi_factor, #deal_minimal_down_payment')
    var minimumDownPayment = $('#deal_minimal_down_payment').autoNumeric('get');
    var salesPrice = $('#deal_sales_price').autoNumeric('get');
    var loanTerm = $('#deal_loan_term').val();
    var loanAmount = $('#deal_loan_amount').val();
    var annualTaxes = $('#deal_annual_tax_rate').autoNumeric('get');
    var annualInsurancePremium = $('#deal_annual_insurance_premium').autoNumeric('get');
    var interestRate = $('#deal_interest_rate').autoNumeric('get');
    var loanType = $('#deal_loan_type').val();
    if(action == "edit" || action == "update"){
      var hoaDues = $('#deal_hoa_dues').val();
    }
    if(parseInt(loanType) == AppZapp.PreApproval.Calculator.data.loanTypes.CONVENTIONAL){
      if($('#deal_mi_factor').is(':hidden')){
      }else{
        var miFactor = $('#deal_mi_factor').autoNumeric('get');
      }
    }
    else if(parseInt(loanType) == AppZapp.PreApproval.Calculator.data.loanTypes.FHA){
      var baseLoanAmount = AppZapp.PreApproval.Calculator.calculateLoanAmount(parseFloat(salesPrice), parseFloat(minimumDownPayment))
      if(baseLoanAmount != parseFloat(loan_amount) || parseInt(loan_type) != parseInt(loanType)){
        var loanAmount = AppZapp.PreApproval.Calculator.getNetLoanAmount(baseLoanAmount)
      }
      var ltv = AppZapp.PreApproval.Calculator.getLTV(baseLoanAmount, parseFloat(salesPrice));
      var annualMIP = AppZapp.PreApproval.Calculator.getAnnualMIP(parseFloat(loanTerm), baseLoanAmount, ltv)
    }
    else if(parseInt(loanType) == AppZapp.PreApproval.Calculator.data.loanTypes.VA){
      if(loanAmount != parseFloat(loan_amount) || parseInt(loan_type) != parseInt(loanType)){
        var fundingPercentage = window.localStorage.getItem("fundingPercentage");
        var loanAmount = AppZapp.PreApproval.Calculator.getLoanAmountForVA(parseFloat(loanAmount), fundingPercentage);
      }
    }
    $.ajax({
      url: '/monthly_payment_for_loan_officer',
      data: {
        sales_price: salesPrice,
        loan_term: loanTerm,
        loan_type: loanType,
        mi_factor: miFactor,
        base_loan_amount: baseLoanAmount,
        loan_amount: loanAmount,
        interest_rate: interestRate,
        annual_tax_rate: annualTaxes,
        annual_insurance_premium: annualInsurancePremium,
        annual_mip: annualMIP,
        hoa_dues: hoaDues
      },
      dataType: 'script',
      success: function(data){
        var autoPopulate = parseFloat(JSON.parse(data));
        $('#monthly_payment').autoNumeric('set', autoPopulate);
        var maxQualifyingMonthlyPayment = parseFloat($('#deal_max_qualifying_monthly_payment').autoNumeric('get'));
        if($('#max_monthly_change').val() == "false"){
          $('#deal_max_qualifying_monthly_payment').autoNumeric('set', autoPopulate);
        }
        if(autoPopulate != maxQualifyingMonthlyPayment){
          $('#deal_manually_changed_max_monthly_payment').val(true);
        }else{
          $('#deal_manually_changed_max_monthly_payment').val(false);
        }
      }
    });
  }
}