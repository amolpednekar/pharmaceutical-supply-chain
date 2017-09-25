angular.module('app.controllers', [])
  .controller('distributorCtrl', ['$scope', '$http', 'ionicToast',
    function ($scope, $http, ionicToast) {

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

      $scope.DistributorSearch = function (data) {

        console.log(data);

        $http.get("http://10.51.233.255:8080/drug/" + data.lot + "/2/verify")
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

          }).catch(function (err) {
            console.log(err);
            ionicToast.show('Data Not Found! ', 'bottom', false, 5000);
          });
      }

      $scope.DistributorSend = function (data) {
        post_data = {};
        post_data.senderId = 2;
        post_data.pharamacyId = 3;
        post_data.tradeDetails = $scope.tradeDetails;

        $http.put("http://10.51.233.255:8080/drugtrade", post_data).then(function (response) {
          // This function handles success
          ionicToast.show('Data Submitted Successfully!', 'bottom', false, 5000);
          console.log(response);
          // $scope.DistributorSearch($scope.tradeDetails.drugtrade.lotnumber);
        }, function (response) {
          // this function handles error
          console.log("Failure!");
          ionicToast.show('There was an error, please try again!', 'bottom', false, 5000);
          console.log(response);
        });

      };

    }]);
