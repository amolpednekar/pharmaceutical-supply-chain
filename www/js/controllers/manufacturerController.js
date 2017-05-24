myApp.controller('manufacturerCtrl', ['$scope', '$http', '$state',
  function ($scope, $http, $state) {
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

    }, {
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

    // $http.get('productdetails.json').then(function (data) {
    //   $scope.phones = data;
    //   console.log("success")
    // });

    var value;
    $scope.$on("$ionicView.beforeEnter", function () {

      $scope.ndc = Math.round((Math.random() * 100000) * 100000);
      $scope.lot = Math.round((Math.random() * 10000) * 10000);
      $scope.expirationDate = new Date();
      $('#productid').change(function () {
        selected = $('option:selected', this).attr('value');
        console.log($scope.products.length)
        for (var i = 0; i < $scope.products.length; i++) {
          value = $scope.products[i].pid;
          console.log("Value" + value);
          console.log(selected);
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
          console.log("Value" + value);
          console.log(selected);
          if (value == selected) {
            $scope.receiverInfo = $scope.receivers[i];
            $scope.$apply();
            break;
          }
        }
        $('#receiverDetails').show();
      });

    });

    $scope.ManufacturerForm = function (data) {
      $scope.expirationDateSub = new Date().getTime();
      //console.log();
      var post_data = {};
      post_data.manufacturerID = 1; //postion in JSON, temp hardcode
      post_data.lotNumber = $scope.lot;
      post_data.ndc = $scope.ndc;
      post_data.expirationDate = $scope.expirationDateSub;
      post_data.quantity = data.quantity;
      post_data.productInfo = $scope.productInfo;
      post_data.receiverInfo = $scope.receiverInfo;
      console.log(post_data);
      //console.log(post_data);

      $http.post("http://10.244.51.105:8080", post_data)
        .success(function (response) {

          console.log(response);

        }).catch(function (err) {

          console.log(err);


        });
      $state.go('shipments');

    }


  }]);
