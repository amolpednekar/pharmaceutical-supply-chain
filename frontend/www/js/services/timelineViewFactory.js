myApp.factory('TimelineViewService', function () {
  return {
    timeline: function ($scope) {
      (function () {
        'use strict';

        $scope.scrollListener = function () {
          console.log("scrollListener");
          callbackFunc();
        }
        console.log("scope in test ", $scope.tradeFlow)
        // define variables
        var items = document.querySelectorAll(".timeline li");
        console.log("items size", items.length)
        callbackFunc();
        // check if an element is in viewport
        // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
        function isElementInViewport(el) {
          var rect = el.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
        }

        function callbackFunc() {
          for (var i = 0; i < items.length; i++) {
            if (isElementInViewport(items[i])) {
              console.log("isElementInViewport", isElementInViewport(items[i]))
              items[i].classList.add("in-view");
            }
          }
        }

        // listen for resize events
        window.addEventListener("resize", callbackFunc);

        // The below lines dont work for load/ion-content scrolling
        //window.addEventListener("scroll", callbackFunc);
        //window.addEventListener("load", callbackFunc);

      })();
    }
  }
});
