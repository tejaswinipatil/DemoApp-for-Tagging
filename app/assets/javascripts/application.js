// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery-ui
//= require jquery_ujs

//= require turbolinks
//= require vendor
//= require app
//= require select2.full.min
//= require jquery.validate.min
//= require additional-methods.min
//= require jquery.blockUI
//= require common
//= require users
//= require home
//= require pre_approval_algo
//= require auto_monthly_payment
//= require dashboard

//= require rate_admin

$(function() {
	$("#links_search input").keyup(function() {
    $.get($("#links_search").attr("action"), $("#links_search").serialize(), null, "script");
    return false;
  });
});