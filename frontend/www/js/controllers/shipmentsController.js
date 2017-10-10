myApp.controller('shipmentsCtrl', ['$state','$scope', 'reverseAnythingFilter', 'ionicToast',
  function ($state, $scope, reverseAnythingFilter, ionicToast) {
    $scope.trades = JSON.parse(localStorage.getItem('trades'));
    if ($scope.trades != null) {
      $scope.reversedTrades = reverseAnythingFilter($scope.trades); //reverse order to descending
    } else {
      $scope.reversedTrades = [];
    }

    $scope.$on("$ionicView.afterEnter", function () {
      for (i = 0; i < $scope.reversedTrades.length; i++) {

        JsBarcode("#barcode" + $scope.reversedTrades[i].lotnumber)
          .options({ font: "OCR-B", displayValue: false, width: 5, height: 35, margin: 0 }) // Will affect all barcodes
          .pharmacode(($scope.reversedTrades[i].lotnumber) % 1000, { fontSize: 18, textMargin: 0, lineColor: "#006400" })
          .blank(2) // Create space between the barcodes
          .render();
      }

      $('#shipmentsTable').show();

    });

    $scope.ClearStorage = function clearStorage() {
      localStorage.removeItem("trades");
      swal({
        title: 'Local Storage cleared successfully!',
        button: false,
      });
      $state.go($state.current, {}, {reload: true});
      // ionicToast.show('Local Storage cleared successfully!', 'bottom', false, 5000);
    }
    console.log('$scope.trades', $scope.trades)
    console.log('$scope.reversedTrades', $scope.reversedTrades)
  }]);
