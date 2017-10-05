angular.module('app.controllers', [])
  .controller('distributorCtrl', ['$scope', '$http', 'ionicToast', 'TimelineViewService',
    function ($scope, $http, ionicToast, TimelineViewService) {

      $scope.recallFlag = 0;

      $scope.pharmacies = [{
        "name": "Farmacia Salcette",
        "address": "Gaunkar House Dada, Vaidya Chowk Ponda, Ponda–Durbhat, Ponda, Goa 403401",
        "labelercode": "5876",
        "multichainaddress": "16CzWSBPHV3gpdpRUEdX7uCUEPw9zaeK2616ve",
        "keyspath": "./keystore/pharmkeystore/credentials.pem",
        "ip": "169.254.216.151",
        "port": "6999",
        "user": "multichainrpc",
        "pass": "HjafPtYCbspLSGd7KJ8XPqZ3G74niDiDkpyX7r9E1zLJ"
      }];

      var value;
      $scope.$on("$ionicView.beforeEnter", function () {
        $('#pharmacyId').change(function () {
          selected = $('option:selected', this).attr('value');
          console.log($scope.pharmacies.length);
          for (var i = 0; i < $scope.pharmacies.length; i++) {
            value = $scope.pharmacies[i].name;
            if (value == selected) {
              $scope.pharmarcyInfo = $scope.pharmacies[i];
              console.log($scope.pharmarcyInfo)
              $scope.$apply();
              $('#pharmacyDetails').show();
              break;
            }
          }
        });

      });

      $scope.ToggleUnitFlag = function(){
        $('#showMoreText').hide();
        $('#showMore').show();
      }

      $scope.DistributorSearch = function (data) {

        console.log(data);

        $http.get(backendUrl + "/drug/" + data.lot + "/2/verify")
          .success(function (response) {
            console.log(response);
            $scope.tradeDetails = response.data.tradedetails;
            console.log(response.data.verificationstatus)
            $scope.verificationStatus = response.data.verificationstatus;
            console.log($scope.verificationStatus)
            $scope.drugTrade = response.data.tradedetails.drugtrade;
            $scope.tradeFlow = response.data.tradedetails.tradeflow;

            $('#verifyResults').show();
            if ($scope.tradeFlow.length >= 2 && $scope.tradeFlow[0].recipientlabelercode === $scope.tradeFlow[2].senderlabelercode) {
              // Do nothing
            } else {
              $('#distributorForm2').show();
              $('#distributor-send').show();
            }
            setTimeout(function(){ TimelineViewService.timeline($scope); }, 100);
          }).catch(function (err) {
            console.log(err);
            ionicToast.show('Data Not Found! ', 'bottom', false, 5000);
          });

        $http.get(backendUrl + "/drugrecall/" + data.lot + "/2/verify")
          .success(function (response) {
            console.log("drugrecall get Success!", response);
            $scope.recallFlag = 1;
          }).catch(function (err) {
            console.log(err);
            $scope.recallFlag = 0;
            //ionicToast.show('recalled_drugs_trades stream data not found! ', 'bottom', false, 5000);
          });
      }
      // Timeline view logic
      $scope.$on("$ionicView.afterEnter", function () {

      });
      $scope.DistributorSend = function (data) {
        post_data = {};
        post_data.senderId = 2;
        post_data.pharamacyId = 3;
        post_data.tradeDetails = $scope.tradeDetails;

        $http.put(backendUrl + "/drugtrade", post_data).then(function (response) {
          ionicToast.show('Distributor Send Successful!', 'bottom', false, 5000);
          console.log("Success", response);
        }, function (response) {
          ionicToast.show('Distributor Send Failed, please try again!', 'bottom', false, 5000);
          console.log("Failure", response);
        });

      };

    }]);
