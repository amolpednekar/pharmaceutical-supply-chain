myApp.controller('pharmacyCtrl', ['$scope', '$http', 'ionicToast', 'TimelineViewService', 'HelperService',
  function ($scope, $http, ionicToast, TimelineViewService, HelperService) {
    $scope.recallFlag = 0;

    $scope.ToggleUnitFlag = function (arg) {
      HelperService.toggleShow(arg);
    }

    $scope.PharmacySearch = function (data) {

      console.log(data);

      $http.get(backendUrl + "/drug/" + data.lot + "/3/verify")
        .success(function (response) {
          console.log(response);
          $scope.tradeDetails = response.data.tradedetails;
          $scope.verificationStatus = response.data.verificationstatus;
          $scope.drugTrade = response.data.tradedetails.drugtrade;
          $scope.tradeFlow = response.data.tradedetails.tradeflow;
          $('#verifyResults').show();
          if ($scope.tradeFlow.length == 1 || $scope.tradeFlow.length == 4) {
            // Do nothing
            $('#pharmacyForm2').hide();
          } else {
            $('#pharmacyForm2').show();
          }

          // Barcode generate
          JsBarcode("#barcode")
            .options({ font: "OCR-B", displayValue: false, width: 5, height: 25, margin: 0 }) // Will affect all barcodes
            .pharmacode(($scope.drugTrade.lotnumber) % 1000, { fontSize: 18, textMargin: 0 })
            .blank(2) // Create space between the barcodes
            .render();

          setTimeout(function () { TimelineViewService.timeline($scope); }, 100);
        }).catch(function (err) {
          console.log(err);
          ionicToast.show('Data Not Found! ', 'bottom', false, 5000);
        });

      $http.get(backendUrl + "/drugrecall/" + data.lot + "/3/verify")
        .success(function (response) {
          console.log("Drug get Success!", response);
          $scope.recallFlag = 1;
        }).catch(function (err) {
          console.log(err);
          $scope.recallFlag = 0;
        });
    }

    $scope.PharmacyAccept = function (data) {
      post_data = {};
      post_data.senderId = 3;
      post_data.tradeDetails = $scope.tradeDetails;

      $http.put(backendUrl + "/drugtrade", post_data).then(function (response) {
        ionicToast.show('Pharmacy Acceptance Successful!', 'bottom', false, 5000);
        console.log(response);
      }, function (response) {
        ionicToast.show('TPharmacy Acceptance failed, try again!', 'bottom', false, 5000);
        console.log(response);
      });

    };


  }]);
