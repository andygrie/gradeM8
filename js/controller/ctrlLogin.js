angular.module("moduleLogin", [])
.controller("ctrlLogin", ["$scope", "constants", "sData_teachers", "$location", 
                function ($scope, constants, sData_teachers, $location) {
    //$scope.colTeachers = sData_teachers.data;
    $scope.colTeachers = [
        {idTeacher: 1, forename: "Richard", surname: "Ludy"},
        {idTeacher: 2, forename: "Gerald", surname: "Kidner"}
    ];
    $scope.selectedItem = 0;
    $scope.loginError = false;
    
    $scope.logIn = function (){
        //maybe check for selectedItem
        console.log("working");
        constants.teacherId = $scope.selectedItem;
        if(constants.teacherId != null)
        {
            $location.path("/overview");
        }
        else
        {
            $scope.loginError = true;
        }
    }
}]);