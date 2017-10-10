myApp.controller('pharmacyCtrl', ['$state','$scope', '$http', 'ionicToast', 'TimelineViewService', 'HelperService', 'reverseAnythingFilter','httpGetFactory','httpPostFactory',
  function ($state, $scope, $http, ionicToast, TimelineViewService, HelperService, reverseAnythingFilter, httpGetFactory, httpPostFactory) {

    $scope.recallFlag = 0;
    $scope.recall = null;
    $scope.trades = JSON.parse(localStorage.getItem('trades'));

    if ($scope.trades != null) {
      $scope.reversedTrades = reverseAnythingFilter($scope.trades); //reverse order to descending
    } else {
      $scope.reversedTrades = [];
    }

    $scope.ToggleUnitFlag = function (arg) {
      HelperService.toggleShow(arg);
    }

    // Data Querying

    $scope.callerId = 3;
    var formIds = ["#verifyResults","#pharmacyForm2"];
    var services = [TimelineViewService];
    $scope.PharmacySearch = function(data){
      httpGetFactory.get($scope, data, formIds, services);
    }

    $scope.PharmacyAccept = function (data) {
      post_data = {};
      post_data.senderId = 3;
      post_data.tradeDetails = $scope.tradeDetails;
      var alerts = ["Shipment Accepted!", "Oops, there was an error! Please try again"];

      // Posting to url/drugtrade
      httpPostFactory.put(post_data,  $state, alerts);

    };


  }]);
