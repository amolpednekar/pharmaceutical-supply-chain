myApp.controller('shipmentsCtrl', ['$scope', function($scope) {
  $scope.trades = JSON.parse(localStorage.getItem('trades'));
  //console.log($scope.trades);
}]);
