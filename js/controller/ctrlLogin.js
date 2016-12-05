angular.module("moduleLogin", [])
.controller("ctrlLogin", ["$scope", "constants", "$location",
                function ($scope, constants, $location) {

    /*
    $scope.colTeachers = [
        {idUser: 1, forename: "Richard", surname: "Ludy"},
        {idUser: 2, forename: "Gerald", surname: "Kidner"}
    ];
    */
    
    $scope.logIn = function (){
        //maybe check for selectedItem
        console.log("working: ", $scope.form.idUser);
        constants.teacherId = $scope.form.idUser;
        $location.path("/overview");
    }
}]);