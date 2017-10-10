myApp.factory('httpPostFactory', function($http){
  service = {};

  service.post = function(post_data, $state, allTrades){
    $http.post(backendUrl + "/drugtrade", post_data)
    .success(function (response) {
      console.log("Manufacturer Post response",response);
      swal({
        title: "Data sent successfully!",
        button: false,
        timer: 1000
      })
      // Store response data in browser's local storage
      allTrades.push(response.data);
      localStorage.setItem('trades', JSON.stringify(allTrades));
      $state.go('shipments');
    }).catch(function (err) {
      swal({
        title: "Oops, there was an error! Please try again",
        button: false,
        timer: 1000
      });
      console.log("Failed", err);
    });
  }

  service.put = function(post_data, $state, alerts ){

    $http.put(backendUrl + "/drugtrade", post_data).then(function (response) {
      swal({
        title: alerts[0],
        button: false,
        timer: 1000
      });
      console.log("Success", response);
      $state.go($state.current, {}, { reload: true });
    }, function (response) {
      swal({
        title: alerts[1],
        button: false,
        timer: 1000
      });
      console.log("Failure", response);
    });

  }

  return service;

})
