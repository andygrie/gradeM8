angular.module("moduleOverview", [])
.controller("ctrlOverview", ["$scope", "$location", //"sData_groupsBySubjects", 
                    function ($scope, $location) {
    //$scope.colGroupsBySubjects = sData_groupsBySubjects.data;
    $scope.colGroupsBySubjects = {
        "Mathe": [
            {idGradeGroup: 1, idGradeSubject: 1, name: "4AHIFS"},
            {idGradeGroup: 2, idGradeSubject: 1, name: "4BHIFS"},
            {idGradeGroup: 3, idGradeSubject: 1, name: "5AHIFS"},
        ],
        "English": [
            {idGradeGroup: 4, idGradeSubject: 2, name: "5BHIFS"},
            {idGradeGroup: 5, idGradeSubject: 2, name: "1AHIT/1"},
        ]
    }

    $scope.navToGroup = function(id){
        $location.path("/group/" + id);
    }
}]);