angular.module("moduleLogin", [])
.controller("ctrlLogin", ["$scope", "constants", "sData_teachers", "$location", 
                function ($scope, constants, sData_teachers, $location) {
    
    sData_teachers.fillData().then(function(response){
        $scope.colTeachers = sData_teachers.data;
        console.log("success loading teachers: " + response);
        console.log(sData_teachers.data);
        console.log(sData_teachers.dataTest);
    }, function(response){
        console.log("error loading teachers: " + response);
    })

    /*
    $scope.colTeachers = [
        {idTeacher: 1, forename: "Richard", surname: "Ludy"},
        {idTeacher: 2, forename: "Gerald", surname: "Kidner"}
    ];
    */
    $scope.selectedItem = 0;
    $scope.loginError = false;
    
    $scope.logIn = function (){
        //maybe check for selectedItem
        console.log("working");
        if($scope.selectedItem != null)
        {
            constants.teacherId = $scope.selectedItem;
            $location.path("/overview");
        }
        else
        {
            $scope.loginError = true;
        }
    }
}]);