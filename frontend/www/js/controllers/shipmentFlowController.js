myApp.controller('shipmentFlowCtrl', ['$scope', '$state', 'ionicToast', '$ionicScrollDelegate', 'SharedDataService', 'TimelineViewService',
  function ($scope, $state, ionicToast, $ionicScrollDelegate, SharedDataService, TimelineViewService) {

    $scope.tradeFlow = SharedDataService.TradeInfo;

    $scope.$on("$ionicView.afterEnter", function () {
      TimelineViewService.timeline($scope);
    });
  }]);
