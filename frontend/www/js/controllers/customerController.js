myApp.controller('customerCtrl', ['$scope', '$http', 'ionicToast',
  function ($scope, $http, ionicToast) {
    $scope.data = {};

    $scope.CustomerSearch = function (data) {

      result = data.mid.split('-');
      console.log(result[1]);

      $http.get(backendUrl + "/drug/" + result[0] + "/3/verify")
        .success(function (response) {
          console.log(response);
          $scope.tradeDetails = response.data.tradedetails;
          $scope.verificationStatus = response.data.verificationstatus;
          $scope.drugTrade = response.data.tradedetails.drugtrade;
          $scope.tradeFlow = response.data.tradedetails.tradeflow;

          console.log($scope.drugTrade.unitsid)
          $scope.searchResult = $scope.drugTrade.unitsid.indexOf(parseInt(result[1]));
          if ($scope.searchResult !== -1) {
            $('#searchResults').show();
          } else {
            ionicToast.show('Medicine not found! Please contact the store of purchase immediately', 'bottom', false, 5000);
          }
        }).catch(function (err) {
          console.log(err);
          ionicToast.show('Medicine not found! Please contact the store of purchase immediately', 'bottom', false, 5000);
        });
    }

  }]);
