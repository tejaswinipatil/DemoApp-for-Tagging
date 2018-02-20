AppZapp.PreApproval = {
  Calculator: {
    data: {
      loanTypes : {
        CONVENTIONAL: 1,
        FHA: 2,
        VA: 3
      },
      minDownPaymentPercent: 20,
      baseLoanTerm: 15,
      hundred: 100,
      FHAFundingFee: 1.0175,
      monthsPerYear: 12,
      rules: {
        FHA:{
          "0-15": {
            "0-625000":{
              "0-90" :{
                mipPercent: 0.45
              },
              "90.1-*" :{
                mipPercent: 0.70
              }
            },
            "625001-*":{
              "0-78" :{
                mipPercent: 0.45
              },
              "78.01-90" :{
                mipPercent: 0.70
              },
              "90.1-*" :{
                mipPercent: 0.95
              }
            }
          },
          "16-*": {
            "0-625000":{
              "0-95" :{
                mipPercent: 0.80
              },
              "95.1-*" :{
                mipPercent: 0.85
              }
            },
            "625001-*":{
              "0-95" :{
                mipPercent: 1.00
              },
              "95.1-*" :{
                mipPercent: 1.05
              }
            }
          }
        },
        VA:{
          "0": {
            "0-4.999": {fundingPercentage: 2.4},
            "5-9.999": {fundingPercentage: 1.75},
            "10-*": {fundingPercentage: 1.5}
          },
          "1": {
            "0-4.999": {fundingPercentage: 2.15},
            "5-9.999": {fundingPercentage: 1.5},
            "10-*": {fundingPercentage: 1.25}
          },
          "2": {
            "0-4.999": {fundingPercentage: 3.3},
            "5-9.999": {fundingPercentage: 1.75},
            "10-*": {fundingPercentage: 1.5}
          },
          "3": {
            "0-4.999": {fundingPercentage: 3.3},
            "5-9.999": {fundingPercentage: 1.5},
            "10-*": {fundingPercentage: 1.25}
          }
        }
      }
    },
    _isDataRangeMatches: function(dataVal,dataRange){
      if(dataRange.length == 1){
        return (dataVal == parseInt(dataRange[0]));
      }
      if(dataRange[1] == '*'){
        return (dataVal >= parseFloat(dataRange[0]));
      }else{
        return(dataVal >= parseFloat(dataRange[0]) && dataVal <= parseFloat(dataRange[1]));
      }
    },
    _enumerateLoanRules: function(dataValArr, jsonData, returnKey){
      var dataVal = dataValArr.pop();
      for (var key in jsonData){
        if(jsonData.hasOwnProperty(key) && key != returnKey){
          var keyRange = key.split('-');
          if(this._isDataRangeMatches(dataVal,keyRange)){
            if(jsonData.hasOwnProperty(returnKey)){
              return jsonData[returnKey];
            }else{
              return this._enumerateLoanRules(dataValArr, jsonData[key], returnKey);
            }
          }
        }else if(jsonData.hasOwnProperty(returnKey)){
          return jsonData[returnKey];
        }
      }
    },
    getAnnualMIP: function(loanTerm, baseLoanAmount, ltv){
      var FHALoanRulesData = this.data.rules.FHA;
      return this._enumerateLoanRules([ltv,baseLoanAmount,loanTerm], FHALoanRulesData, 'mipPercent');
    },
    getFundingPercentage: function(usingFirstTimeAndisReservist, downPayment){
      var VALoanRuleData = this.data.rules.VA;
      return this._enumerateLoanRules([downPayment,usingFirstTimeAndisReservist], VALoanRuleData, 'fundingPercentage');
    },
    getLTV: function(baseLoanAmount, salesPrice){
      return (baseLoanAmount/salesPrice) * this.data.hundred;
    },
    getNetLoanAmount: function(baseLoanAmount){
      return baseLoanAmount * this.data.FHAFundingFee;
    },
    getLoanAmountForVA: function(loanAmount, fundingPercentage){
      return loanAmount * (1 + (fundingPercentage / this.data.hundred));
    },
    getAnnaulTaxes: function(salesPrice){
      return salesPrice * (1.2 / this.data.hundred);
    },
    getAnnualInsurancePremium: function(loanAmount){
      return loanAmount * (0.25 / this.data.hundred);
    },
    calculateLoanAmount: function(salesPrice, minimumDownPayment){
      return salesPrice - (salesPrice * (minimumDownPayment / this.data.hundred));
    },
    totalMonthlyMI: function(loanAmount, miFactor){
      return ((loanAmount * miFactor) / this.data.hundred) / this.data.monthsPerYear;
    }
  },
  calculationForConventionalLoan: function(event){
    if(event.target.id == "deal_loan_type" || event.target.id == "deal_minimal_down_payment"){
      AppZapp.Common.maskedPercentFields('#deal_minimal_down_payment');
      var downPayment = parseFloat($('#deal_minimal_down_payment').autoNumeric('get'));
      var loantype = parseInt($('#deal_loan_type :selected').val());
      if(loantype == this.Calculator.data.loanTypes.CONVENTIONAL){
        if(downPayment != "" || downPayment != 0){
          if(downPayment < this.Calculator.data.minDownPaymentPercent){
            $('.mi-factor').css("cssText", "display: none !important;");
            $('#mortgageModal').modal({
              backdrop: 'static',
              keyboard: false
            });
          }
          else{
            $('.mi-factor').css("cssText", "display: none !important;");
          }
        }
        else if(downPayment == 0){
          $('.mi-factor').css("cssText", "display: none !important;");
            $('#mortgageModal').modal({
              backdrop: 'static',
              keyboard: false
            });
        }
      }
    }
  },
  calculationFHALoanAmount: function(){
    AppZapp.Common.maskedCurrencyFields('#deal_sales_price, #deal_loan_amount');
    var salesPrice = parseFloat($('#deal_sales_price').autoNumeric('get'));
    var baseLoanAmount = parseFloat(window.localStorage.getItem('baseLoanAmount'));
    var ltv = this.Calculator.getLTV(baseLoanAmount, salesPrice);
    var loanTerm = parseFloat($('#deal_loan_term').val());
    window.localStorage.setItem('annualMIP', this.Calculator.getAnnualMIP(loanTerm, baseLoanAmount, ltv));
    $('#deal_annual_mip').val(window.localStorage.getItem('annualMIP'));
  },
  setFHANetLoanAmount: function(){
    AppZapp.Common.maskedCurrencyFields('#deal_loan_amount');
    var baseLoanAmount = parseFloat($('#deal_loan_amount').autoNumeric('get'));
    window.localStorage.setItem('baseLoanAmount', baseLoanAmount);
    window.localStorage.setItem('netLoanAmount', this.Calculator.getNetLoanAmount(baseLoanAmount));
    $('#deal_loan_amount').val(window.localStorage.getItem('netLoanAmount'));
    $('#deal_base_loan_amount').val(window.localStorage.getItem('baseLoanAmount'));
  },
  calculateFundingPercentage: function(usingFirstTime,isReservist,fundingPercentage, downPayment){
    $('#deal_using_first_time').val(window.localStorage.getItem("usingFirstTime"));
    $('#deal_is_reservist').val(window.localStorage.getItem("isReservist"));
    AppZapp.Common.maskedCurrencyFields('#deal_minimal_down_payment');
    var downPayment = parseFloat($('#deal_minimal_down_payment').autoNumeric('get'));
    if(downPayment == undefined){
      downPayment = 0;
    }
    var fundingPercentage;
    if(usingFirstTime && isReservist){
      fundingPercentage = this.Calculator.getFundingPercentage(0, downPayment);
    }else if(usingFirstTime && !isReservist){
      fundingPercentage = this.Calculator.getFundingPercentage(1, downPayment);
    }else if(!usingFirstTime && isReservist){
      fundingPercentage = this.Calculator.getFundingPercentage(2, downPayment);
    }else if(!usingFirstTime && !isReservist){
      fundingPercentage = this.Calculator.getFundingPercentage(3, downPayment);
    }
    window.localStorage.setItem("fundingPercentage", fundingPercentage);
    if(window.localStorage.getItem("fundingPercentage") != undefined){
      $('#deal_funding_percentage').val(window.localStorage.getItem("fundingPercentage"));
    }
  },
  addFundingPercentage: function(){
    AppZapp.Common.maskedCurrencyFields('#deal_loan_amount');
    var loanAmount = parseFloat($('#deal_loan_amount').autoNumeric('get'));
    var fundingPercentage = window.localStorage.getItem("fundingPercentage");
    window.localStorage.setItem('calculateLoanAmount', this.Calculator.getLoanAmountForVA(loanAmount, fundingPercentage));
    $('#deal_loan_amount').val(window.localStorage.getItem('calculateLoanAmount'));
  },
  submitOnValidate: function(action){
    if((action == "edit" || action == "update") && $('#deal_user_email').val() == window.localStorage.getItem('currentEmail')){
      $('#deal_user_email').rules('remove', 'remote');
    }
    else{
      $('#deal_user_email').rules('add', {
        'remote': {
          url: '/buyer_email_exists',
          type: 'get',
          data: {user: {action: action}}
        },
        messages: {
          remote: 'This email address already exists.'
        }
      });
    }
  },
  editBuyerProfileAddRule: function(action){
    if((action == "edit" || action == "update" )&& $('#user_email').val() == window.localStorage.getItem('currentEmail')){
      $('#user_email').rules('remove', 'remote');
    }
    else{
      $('#user_email').rules('add', {
        'remote': {
          url: '/buyer_email_exists',
          type: 'get',
          data: {user: {action: action}}
        },
        messages: {
          remote: 'This email address already exists.'
        }
      });
    }
  },
  afterSubmitCheckLoanType: function(loantype){
    if($('#deal_mi_factor').is(':hidden')){
      $('#deal_mi_factor').val('');
    }
    if(this.checkValidForm()){
      var loanType = parseInt(loantype);
      if(loanType == this.Calculator.data.loanTypes.CONVENTIONAL){
        $('#deal_annual_mip').val('');
        $('#deal_base_loan_amount').val('');
        $('#deal_is_reservist').val('');
        $('#deal_using_first_time').val('');
        $('#deal_funding_percentage').val('');
      }
      else if(loanType == this.Calculator.data.loanTypes.FHA){
        $('#deal_is_reservist').val('');
        $('#deal_using_first_time').val('');
        $('#deal_funding_percentage').val('');
        if($('#calculate_payment').val() == undefined){
          if($('#deal_loan_amount').val() != window.localStorage.getItem('loanAmount')){
            this.setFHANetLoanAmount();
          }
        }
        this.calculationFHALoanAmount();
      }
      else if(loanType == this.Calculator.data.loanTypes.VA){
        $('#deal_annual_mip').val('');
        $('#deal_base_loan_amount').val('');
        if($('#calculate_payment').val() == undefined){
          if($('#deal_loan_amount').val() != window.localStorage.getItem('loanAmount')){
            this.addFundingPercentage();
          }
        }
      }
    }
  },
  monitorRates: function(){
    if(this.checkValidForm()){
      $('#myModal').modal('hide');
      $('#monitorRatesModal').modal('show');
    }
  },
  triggerOnCondition: function(){
    $('#btn-yes, #btn-no').on('click', function(event){
      if(event.target.id == "btn-yes"){
        $('#rate_admin').val(true);
      }
      $('#monitorRatesModal').modal('hide');
      $('#buyer_form').submit();
    });
  },
  checkForLoanAmount: function(){
    AppZapp.Common.maskedCurrencyFields('#monthly_payment')
    if(parseInt($('#monthly_payment').autoNumeric('get')) > parseInt(window.localStorage.getItem('maxQualifyingMonthlyPayment'))){
      $('#loanAmountModal').modal();
      $('#calculate').prop('disabled', true);
    }else{
      $('#calculate').prop('disabled', false);
      $('#calculate_payment').submit();
    }
  },
  checkValidForm: function(){
    if($('#buyer_form').val() != undefined){
      if($('#buyer_form').valid()){
        return true
      }
    }else if($('#calculate_payment').val() != undefined){
      if($('#calculate_payment').valid()){
        return true
      }
    }else{
      return false
    }
  },
  resetGlobalVariables: function(){
    window.localStorage.clear();
  },
  resetGlobalItemOnEdit: function(action){
    if(action == "edit" || action == "update"){
      var loantype = parseInt($('#deal_loan_type').val());
      if(loantype == this.Calculator.data.loanTypes.CONVENTIONAL){
        var calculateLoanAmount = parseFloat($('#deal_loan_amount').val());
        window.localStorage.setItem('calculateLoanAmount', calculateLoanAmount);
      }else if(loantype == this.Calculator.data.loanTypes.FHA){
        var annualMIP = $('#deal_annual_mip').val();
        var baseLoanAmount = $('#deal_base_loan_amount').val();
        var netLoanAmount = parseFloat($('#deal_loan_amount').val());
        window.localStorage.setItem('netLoanAmount', netLoanAmount);
        window.localStorage.setItem('annualMIP', annualMIP);
        window.localStorage.setItem('baseLoanAmount', baseLoanAmount);
      }else if(loantype == this.Calculator.data.loanTypes.VA){
        var isReservist = $('#deal_is_reservist').val();
        var usingFirstTime = $('#deal_using_first_time').val();
        var fundingPercentage = $('#deal_funding_percentage').val();
        var calculateLoanAmount = parseFloat($('#deal_loan_amount').val());
        window.localStorage.setItem('calculateLoanAmount', calculateLoanAmount);
        window.localStorage.setItem('isReservist', isReservist);
        window.localStorage.setItem('usingFirstTime', usingFirstTime);
        window.localStorage.setItem('fundingPercentage', fundingPercentage);
      }
    }
  },
  calculateAsPerLoanType: function(event){
    if(event.target.id == "deal_sales_price"){
      AppZapp.Common.maskedCurrencyFields('#deal_sales_price')
      AppZapp.Common.maskedPercentFields('#deal_minimal_down_payment')
      var minimumDownPayment = parseFloat($('#deal_minimal_down_payment').autoNumeric('get'));
      var salesPrice = parseFloat($('#deal_sales_price').autoNumeric('get'));
      var loantype = parseInt($('#deal_loan_type').val());
      var calculateLoanAmount = this.Calculator.calculateLoanAmount(salesPrice, minimumDownPayment);
      window.localStorage.setItem('calculateLoanAmount', calculateLoanAmount)
      $('#deal_annual_tax_rate').autoNumeric('set', this.Calculator.getAnnaulTaxes(salesPrice));
      $('#deal_annual_insurance_premium').autoNumeric('set', this.Calculator.getAnnualInsurancePremium(calculateLoanAmount));
      if(loantype == this.Calculator.data.loanTypes.CONVENTIONAL)
      {
        $('#deal_loan_amount').autoNumeric('set', window.localStorage.getItem('calculateLoanAmount'));
      }
      else if(loantype == this.Calculator.data.loanTypes.FHA)
      {
        window.localStorage.setItem('baseLoanAmount', calculateLoanAmount);
        var baseLoanAmount = parseFloat(window.localStorage.getItem('baseLoanAmount'));
        window.localStorage.setItem('netLoanAmount', this.Calculator.getNetLoanAmount(baseLoanAmount));
        $('#deal_loan_amount').autoNumeric('set', window.localStorage.getItem('netLoanAmount'));
        $('#deal_base_loan_amount').val(window.localStorage.getItem('baseLoanAmount'));
      }
      else if(loantype == this.Calculator.data.loanTypes.VA)
      {
        var usingFirstTime = $('#deal_using_first_time').val() == "true";
        window.localStorage.setItem('usingFirstTime', usingFirstTime);
        var isReservist = $('#deal_is_reservist').val() == "true";
        window.localStorage.setItem('isReservist', isReservist);
        var fundingPercentage = $('#deal_funding_percentage').val();
        this.calculateFundingPercentage(usingFirstTime, isReservist, fundingPercentage, minimumDownPayment);
        var loanAmount = window.localStorage.getItem('calculateLoanAmount');
        var fundingPercentage = window.localStorage.getItem("fundingPercentage");
        window.localStorage.setItem('calculateLoanAmount', this.Calculator.getLoanAmountForVA(loanAmount, fundingPercentage));
        $('#deal_loan_amount').autoNumeric('set', window.localStorage.getItem('calculateLoanAmount'));
      }
    }
  }
}
