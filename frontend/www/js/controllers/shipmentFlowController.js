myApp.controller('shipmentFlowCtrl', ['$scope', '$state', 'ionicToast', 'SharedDataService',
  function ($scope, $state, ionicToast, SharedDataService) {

    $scope.tradeFlow = SharedDataService.TradeInfo;
    $scope.recall = SharedDataService.RecallInfo;
    console.log($scope.tradeFlow)
  }]);
