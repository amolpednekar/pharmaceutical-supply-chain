myApp.controller('shipmentsCtrl', ['$scope','reverseAnythingFilter','ionicToast',
function($scope,reverseAnythingFilter,ionicToast) {
  $scope.trades = JSON.parse(localStorage.getItem('trades'));
  if($scope.trades != null){
    $scope.reversedTrades = reverseAnythingFilter($scope.trades); //reverse order to descending
  }else{
    $scope.reversedTrades = [];
  }


  $scope.ClearStorage = function clearStorage(){
    localStorage.removeItem("trades");
    ionicToast.show('Local Storage cleared successfully!', 'bottom', false, 5000);
  }
  console.log('$scope.trades',$scope.trades)
  console.log('$scope.reversedTrades',$scope.reversedTrades)
}]);
