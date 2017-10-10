myApp.controller('manufacturerCtrl', ['$scope', '$http', '$state', 'ionicToast','httpPostFactory',
  function ($scope, $http, $state, ionicToast, httpPostFactory) {

    var allTrades = [];

    // Get static json data for the form

    $http.get('participants.json').success(function (response) {
      $scope.manufacturer = response[1];
      $scope.receivers = [response[2]];
    })

    $http.get('productdetails.json').success(function(response){
      $scope.products = response;
    })

    // Datepicker options
    $scope.onezoneDatepicker = {
      date: new Date(), // MANDATORY
      mondayFirst: false,
      disablePastDays: true,
      disableSwipe: false,
      disableWeekend: false,
      showDatepicker: false,
      showTodayButton: true,
      calendarMode: false,
      hideCancelButton: false,
      hideSetButton: true,
      callback: function (value) {
        $scope.expirationDate = value;
      }
    };


    if (localStorage.getItem('trades') !== null) {
      allTrades = JSON.parse(localStorage.getItem('trades'));
    }

    console.log(localStorage.getItem('trades') !== null)
    console.log("All Trades", allTrades)

    $scope.$on("$ionicView.beforeEnter", function () {
      var value;

      $scope.ndc = Math.round((Math.random() * 100000) * 100000);
      $scope.lot = Math.round((Math.random() * 10000) * 10000);

      $('#productid').change(function () {
        selected = $('option:selected', this).attr('value');
        for (var i = 0; i < $scope.products.length; i++) {
          value = $scope.products[i].pid;
          if (value == selected) {
            $scope.productInfo = $scope.products[i];
            $scope.$apply();
            break;
          }
        }
        $('#productDetails').show();
      });

      $('#receiverId').change(function () {
        selected = $('option:selected', this).attr('value');
        console.log($scope.receivers.length)
        for (var i = 0; i < $scope.receivers.length; i++) {
          value = $scope.receivers[i].name;
          if (value == selected) {
            $scope.receiverInfo = $scope.receivers[i];
            $scope.$apply();
            break;
          }
        }
        $('#receiverDetails').show();
      });

    });

    // On Submit of Manufacturer's Form
    $scope.ManufacturerForm = function (data) {
      var post_data = {};
      post_data.unitsId = [];
      for (i = 0; i < data.quantity; i++) {
        post_data.unitsId.push(Math.round((Math.random() * 10000) * 10000));
      }
      post_data.manufacturerID = 1; //postion in JSON, temp hardcode
      post_data.lotNumber = $scope.lot;
      post_data.ndc = $scope.ndc;
      post_data.expirationDate = $scope.expirationDate;
      post_data.quantity = data.quantity;
      post_data.productInfo = $scope.productInfo;
      post_data.receiverInfo = 2;
      console.log("Manufacturer Post Data", post_data);

      // Posting to url/drugtrade
      httpPostFactory.post(post_data, $state, allTrades);
    }
  }]);
