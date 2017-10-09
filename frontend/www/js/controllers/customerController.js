myApp.controller('customerCtrl', ['$scope', '$http', 'ionicToast', 'TimelineViewService',
  function ($scope, $http, ionicToast, TimelineViewService) {
    $scope.data = {};
    $scope.recall = null;
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

            // ionicToast.show('Medicine not found! Please contact the store of purchase immediately', 'bottom', false, 5000);
          }

          // Barcode generate
          JsBarcode("#barcode")
            .options({ font: "OCR-B", displayValue: false, width: 5, height: 35, margin: 0 }) // Will affect all barcodes
            .pharmacode(($scope.drugTrade.lotnumber) % 1000, { fontSize: 18, textMargin: 0 })
            .blank(2) // Create space between the barcodes
            .render();


          setTimeout(function () { TimelineViewService.timeline($scope); }, 100);
        }).catch(function (err) {
          console.log(err);
          // ionicToast.show('Medicine not found! Please contact the store of purchase immediately', 'bottom', false, 5000);
          swal({
            title: "Medicine not found! Please contact the store of purchase immediately!",
            button: false
          });
        });


      $http.get(backendUrl + "/drugrecall/" + result[0] + "/3/verify")
        .success(function (response) {
          console.log("Drug get Success!", response);
          $scope.recallFlag = 1;
          recallObj = {
            action: response.data.tradedetails.action,
            recallerName: response.data.tradedetails.tradeflow.recallername,
            recallerLabelerCode: response.data.tradedetails.tradeflow.recallerlabelercode,
            recallerSignature: response.data.tradedetails.tradeflow.recallersignature,
            signingDate: response.data.tradedetails.tradeflow.date
          }
          $scope.recall = recallObj;
        }).catch(function (err) {
          console.log(err);
          $scope.recallFlag = 0;
        });
    }

  }]);
