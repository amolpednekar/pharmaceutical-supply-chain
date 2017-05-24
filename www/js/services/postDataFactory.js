// myApp.factory('postDataFactory', ['$scope', '$http',
//     function ($scope, $http) {

//       var service = {};

//       service.postData = function (data, callback) {
//         console.log(data);

//         var post_data = {};

//         post_data.email = data.email;
//         post_data.name = data.fname + " " + data.lname;

//         console.log("Register user ", post_data);

//         $http.post(apiUrl + "/api/users", post_data)
//           .success(function (response) {
//             console.log(response);
//             callback({ data: response })
//           }).catch(function (err) {
//             console.log(err)
//             callback({ data: err })
//           });
//       };
//     }]);
