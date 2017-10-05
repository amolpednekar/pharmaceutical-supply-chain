myApp.controller('manufacturerCtrl', ['$scope', '$http', '$state','ionicToast',
  function ($scope, $http, $state,ionicToast) {

      $scope.onezoneDatepicker = {
        date: new Date(), // MANDATORY
        mondayFirst: false,
        disablePastDays: true,
        disableSwipe: false,
        disableWeekend: false,
        showDatepicker: false,
        showTodayButton: true,
        calendarMode: false,
        hideCancelButton: false,
        hideSetButton: false,
        callback: function(value){
            $scope.expirationDate = value;
        }
      };
    $scope.manufacturer = {
      "name": "Merck Pharmaceutical",
      "address": "Fl No-f 02, Mithsu Resindency, Jofilnagar, Ponda, Ponda, Goa, Fl No-f 02, Goa 403401",
      "labelercode": "8532",
      "multichainaddress": "1GvLczuVCVjaN78gB7BESF6rA5P7UhcvroQhK6",
      "keyspath": "./keystore/manfkeystore/credentials.pem",
      "ip": "169.254.216.151",
      "port": "8999",
      "user": "multichainrpc",
      "pass": "3sALXzUAct65Mv2CxfKrDZgUDJ4GhJWootWzshKsM41A"
    }

    $scope.products = [{

      "pid": "4020",
      "name": "Celexa",
      "producttypename": "HUMAN PRESCRIPTION DRUG",
      "proprietaryname": "Celexa",
      "nonproprietaryname": "Citalopram Hydrobromide",
      "dosageformname": "TABLET, FILM COATED",
      "routename": "ORAL",
      "strengthnumber": "40",
      "strengthunit": "mg/1",
      "productcode": "4020"

    },
    {
      "pid": "2011",
      "name": "Vicodin",
      "producttypename": "HUMAN PRESCRIPTION DRUG",
      "proprietaryname": "Vicodin",
      "nonproprietaryname": "Hydrocodone Bitartrate and Acetaminophen",
      "dosageformname": "TABLET",
      "routename": "ORAL",
      "strengthnumber": "5; 300",
      "strengthunit": "mg/1; mg/1",
      "productcode": "3041"
    }];

    $scope.receivers = [{
      "name": "Orient Pharmaceutical Distributor",
      "address": "1-2,Orient Tower,Behind Loyala High School, Margao, Goa, 403601",
      "labelercode": "7843",
      "multichainaddress": "12syYEdrRa1WQFhQJdnCSHrJt8a8jChiMfzRCs",
      "keyspath": "./keystore/distkeystore/credentials.pem",
      "ip": "169.254.216.151",
      "port": "7999",
      "user": "multichainrpc",
      "pass": "Aj2FmLFTMASMorTo3QHQnsZHkojXS2qb4iGps3tzhUdx"

    }];

    // $http.get('productdetails.json').then(function (data) {
    //   $scope.phones = data;
    //   console.log("success")
    // });
    allTrades = [];

    if (localStorage.getItem('trades') !== null) {
      allTrades = JSON.parse(localStorage.getItem('trades'));
    }
    console.log(localStorage.getItem('trades') !== null)
    console.log("All Trades",allTrades)

    var value;
    $scope.$on("$ionicView.beforeEnter", function () {

      $scope.ndc = Math.round((Math.random() * 100000) * 100000);
      $scope.lot = Math.round((Math.random() * 10000) * 10000);
      $('#productid').change(function () {
        selected = $('option:selected', this).attr('value');
        for (var i = 0; i < $scope.products.length; i++) {
          value = $scope.products[i].pid;
          if (value == selected) {
            $scope.productInfo = $scope.products[i];
            $scope.$apply();
            break;
          }
        }
        $('#productDetails').show();
      });

      $('#receiverId').change(function () {
        selected = $('option:selected', this).attr('value');
        console.log($scope.receivers.length)
        for (var i = 0; i < $scope.receivers.length; i++) {
          value = $scope.receivers[i].name;
          if (value == selected) {
            $scope.receiverInfo = $scope.receivers[i];
            $scope.$apply();
            break;
          }
        }
        $('#receiverDetails').show();
      });

    });

    //console.log("Local" +localStorage.getItem('trades'));
    // if (localStorage.getItem('trades') !== null) {
    //   obj = localStorage.getItem('trades');
    //   console.log(JSON.parse(obj));
    // }

    // On Submit of Manufacturer's Form
    $scope.ManufacturerForm = function (data) {
      var post_data = {};
      post_data.unitsId = [];
      for (i = 0; i < data.quantity; i++) {
        post_data.unitsId.push(Math.round((Math.random() * 10000) * 10000));
      }
      post_data.manufacturerID = 1; //postion in JSON, temp hardcode
      post_data.lotNumber = $scope.lot;
      post_data.ndc = $scope.ndc;
      post_data.expirationDate = $scope.expirationDate;
      post_data.quantity = data.quantity;
      post_data.productInfo = $scope.productInfo;
      //post_data.receiverInfo = $scope.receiverInfo;
      post_data.receiverInfo = 2;
      console.log(post_data);

      $http.post(backendUrl + "/drugtrade", post_data)
        .success(function (response) {
          console.log(response);
          ionicToast.show('Manufacturer Send Successful!!', 'bottom', false, 5000);
          // Store response data in browser's local storage
          allTrades.push(response.data);
          localStorage.setItem('trades', JSON.stringify(allTrades));
          $state.go('shipments');


        }).catch(function (err) {
          console.log("Failed");
          ionicToast.show('Manufacturer Send Failed!', 'bottom', false, 5000);
          console.log(err);
        });
    }
  }]);
