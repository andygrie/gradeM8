angular.module("moduleLogin", [])
.controller("ctrlLogin", ["$scope", "constants", "$location", "sData_authenticate",
                function ($scope, constants, $location, sData_authenticate) {

                    $scope.show = false;

    $scope.form = {
        username: "",
        password: ""
    };

    $scope.form.awaitingLoginResponse = false;

    $scope.breadcrumb = "login";


    /*
    $scope.colTeachers = [
        {idUser: 1, forename: "Richard", surname: "Ludy"},
        {idUser: 2, forename: "Gerald", surname: "Kidner"}
    ];
    */
    
    $scope.logIn = function (){
        $scope.form.awaitingLoginResponse = true;

        sData_authenticate.authenticate($scope.form).then(function(response){
            $scope.form.awaitingLoginResponse = false;
            $location.path("/overview");
        }, function(response){
            $scope.form.awaitingLoginResponse = false;
            alert("Error authenticating");
            console.log(response);
        })
    }
}]);