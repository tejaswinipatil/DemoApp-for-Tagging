AppZapp.User = {
  Validation: {
    noSpaceValidationMethod: function(){
      jQuery.validator.addMethod('noSpace', function(value, element) {
        return value.indexOf(' ') < 0 && value != '';
      });
    },
    passwordComplexityMethod: function(){
      jQuery.validator.addMethod('passwordComplexity', function(value, element){
        var pattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{6,128}$/);
        return pattern.test(value);
      }, 'must include at least one lowercase letter, one uppercase letter, one digit and one special character');
    },
    validateEmailMethod: function(){
      jQuery.validator.addMethod('validateEmail', function(value, element) {
       var pattern = new RegExp("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");
       return pattern.test(value);
      }, 'Please Enter Valid Email address');
    },
    removeRateAdminBuyerValidation: function(){
      $('#remove_rate_admin_buyer_form').validate({
        rules: {
          'interest_rate': 'required'
        },
        messages: {
          'interest_rate': 'Please enter interest rate.'
        },
        errorPlacement: function(error, element){
          $(element).next('i').attr('title', error.text());
          AppZapp.Common.addTooltip(element);
        },
        highlight: function(element){
          $(element).removeClass('valid').addClass('error');
          $(element).next('i').remove();
          $(element).after("<i class='fa fa-info-circle errspan'></i>");
        },
        unhighlight: function(element){
          $(element).removeClass('error').addClass('valid');
          $(element).next('i').remove();
          $(element).next('.tooltip').tooltip('hide');
        }
      });
    },
    buyerValidation: function(){
      $('#deal_loan_type').on('select2:select', function(){$(this).valid()});
      $("#buyer_form").validate({
        ignore: [],
        rules: {
          "deal[user][email]": {
            required: true,
            email: true,
            validateEmail: true,
          },
          "deal[buyer_profile][first_name]": "required",
          "deal[buyer_profile][last_name]": "required",
          "deal[minimal_down_payment]": "required",
          "deal[loan_type]": "required",
          "deal[interest_rate]": "required",
          "deal[loan_term]": "required",
          "deal[max_qualifying_monthly_payment]": "required",
          "deal[sales_price]": "required"
        },
        messages: {
          "deal[user][email]": {
            required: "Please enter your email.",
            email: 'Please enter valid email.'
          },
          "deal[buyer_profile][first_name]": "Please enter your first name.",
          "deal[buyer_profile][last_name]": "Please enter your last name.",
          "deal[minimal_down_payment]": "Please enter minimum down payment.",
          "deal[loan_type]": "Please select loan type.",
          "deal[interest_rate]": "Please enter interest rate.",
          "deal[loan_term]": "Please enter loan Term.",
          "deal[max_qualifying_monthly_payment]": "Please enter max qualifying monthly payment.",
          "deal[sales_price]": "Please enter sales price."
        },
        errorPlacement: function(error, element) {
          $(element).next('i').attr('title', error.text());
          AppZapp.Common.addTooltip(element);
        },
        highlight: function(element){
          $(element).removeClass('valid').addClass('error');
          $(element).next('i').remove();
          $(element).after("<i class='fa fa-info-circle errspan'></i>");
          if($(element).is('#deal_loan_type')){
            $(element).next('i').remove();
            $('#deal_loan_type').select2({containerCssClass: 'error'});
          }
        },
        unhighlight: function(element){
          $(element).removeClass('error').addClass('valid');
          $(element).next('i').remove();
          $(element).next('.tooltip').tooltip('hide');
          if($(element).is('#deal_loan_type')){
            $('#deal_loan_type').select2({containerCssClass: ''});
          }
        }
      });
      AppZapp.User.Validation.validateEmailMethod();
    },
    loanOfficerValidation: function(action){
      $('#user_loan_officer_profile_state').on('select2:select', function(){$(this).valid()});
      $('#new_user').validate({
        ignore: [],
        rules: {
          'user[image]': {
            accept: 'image/jpg,image/jpeg,image/png',
            file_size: true
          },
          "user[loan_officer_profile][first_name]": "required",
          "user[loan_officer_profile][last_name]": "required",
          "user[loan_officer_profile][signature]": {
            accept: "image/jpg,image/jpeg,image/png",
            file_size: true,
            check_signature_file: true
          },
          "user[loan_officer_profile][nmls_id]": {
            required: true,
            number: true,
            maxlength: 12,
            remote: {
              url: '/check_uniq_nmls',
              type: 'get',
              data: {nmls: {action: action}}
            }
          },
          "user[loan_officer_profile][company_name]": "required",
          "user[loan_officer_profile][corporate_nmls]": {
            required: true,
            number: true,
            maxlength: 12
          },
          "user[loan_officer_profile][phone]": "required",
          "user[loan_officer_profile][website]": {
            required: true,
            check_url: true
          },
          "user[loan_officer_profile][logo]": {
            accept: "image/jpg,image/jpeg,image/png",
            file_size: true,
            check_logo_file: true
          },
          "user[loan_officer_profile][company_address]": "required",
          "user[email]": {
            required: true,
            email: true,
            validateEmail: true,
            remote: {
              url: '/email_exists',
              type: 'get',
              data: {nmls: {action: action}}
            }
          },
          "user[password]": {
            required: true,
            minlength: 6,
            noSpace: true,
            passwordComplexity: true
          },
          "user[password_confirmation]": {
            required: true,
            minlength: 6,
            equalTo: "#user_password",
            noSpace: true
          },
          'user[loan_officer_profile][suite]': {number: true},
          'user[loan_officer_profile][address]': 'required',
          'user[loan_officer_profile][city]': 'required',
          'user[loan_officer_profile][state]': 'required',
          'user[loan_officer_profile][zip]': {required: true, noSpace: true, number: true, maxlength: 5}
        },
        messages: {
          'user[image]': {
            accept: 'Not a valid file type. Please only upload PNG or JPEG files'
          },
          "user[loan_officer_profile][first_name]": "Please enter your first name.",
          "user[loan_officer_profile][last_name]": "Please enter your last name.",
          "user[loan_officer_profile][signature]": {
            required: "Please upload signature file.",
            accept: 'Not a valid file type. Please only upload PNG or JPEG files'
          },
          "user[loan_officer_profile][nmls_id]": {
            required: "Please enter NMLS ID.",
            number: "Please enter only numbers.",
            maxlength: "Please enter between 12 digits.",
            remote: "Your account cannot be created because the NMLS ID you have entered is issued to another account.  Please contact us with any questions. support@Appruv.me  (347) 903-3280"
          },
          "user[loan_officer_profile][company_name]": {
            required: "Please enter company name."
          },
          "user[loan_officer_profile][corporate_nmls]": {
            required: "Please enter corporate NMLS.",
            number: "Please enter only numbers.",
            maxlength: "Please enter between 12 digits."
          },
          "user[loan_officer_profile][phone]": "Please enter your phone number.",
          "user[loan_officer_profile][website]": {
            required: "Please enter website url."
          },
          "user[loan_officer_profile][logo]": {
            required: "Please upload logo image.",
            accept: 'Not a valid file type. Please only upload PNG or JPEG files'
          },
          "user[loan_officer_profile][company_address]": "Please enter your company address.",
          "user[email]": {
            required: "Please enter your email.",
            email: "Please enter valid email.",
            remote: 'The email address entered is already registered to another user. Please use a different email address.'
          },
          "user[password]": {
            required: "Please enter password.",
            minlength: "Six or more total characters"
          },
          "user[password_confirmation]": {
            required: "Please re-enter password.",
            minlength: "Six or more total characters",
            equalTo: "Please enter the same password again"
          },
          'user[loan_officer_profile][suite]': {number: 'Enter numeric value only.'},
          'user[loan_officer_profile][address]': 'Please enter address.',
          'user[loan_officer_profile][city]': 'Please enter city.',
          'user[loan_officer_profile][state]': 'Please enter state.',
          'user[loan_officer_profile][zip]': {required: 'Please enter zipcode.', noSpace: 'Empty space is not allowed in zip.', maxlength: 'Please enter 5 digit number.', number: 'Enter numeric value only.'}
        },
        errorPlacement: function(error, element) {
          $(element).next('i').attr('title', error.text());
          AppZapp.Common.addTooltip(element);
        },
        highlight: function(element) {
          $(element).removeClass('valid').addClass('error');
          $(element).next('i').remove();
          $(element).after("<i class='fa fa-info-circle errspan'></i>");
          if($(element).is('#user_loan_officer_profile_state')){
            $(element).next('i').remove();
            $('#user_loan_officer_profile_state').select2({containerCssClass: 'error'});
          }
        },
        unhighlight: function(element) {
          $(element).removeClass('error').addClass('valid');
          $(element).next('i').remove();
          $(element).next('.tooltip').tooltip('hide');
          if($(element).is('#user_loan_officer_profile_state')){
            $(element).select2({containerCssClass: ''});
          }
        },
        invalidHandler: function(event, validater){
          var errors = [];
          var errorList = validater.errorList;
          $.each(errorList, function(index, value){
            if(value.method == 'required'){
              errors.push(value.element.getAttribute('validate_name'));
            }
          });
          if(errors.length > 0){
            var message = "Uh Oh! Please complete "+errors.join(', ')+" to proceed"
            if(action == 'edit'){
              $('#navbar').next('.body-msg').html("<div class='col-xs-12 mar-btm-15'><div class='box-body'><div class='alert alert-danger alert-dismissable dynamic-flash-msg'><ul class='flash-ul'>"+message+"</ul></div></div></div>"); 
            }
            else{
              $('#fls-msg').html("<div class='col-xs-12 mar-btm-15'><div class='box-body'><div class='alert alert-danger alert-dismissable dynamic-flash-msg'><ul class='flash-ul'>"+message+"</ul></div></div></div>");
            }
          }
        }
      });
      jQuery.validator.addMethod("check_url", function(val, elem) {
        var URLREGEXPATERN = /((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\.\/\?\:@\-_=#])*/i.test(val);
        if (val.length == 0) { return true; }
        return URLREGEXPATERN;
        }, "Please enter valid URL");
      jQuery.validator.addMethod("file_size", function(val, elem){
        if($(elem)[0].files[0] != undefined){
          var file_size = $(elem)[0].files[0].size;
          if(file_size>(1024 * 1024 * 5)) {
            return false;
          }
          return true;
        }else{
          return true;
        }
      }, "Please select files upto 5MB of size.");
      jQuery.validator.addMethod('check_signature_file', function(val, elem){
        var signature = $('#signature_preview').attr('src');
        if($('#user_loan_officer_profile_upload_signature_later').is(':checked')){
          return true 
        }
        else{
          if(signature.indexOf('/uploads') >= 0 || signature.indexOf('data:image') >=0)
          {
            return true
          }
          else{
            return false
          }
        }
      }, "Please upload signature file");
      jQuery.validator.addMethod('check_logo_file', function(val, elem){
        var signature = $('#logo_preview').attr('src');
        if($('#user_loan_officer_profile_upload_logo_later').is(':checked')){
          return true 
        }
        else{
          if(signature.indexOf('/uploads') >= 0 || signature.indexOf('data:image') >=0)
          {
            return true
          }
          else{
            return false
          }
        }
      }, "Please upload logo file");
      AppZapp.User.Validation.noSpaceValidationMethod();
      AppZapp.User.Validation.validateEmailMethod();
      AppZapp.User.Validation.passwordComplexityMethod();
    },
    nmlsIdVisibilityPopUp: function(){
      $.ajax({
        url: '/check_uniq_nmls',
        data: {user: {loan_officer_profile: {nmls_id: $('#user_loan_officer_profile_nmls_id').val()}}, nmls: {action: 'new'}},
        dataType: 'script',
        success: function(data){
          response = JSON.parse(data)
          if(response == false){
            $('#nmls_modal').modal('show');
          }
        }
      });
    },
    changePasswordValidation: function(){
      $('#edit_user_password').validate({
        rules: {
          "user[password]": {
            required: true,
            minlength: 6,
            noSpace: true,
            passwordComplexity: true
          },
          "user[password_confirmation]": {
            minlength: 6,
            equalTo: "#user_password"
          },
          "user[current_password]": {
            required: true,
            noSpace: true
          }
        },
        messages: {
          "user[password]": {
            required: "Please enter new password.",
            minlength: "Six or more total characters",
            noSpace: 'Empty space is not allowed in new password'
          },
          "user[password_confirmation]": {
            minlength: "Six or more total characters",
            equalTo: "Please enter the same password again"
          },
          "user[current_password]": {
            required: "Please enter your current password.",
            noSpace: 'Empty space is not allowed in current password'
          }
        },
        errorPlacement: function(error, element) {
          $(element).next('i').attr('title', error.text());
          AppZapp.Common.addTooltip(element);
        },
        highlight: function(element) {
          $(element).removeClass('valid').addClass('error');
          $(element).next('i').remove();
          $(element).after("<i class='fa fa-info-circle errspan'></i>");
        },
        unhighlight: function(element) {
          $(element).removeClass('error').addClass('valid');
          $(element).next('i').remove();
          $(element).next('.tooltip').tooltip('hide');
        }
      });
      AppZapp.User.Validation.noSpaceValidationMethod();
      AppZapp.User.Validation.passwordComplexityMethod();
    },
    forgotPasswordValidation: function(){
      $('#forgot_password').validate({
        rules: {
          'user[email]': {
            required: true,
            email: true,
            validateEmail: true
          },
        },
        messages: {
          'user[email]': {
            required: 'Please enter Email address',
            email: 'Please Enter Valid Email address',
          }
        },
        errorPlacement: function(error, element){
          $(element).next('i').attr('title', error.text());
          AppZapp.Common.addTooltip(element);
        },
        highlight: function(element){
          $(element).removeClass('valid').addClass('error');
          $(element).next('i').remove();
          $(element).after("<i class='fa fa-info-circle errspan'></i>");
        },
        unhighlight: function(element){
          $(element).removeClass('error').addClass('valid');
          $(element).next('i').remove();
        }
      });
      AppZapp.User.Validation.validateEmailMethod();
    },
    editBuyerFormValidation: function(){
      $('#edit_buyer_form').validate({
        ignore: [],
        rules: {
          "user[buyer_profile][first_name]": "required",
          "user[buyer_profile][last_name]": "required",
          "user[email]": {
            required: true,
            email: true
          },
          "user[image]": {
            accept: "image/jpg,image/jpeg,image/png",
            file_size: true
          }
        },
        messages:{
          "user[buyer_profile][first_name]": "Please enter your first name.",
          "user[buyer_profile][last_name]": "Please enter your last name.",
          "user[email]":{
            required: "Please enter your email.",
            email: "Please enter valid email."
          },
          "user[image]": {
            accept: 'Not a valid file type. Please only upload PNG or JPEG files'
          }
        },
        errorPlacement: function(error, element) {
          $(element).next('i').attr('title', error.text());
          AppZapp.Common.addTooltip(element);
        },
        highlight: function(element) {
          $(element).removeClass('valid').addClass('error');
          $(element).next('i').remove();
          $(element).after("<i class='fa fa-info-circle errspan'></i>");
        },
        unhighlight: function(element) {
          $(element).removeClass('error').addClass('valid');
          $(element).next('i').remove();
          $(element).next('.tooltip').tooltip('hide');
        }
      });
      jQuery.validator.addMethod("file_size", function(val, elem){
        if($(elem)[0].files[0] != undefined){
          var file_size = $(elem)[0].files[0].size;
          if(file_size>(1024 * 1024 * 5)) {
            return false;
          }
          return true;
        }else{
          return true;
        }
      }, "Please select files upto 5MB of size.");
    },
    calculateEstimatedPaymentValidation: function(){
      $("#calculate_payment").validate({
        rules: {
          "estimate[sales_price]": "required",
          "estimate[loan_amount]": "required"
        },
        messages: {
          "estimate[sales_price]": "Please enter sales price.",
          "estimate[loan_amount]": "Please enter loan amount."
        },
        errorPlacement: function(error, element) {
          $(element).next('i').attr('title', error.text());
          AppZapp.Common.addTooltip(element);
        },
        highlight: function(element) {
          $(element).removeClass('valid').addClass('error');
          $(element).next('i').remove();
          $(element).after("<i class='fa fa-info-circle errspan'></i>");
        },
        unhighlight: function(element) {
          $(element).removeClass('error').addClass('valid');
          $(element).next('i').remove();
          $(element).next('.tooltip').tooltip('hide');
        }
      });
    },
    validateBuyer: function(){
      $('#validate_buyer').on('click', function(e){
        e.preventDefault();
        if($('#edit_user_password').valid()){
          $('#buyer_terms_modal').modal();
        }
      });
      $('#buyers_terms_checkbox').on('change', function(){
        if($(this).is(':checked')){
          $('#buyers_terms_next_btn').attr('disabled', false);
        }else{
          $('#buyers_terms_next_btn').attr('disabled', true);
        }
      });
      $('#buyers_terms_next_btn').on('click', function(){
        if(!$('#buyers_terms_checkbox').is(':checked')){
          $('#edit_user_password').attr('disabled', true);
          return false;
        }
      });
    },
    validateSignatureAndLogo: function(selector, imageField, method, preview_div){
      $(selector).on('change', function(){
        if($(this).is(':checked')){
          $(imageField).rules('remove');
          if(preview_div == '#signature_preview'){
            $(imageField).val('');
            $(preview_div).attr('src', '/assets/default_signature.png');
          }
          else{
            $(imageField).val('');
            $(preview_div).attr('src', '/assets/default_logo.png');
          }
        }else{
          if(method == "check_signature_file"){
            $(imageField).rules('add', {
              accept: "image/jpg,image/jpeg,image/png",
              check_signature_file: true,
              file_size: true
            });
          }else if(method == "check_logo_file"){
            $(imageField).rules('add', {
              accept: "image/jpg,image/jpeg,image/png",
              check_logo_file: true,
              file_size: true
            });
          }
        }
        $(imageField).valid();
      });
    }
  },
  mortgageMiFactorSlider: function(action){
    if(action == "edit" || action == "update"){
      if(AppZapp.User.validateMIFactor()){
        $('.mi-factor').show();
      }
      else{
        $('.mi-factor').css("cssText", "display: none !important;");
      }
      $('#deal_max_qualifying_monthly_payment').trigger('focusout');
    }
  },
  validateMIFactor: function(){
    AppZapp.Common.maskedPercentFields('#deal_minimal_down_payment, #deal_mi_factor');
    var loantype = parseInt($('#deal_loan_type :selected').val());
    var minimumDownPayment = AppZapp.PreApproval.Calculator.data.minDownPaymentPercent;
    var conventionalLoan = AppZapp.PreApproval.Calculator.data.loanTypes.CONVENTIONAL;
    var miFactor = parseFloat($('#deal_mi_factor').val());
    var minimal_down_payment = parseFloat($('#deal_minimal_down_payment').autoNumeric('get'));
    var mi = $('#deal_mi_factor').autoNumeric('getNumber');
    if(loantype == conventionalLoan && !isNaN(miFactor) && mi >= 0 && minimal_down_payment < minimumDownPayment || (loantype == conventionalLoan && minimal_down_payment < minimumDownPayment && !isNaN(miFactor))){
      return !$('#lenderpaid').is(':checked')
    }
    else{
      return false;
    }
  },
  loadImagePreview: function(input, selector, checkbox){
    if(input.files && input.files[0]){
      var reader = new FileReader();
      reader.onload = function (e) {
        $(selector).attr('src', e.target.result);
        if(input.id == "user_loan_officer_profile_signature"){
          $(input).rules('add', {
            accept: "image/jpg,image/jpeg,image/png",
            check_signature_file: true,
            file_size: true
          });
          $('#signature_preview').attr('alt', 'Signature Preview');
        }else if(input.id == "user_loan_officer_profile_logo"){
          $(input).rules('add', {
            accept: "image/jpg,image/jpeg,image/png",
            check_logo_file: true,
            file_size: true
          });
        }
        $(input).valid();
      }
      reader.readAsDataURL(input.files[0]);
      $(checkbox).prop('checked', false);
    }
  },
  fileUploadPreview: function(selector, preview_div, checkbox){
    $(selector).on('change', function(){
      if($(this).val() != ''){
        $(this).removeClass('error').addClass('valid');
        $(this).next('i').remove();
      }
      AppZapp.User.loadImagePreview(this, preview_div, checkbox);
    });
  },
  checkEmailExist: function(){
    $.ajax({
      url: '/check_email',
      data: {
        email: $('#deal_user_email').val()
      }
    });
  },
  changeImageUploadButton: function(){
    $('#signature_overlay').on('click', function(){
      $('#user_loan_officer_profile_signature').click();
    });
    $('#logo_overlay').on('click', function(){
      $('#user_loan_officer_profile_logo').click();
    });
    $('#profile_overlay').on('click', function(){
      $('#user_image').click();
    });
  },
  buyerCalculateEstimatedPayment: function(){
    AppZapp.Common.maskedPercentFields('#deal_minimal_down_payment');
    AppZapp.Common.maskedCurrencyFields('#deal_sales_price');
    var minimumDownPayment = parseFloat($('#deal_minimal_down_payment').autoNumeric('get'));
    var salesPrice = parseFloat($('#deal_sales_price').autoNumeric('get'));
    var loantype = parseInt($('#deal_loan_type :selected').val());
    var calculateLoanAmount = AppZapp.PreApproval.Calculator.calculateLoanAmount(salesPrice, minimumDownPayment);
    window.localStorage.setItem('calculateLoanAmount', calculateLoanAmount);
    $('#deal_loan_amount').val(window.localStorage.getItem('calculateLoanAmount'));
    $('#deal_annual_tax_rate').autoNumeric('set', AppZapp.PreApproval.Calculator.getAnnaulTaxes(salesPrice));
    $('#deal_annual_insurance_premium').autoNumeric('set', AppZapp.PreApproval.Calculator.getAnnualInsurancePremium(calculateLoanAmount));
  },
  autoPopulateFields: function(action){
    $('#deal_sales_price,#deal_minimal_down_payment').on('focusout', function(){
      AppZapp.User.buyerCalculateEstimatedPayment();
    });
    $('#deal_sales_price, #deal_minimal_down_payment, #deal_interest_rate, #deal_loan_term, #deal_mi_factor, #deal_max_qualifying_monthly_payment').on('change', function(event){
      if(event.target.id == "deal_max_qualifying_monthly_payment"){
        $('#max_monthly_change').val(true);
      }else{
        if($('#max_monthly_change').val() != "true"){
          $('#max_monthly_change').val(false);
        }
      }
      loanAmount = $('#deal_loan_amount').val();
      loanType = $('#deal_loan_type').val();
      AppZapp.autoMonthlyPayment.calculate(action, loanAmount, loanType);
    });
  },
  unbindSalesPrice: function(){
    $('#deal_annual_tax_rate').on('blur', function(){
      $('#deal_sales_price').off("blur");
      $('#deal_minimal_down_payment').off("blur");
    });
    $('#deal_annual_insurance_premium').on('blur', function(){
      $('#deal_sales_price').off("blur");
      $('#deal_minimal_down_payment').off("blur");
    });
    $('#deal_max_qualifying_monthly_payment').on('blur', function(){
      $('#deal_sales_price').off("blur");
      $('#deal_minimal_down_payment').off("blur");
      $('#deal_interest_rate').off("blur");
      $('#deal_loan_term').off("blur");
    });
  },
  selectLoanType: function(event){
    $('#deal_sales_price').trigger('focusout');
    var loantype = parseInt($('#deal_loan_type :selected').val());
    if(loantype == 1){
      AppZapp.PreApproval.calculationForConventionalLoan(event);
    }
    else if(loantype == 2){
      $('.mi-factor').css("cssText", "display: none !important;");
    }
    else if(loantype == 3){
      $('#vaUserModal').modal({
        backdrop: 'static',
        keyboard: false
      });
      $('.mi-factor').css("cssText", "display: none !important;");
    }
  },
  checkMortgage: function(){
    $('#mortgageModal').modal('hide');
    if($('#monthly').is(':checked')){
      $('.mi-factor').show();
    }else{
      $('.mi-factor').css("cssText", "display: none !important;");
    }
  },
  calculateMonthlyMI: function(){
    var miFactor = parseFloat($('#deal_mi_factor').val());
    var loanAmount = parseFloat($('#deal_loan_amount').val());
    $('#deal_max_qualifying_monthly_payment').val(AppZapp.PreApproval.Calculator.totalMonthlyMI(loanAmount, miFactor));
  },
  checkFundingFeeForVA: function(){
    AppZapp.Common.maskedPercentFields('#deal_minimal_down_payment')
    var usingFirstTime = $('input[name=first_va]:checked').val() == 'true';
    window.localStorage.setItem('usingFirstTime', usingFirstTime)
    var isReservist = $('input[name=reservist]:checked').val() == 'true';
    window.localStorage.setItem('isReservist', isReservist)
    var fundingPercentage = null;
    var downPayment = parseFloat($('#deal_minimal_down_payment').autoNumeric('get'));
    AppZapp.PreApproval.calculateFundingPercentage(usingFirstTime, isReservist, fundingPercentage, downPayment)
  },
  hoaDuesFieldsVisibility: function(){
    $('#deal_hoa_dues_yes').on('click', function(){
      $('#hoa_field_validation').removeClass('hoa-dues');
    });
    $('#deal_hoa_dues_no').on('click', function(){
      $('#hoa_field_validation').addClass('hoa-dues');
    });
  },
  addBuyerValidationOnRealtors: function(){
    $('#edit_realtors').validate({
      errorPlacement: function(error, element) {
        $(element).next('i').attr('title', error.text());
        AppZapp.Common.addTooltip(element);
      },
      highlight: function(element) {
        $(element).removeClass('valid').addClass('error');
        $(element).next('i').remove();
        $(element).after("<i class='fa fa-info-circle errspan'></i>");
      },
      unhighlight: function(element) {
        $(element).removeClass('error').addClass('valid');
        $(element).next('i').remove();
        $(element).next('.tooltip').tooltip('hide');
      }
    });
  },
  realtorsModalVisibility: function(){
    $('#btn-yes').on('click', function(){
      $('#preApprovalMatchModal').modal('hide');
    });
  }
};
