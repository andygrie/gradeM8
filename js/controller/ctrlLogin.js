angular.module("moduleLogin", [])
.controller("ctrlLogin", ["$scope", "constants", "$location", "sData_authenticate",
                function ($scope, constants, $location, sData_authenticate) {

    $scope.form = {
        username: "",
        password: ""
    };

    /*
    $scope.colTeachers = [
        {idUser: 1, forename: "Richard", surname: "Ludy"},
        {idUser: 2, forename: "Gerald", surname: "Kidner"}
    ];
    */
    
    $scope.logIn = function (){
        //maybe check for selectedItem
        console.log("working: ", $scope.form.username);

        sData_authenticate.authenticate($scope.form).then(function(response){
            $location.path("/overview");
        }, function(response){
            alert(response);
        })
    }
}]);