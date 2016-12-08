angular.module("moduleLogin", [])
.controller("ctrlLogin", ["$scope", "constants", "$location", "sData_authenticate", 'breadcrumbs',
                function ($scope, constants, $location, sData_authenticate, breadcrumbs) {

    $scope.form = {
        username: "",
        password: ""
    };

    $scope.breadcrumbs = breadcrumbs


    /*
    $scope.colTeachers = [
        {idUser: 1, forename: "Richard", surname: "Ludy"},
        {idUser: 2, forename: "Gerald", surname: "Kidner"}
    ];
    */
    
    $scope.logIn = function (){
        sData_authenticate.authenticate($scope.form).then(function(response){
            $location.path("/overview");
        }, function(response){
            alert("Error authenticating");
            console.log(response);
        })
    }
}]);