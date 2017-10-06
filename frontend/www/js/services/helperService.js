myApp.factory('HelperService', function () {
  service = {};

  service.toggleShow = function(arg){
    if (parseInt(arg) === 1) {
      $('#showMoreText').hide();
      $('#showMore').show();
      $('#showLessText').show();
    }else{
      $('#showMoreText').show();
      $('#showMore').hide();
      $('#showLessText').hide();
    }
  }

  return service;
});
