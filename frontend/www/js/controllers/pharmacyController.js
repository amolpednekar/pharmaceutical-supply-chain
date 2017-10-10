myApp.controller('pharmacyCtrl', ['$state','$scope', '$http', 'ionicToast', 'TimelineViewService', 'HelperService', 'reverseAnythingFilter','httpGetFactory',
  function ($state, $scope, $http, ionicToast, TimelineViewService, HelperService, reverseAnythingFilter, httpGetFactory) {

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
      httpGetFactory.get($scope, data, formIds, TimelineViewService);
    }

    $scope.PharmacyAccept = function (data) {
      post_data = {};
      post_data.senderId = 3;
      post_data.tradeDetails = $scope.tradeDetails;

      $http.put(backendUrl + "/drugtrade", post_data).then(function (response) {
        // ionicToast.show('Pharmacy Acceptance Successful!', 'bottom', false, 5000);
        swal({
          title: "Shipment Accepted!",
          button: false,
          timer: 1000
        });
        console.log(response);
        $state.go($state.current, {}, {reload: true});
      }, function (response) {
        // ionicToast.show('TPharmacy Acceptance failed, try again!', 'bottom', false, 5000);
        swal({
          title: "Oops, there was an error! Please try again",
          button: false,
          timer: 1000
        });
        console.log(response);
      });

    };


  }]);
