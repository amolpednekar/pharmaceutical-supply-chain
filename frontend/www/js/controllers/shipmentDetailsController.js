myApp.controller('shipmentsDetailsCtrl', ['$state', '$scope', '$stateParams', '$http', 'ionicToast', 'SharedDataService', 'TimelineViewService', 'HelperService', 'httpGetFactory',
  function ($state, $scope, $stateParams, $http, ionicToast, SharedDataService, TimelineViewService, HelperService, httpGetFactory) {
    console.log($stateParams);

    $scope.recallFlag = 0;  //Toggle recall button
    $scope.recall = null;
    service = HelperService;
    console.log("Service", service)

    $scope.callerId = 1;
    var formIds = ["#verifyResults"]
    var services = [TimelineViewService, SharedDataService];

    httpGetFactory.get($scope, $stateParams, formIds, services);

    $scope.ToggleUnitFlag = function (arg) {
      service.toggleShow(arg);
    }

    $scope.RecallDrug = function () {
      console.log("recalled")
      post_data = {};
      post_data.senderId = 1;
      post_data.tradeDetails = $scope.tradeDetails;
      console.log('post_data.tradeDetails', post_data.tradeDetails)
      console.log("post_data", post_data);
      $http.post(backendUrl + "/drugrecall/", post_data).then(function (response) {
        // ionicToast.show('Lot #' + post_data.tradeDetails.drugtrade.lotnumber + ' revoked succesfully!', 'bottom', false, 5000);
        swal({
          title: 'Lot #' + post_data.tradeDetails.drugtrade.lotnumber + ' revoked succesfully!',
          button: false,
          timer: 1000
        });
        console.log("Revocation Success", response);
        $state.go($state.current, {}, { reload: true });
      }, function (response) {
        console.log("Revocation Failure", response);
        // ionicToast.show('There was an error, please try again!', 'bottom', false, 5000);
        swal({
          title: "Oops, there was an error! Please try again",
          button: false,
          timer: 1000
        });
      });
    }

  }]);
