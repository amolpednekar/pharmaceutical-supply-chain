myApp.controller('customerCtrl', ['$scope', '$http', 'ionicToast',
  function ($scope, $http, ionicToast) {
    $scope.data = {};
	
		
      $scope.onSuccess = function (data) {
        console.log(data);
				$scope.data.mid = data;
      };
      $scope.onError = function (error) {
        console.log(error);
      };
      $scope.onVideoError = function (error) {
        console.log(error);
      };
		
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
          //if($scope.searchResult!== -1){
          $('#searchResults').show();
          //}
        }).catch(function (err) {
          console.log(err);
          ionicToast.show('Medicine not found! Please contact the store of purchase immediately', 'bottom', false, 5000);
        });
    }

  }]);
