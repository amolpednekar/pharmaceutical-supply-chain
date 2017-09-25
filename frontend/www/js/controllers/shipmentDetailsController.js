myApp.controller('shipmentsDetailsCtrl', ['$scope','$stateParams','$http', function($scope,$stateParams,$http) {
    console.log($stateParams);

    $http.get("http://10.51.233.255:8080/drug/" + $stateParams.shipmentId + "/1/verify")
    .success(function (response) {
      console.log(response);
      $scope.tradeDetails = response.data.tradedetails;
      $scope.verificationStatus = response.data.verificationstatus;
      $scope.drugTrade = response.data.tradedetails.drugtrade;
      $scope.tradeFlow = response.data.tradedetails.tradeflow;

      $('#verifyResults').show();
      if ($scope.tradeFlow.length == 1 || $scope.tradeFlow.length == 4) {
        // Do nothing
        $('#pharmacyForm2').hide();
      } else {
        $('#pharmacyForm2').show();
      }
    }).catch(function (err) {
      console.log(err);
      ionicToast.show('Data Not Found! ', 'bottom', false, 5000);
    });

  }]);