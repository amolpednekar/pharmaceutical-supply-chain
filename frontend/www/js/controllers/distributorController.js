angular.module('app.controllers', [])
  .controller('distributorCtrl', ['$state', '$scope', '$http', 'ionicToast', 'TimelineViewService', 'HelperService', 'reverseAnythingFilter','httpGetFactory','httpPostFactory',
    function ($state, $scope, $http, ionicToast, TimelineViewService, HelperService, reverseAnythingFilter, httpGetFactory,httpPostFactory) {

      $scope.recallFlag = 0;

      $scope.trades = JSON.parse(localStorage.getItem('trades'));
      if ($scope.trades != null) {
        $scope.reversedTrades = reverseAnythingFilter($scope.trades); //reverse order to descending
      } else {
        $scope.reversedTrades = [];
      }

      // Get static json data for the form

      $http.get('participants.json').success(function (response) {
        $scope.pharmacies = [response[3]];
      })

      $scope.$on("$ionicView.beforeEnter", function () {

        var value;

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


      $scope.ToggleUnitFlag = function (arg) {
        HelperService.toggleShow(arg);
      }

      // Data Querying

      $scope.callerId = 2;
      var formIds = ["#verifyResults","#distributorForm2","#distributor-send"];
      var services = [TimelineViewService];
      $scope.DistributorSearch = function(data){
        httpGetFactory.get($scope, data, formIds, services);
      }

      $scope.DistributorSend = function (data) {
        post_data = {};
        post_data.senderId = 2;
        post_data.pharamacyId = 3;
        post_data.tradeDetails = $scope.tradeDetails;
        var alerts = ["Data sent successfully!", "Oops, there was an error! Please try again"]
        httpPostFactory.put(post_data,  $state, alerts)

        // $http.put(backendUrl + "/drugtrade", post_data).then(function (response) {
        //   // ionicToast.show('Distributor Send Successful!', 'bottom', false, 5000);
        //   swal({
        //     title: "Data sent successfully!",
        //     button: false,
        //     timer: 1000
        //   });
        //   console.log("Success", response);
        //   $state.go($state.current, {}, { reload: true });
        // }, function (response) {
        //   // ionicToast.show('Distributor Send Failed, please try again!', 'bottom', false, 5000);
        //   swal({
        //     title: "Oops, there was an error! Please try again",
        //     button: false,
        //     timer: 1000
        //   });
        //   console.log("Failure", response);
        // });

      };

    }]);
