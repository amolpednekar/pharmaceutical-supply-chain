myApp.controller('shipmentsDetailsCtrl', ['$scope', '$stateParams', '$http','ionicToast', function ($scope, $stateParams, $http, ionicToast) {
  console.log($stateParams);

  $http.get(backendUrl+"/drug/" + $stateParams.shipmentId + "/1/verify")
    .success(function (response) {
      console.log("Drug get Success!",response);
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

  $scope.RecallDrug = function () {
    console.log("recalled")
    post_data = {};
    post_data.senderId = 1;
    post_data.tradeDetails = $scope.tradeDetails;
    console.log("post_data",post_data);
    $http.post(backendUrl+"/drugrecall/", post_data).then(function (response) {
      ionicToast.show('Lot # revoked succesfully!', 'bottom', false, 5000);
      console.log("Revocation Success", response);
    }, function (response) {
      console.log("Revocation Failure", response);
      ionicToast.show('There was an error, please try again!', 'bottom', false, 5000);
    });
  }

}]);