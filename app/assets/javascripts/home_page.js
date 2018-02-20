AppZapp.Home = {
  termsAndCondition: function(){
    $('#validate_lo').on('click', function(e){
      e.preventDefault();
      if($('#new_user').valid()){
        $('#terms-modal').modal();
      }
    });
    $('#terms_checkbox').on('change', function(){
      if($(this).is(':checked')){
        $('#terms_next_btn').attr('disabled', false);
      }else{
        $('#terms_next_btn').attr('disabled', true);
      }
    });
    $('#terms_next_btn').on('click', function(e){
      if(!$('#terms_checkbox').is(':checked')){
        $('#new_user').attr('disabled', true);
        return false;
      }
    })
  }
}
