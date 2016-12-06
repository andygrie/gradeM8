angular.module("moduleLogin", [])
.controller("ctrlLogin", ["$scope", "constants", "$location", "sData_authenticate",
                function ($scope, constants, $location, sData_authenticate) {


    /*
    $scope.colTeachers = [
        {idUser: 1, forename: "Richard", surname: "Ludy"},
        {idUser: 2, forename: "Gerald", surname: "Kidner"}
    ];
    */
    
    $scope.logIn = function (){
        //maybe check for selectedItem
        console.log("working: ", $scope.form.username);
        console.log("working: ", $scope.form.password);

        sData_authenticate.authenticate(form).then(function(response){
            $location.path("/overview");
        }, function(response){
            alert(response);
        })
    }
}]);