angular.module("moduleLogin", [])
.controller("ctrlLogin", ["$scope", "constants", "sData_teachers", "$location", 
                function ($scope, constants, sData_teachers, $location) {
    
    sData_teachers.fillData().then(function(response){
        $scope.colTeachers = sData_teachers.data;
        console.log("success loading teachers: " + response);
    }, function(response){
        console.log("error loading teachers: " + response);
    })

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