myApp.controller('recallCtrl', ['$scope', '$http', 'ionicToast', 'TimelineViewService', 'HelperService', 'reverseAnythingFilter',
  function ($scope, $http, ionicToast, TimelineViewService, HelperService, reverseAnythingFilter) {

    $scope.recallFlag = 0;

    $scope.trades = JSON.parse(localStorage.getItem('trades'));
    if ($scope.trades != null) {
      $scope.reversedTrades = reverseAnythingFilter($scope.trades); //reverse order to descending
    } else {
      $scope.reversedTrades = [];
    }

    $scope.ToggleUnitFlag = function (arg) {
      HelperService.toggleShow(arg);
    }

    $scope.RecallSearch = function (data) {
      $http.get(backendUrl + "/drugrecall/" + data.lot + "/3/verify")
        .success(function (response) {
          console.log("drugrecall get Success!", response);

          $scope.drugTrade = response.data.tradedetails.drugtrade;
          $scope.verificationStatus = response.data.verificationstatus;
          recallObj = {
            action: response.data.tradedetails.action,
            recallerName: response.data.tradedetails.tradeflow.recallername,
            recallerLabelerCode: response.data.tradedetails.tradeflow.recallerlabelercode,
            recallerSignature: response.data.tradedetails.tradeflow.recallersignature,
            signingDate: response.data.tradedetails.tradeflow.date
          }
          $scope.recall = recallObj;
          $scope.recallFlag = 1;
          $('#verifyResults').show();
          // Barcode generate
          JsBarcode("#barcode")
            .options({ font: "OCR-B", displayValue: false, width: 5, height: 35, margin: 0 }) // Will affect all barcodes
            .pharmacode(($scope.drugTrade.lotnumber) % 1000, { fontSize: 18, textMargin: 0 })
            .blank(2) // Create space between the barcodes
            .render();
          console.log($scope)

        }).catch(function (err) {
          console.log(err);
          $('#verifyResults').hide();
          $scope.recallFlag = 0;
          swal({
            title: "The lot you entered was not recalled!",
            button: false
          });
          // ionicToast.show('', 'bottom', false, 5000);
        });
    }
  }]);
