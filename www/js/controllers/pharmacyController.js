myApp.controller('pharmacyCtrl', ['$scope', '$http','ionicToast',
function ($scope, $http, ionicToast) {
  $scope.greeting = 'Hola!';

  $scope.PharmacySearch = function (data) {

    console.log(data);

    $http.get("http://10.244.51.105:8080/drug/" + data.lot + "/2/verify")
      .success(function (response) {
        console.log(response);
        $scope.tradeDetails = response.data.tradedetails;
        $scope.verificationStatus = response.data.verificationstatus;
        $scope.drugTrade = response.data.tradedetails.drugtrade;
        $scope.tradeFlow = response.data.tradedetails.tradeflow;

        $('#verifyResults').show();
        if ($scope.tradeFlow.length == 1 || $scope.tradeFlow.length ==4 ) {
          // Do nothing
          $('#pharmacyForm2').hide();
        } else {
          $('#pharmacyForm2').show();
        }
      }).catch(function (err) {
        console.log(err);
      });
  }

  $scope.PharmacyAccept = function (data) {
    post_data = {};
    post_data.senderId = 3;
    post_data.tradeDetails = $scope.tradeDetails;

    $http.put("http://10.244.51.105:8080/drugtrade", post_data).then(function (response) {
      // This function handles success
      ionicToast.show('Data Submitted Successfully!', 'bottom', false, 5000);
      console.log(response);
    }, function (response) {
      // this function handles error
      console.log("Failure!");
      console.log(response);
    });

  };


}]);
