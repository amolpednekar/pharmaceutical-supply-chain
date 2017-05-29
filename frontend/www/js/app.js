//mycontrollerModule = angular.module('app.controllers', ['ionic']);

myApp = angular.module('app', ['ionic','app.controllers','ionic-toast','qrScanner']);

myApp.run(function ($ionicPlatform,$rootScope) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs).
      // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
      // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
      // useful especially with forms, though we would prefer giving the user a little more room
      // to interact with the app.
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // Set the statusbar to use the default style, tweak this to
        // remove the status bar on iOS or change it to use white instead of dark colors.
        StatusBar.styleDefault();
      }

    });
  })
  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl',
        cache: false,
      })
      .state('manufacturer', {
        url: '/manufacturer',
        templateUrl: 'templates/manufacturer.html',
        controller: 'manufacturerCtrl',
        cache: false,
      })
      .state('distributor', {
        url: '/distributor',
        templateUrl: 'templates/distributor.html',
        controller: 'distributorCtrl',
        cache: false,
      })
      .state('pharmacy', {
        url: '/pharmacy',
        templateUrl: 'templates/pharmacy.html',
        controller: 'pharmacyCtrl',
        cache: false,
      })
      .state('customer', {
        url: '/customer',
        templateUrl: 'templates/customer.html',
        controller: 'customerCtrl',
        cache: false,
      })
      .state('shipments', {
        url: '/shipments',
        templateUrl: 'templates/shipments.html',
        controller: 'shipmentsCtrl',
        cache: false,
      });


      $urlRouterProvider.otherwise('/home');
  });
