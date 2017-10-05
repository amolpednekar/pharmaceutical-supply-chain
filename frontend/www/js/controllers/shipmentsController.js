myApp.controller('shipmentsCtrl', ['$scope','reverseAnythingFilter', function($scope,reverseAnythingFilter) {
  $scope.trades = JSON.parse(localStorage.getItem('trades'));
  $scope.reversedTrades = reverseAnythingFilter($scope.trades); //reverse order to descending
}]);
