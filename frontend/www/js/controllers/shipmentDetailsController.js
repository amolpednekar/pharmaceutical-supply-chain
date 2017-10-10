myApp.controller('shipmentsDetailsCtrl', ['$state', '$scope', '$stateParams', '$http', 'ionicToast', 'SharedDataService', 'TimelineViewService', 'HelperService', 'httpGetFactory','httpPostFactory',
  function ($state, $scope, $stateParams, $http, ionicToast, SharedDataService, TimelineViewService, HelperService, httpGetFactory, httpPostFactory) {
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
      var endpoint = "drugrecall"
      var alerts = ['Lot #' + post_data.tradeDetails.drugtrade.lotnumber + ' revoked succesfully!']
      console.log("alert", alerts.length)
      httpPostFactory.post(post_data, $state, endpoint, alerts, null);
    }

  }]);
