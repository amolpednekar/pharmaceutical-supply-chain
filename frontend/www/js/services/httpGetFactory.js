myApp.factory('httpGetFactory', function ($http) {
  service = {}

  service.get = function ($scope, data, formIds, services) {
    console.log("get factory scope, data, formid", $scope, data, formIds)

    $http.get(backendUrl + "/drug/" + data.lot + "/" + $scope.callerId + "/verify")
      .success(function (response) {
        console.log(response);
        $scope.tradeDetails = response.data.tradedetails;
        $scope.verificationStatus = response.data.verificationstatus;
        $scope.drugTrade = response.data.tradedetails.drugtrade;
        $scope.tradeFlow = response.data.tradedetails.tradeflow;
        if ($scope.callerId == 1){
          $(formIds[0]).show();
          services[1].TradeInfo = $scope.tradeFlow;
        }
        else if ($scope.callerId == 2) {
          $(formIds[0]).show();
          if ($scope.tradeFlow.length >= 2 && $scope.tradeFlow[0].recipientlabelercode === $scope.tradeFlow[2].senderlabelercode) {
            // Do nothing
          } else {
            $(formIds[1]).show();
            $(formIds[2]).show();
          }
        } else if ($scope.callerId == 3) {
          $(formIds[0]).show();
          if ($scope.tradeFlow.length == 1 || $scope.tradeFlow.length == 4) {
            // Do nothing
            $(formIds[1]).hide();
          } else {
            $(formIds[1]).show();
          }
        }

        // Barcode generate
        JsBarcode("#barcode")
          .options({ font: "OCR-B", displayValue: false, width: 5, height: 35, margin: 0 }) // Will affect all barcodes
          .pharmacode(($scope.drugTrade.lotnumber) % 1000, { fontSize: 18, textMargin: 0 })
          .blank(2) // Create space between the barcodes
          .render();
        // Timeline viewer
        setTimeout(function () { services[0].timeline($scope); }, 100);
      }).catch(function (err) {
        $('#verifyResults').hide();
        console.log(err);
        swal({
          title: "Lot data not found!",
          button: false
        });
      });

    $http.get(backendUrl + "/drugrecall/" + data.lot + "/" + $scope.callerId + "/verify")
      .success(function (response) {
        console.log("drugrecall get Success!", response);
        recallObj = {
          action: response.data.tradedetails.action,
          recallerName: response.data.tradedetails.tradeflow.recallername,
          recallerLabelerCode: response.data.tradedetails.tradeflow.recallerlabelercode,
          recallerSignature: response.data.tradedetails.tradeflow.recallersignature,
          signingDate: response.data.tradedetails.tradeflow.date
        }
        $scope.recall = recallObj;
        $scope.recallFlag = 1;
      }).catch(function (err) {
        console.log(err);
        $scope.recallFlag = 0;
      });
  }

  return service;
})
