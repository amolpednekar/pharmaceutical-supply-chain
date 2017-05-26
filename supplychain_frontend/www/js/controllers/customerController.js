myApp.controller('customerCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $scope.greeting = 'Hola!';

    $scope.CustomerSearch = function (data) {

      result = data.mid.split('-');
      console.log(result[1]);

      $http.get("http://10.244.51.105:8080/drug/" + result[0] + "/2/verify")
        .success(function (response) {
          console.log(response);
          $scope.tradeDetails = response.data.tradedetails;
          $scope.verificationStatus = response.data.verificationstatus;
          $scope.drugTrade = response.data.tradedetails.drugtrade;
          $scope.tradeFlow = response.data.tradedetails.tradeflow;

          console.log($scope.drugTrade.unitsid)
          $scope.searchResult = $scope.drugTrade.unitsid.indexOf(parseInt(result[1]));
          if($scope.searchResult!== -1){
            $('#searchResults').show();
          }
          // $('#verifyResults').show();
          // if ($scope.tradeFlow.length == 1 || $scope.tradeFlow.length == 4) {
          //   // Do nothing
          //   $('#pharmacyForm2').hide();
          // } else {
          //   $('#pharmacyForm2').show();
          // }
        }).catch(function (err) {
          console.log(err);
        });
    }

  }]);
