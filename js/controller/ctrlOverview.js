angular.module("moduleOverview", [])
.controller("ctrlOverview", ["$scope", "sData_groupsBySubjects", 
                    function ($scope, sData_groupsBySubjects) {
    //$scope.colGroupsBySubjects = sData_groupsBySubjects.data;
    $scope.colGroupsBySubjects = [
            {idSubject: 1, name: "Mathe"},
            {idSubject: 2, name: "Deutsch"}
        ];
    $scope.colGroupsBySubjects[0] = [
                    {idGroup: 1},
                    {idGroup: 2},
                    {idGroup: 3},
        ];
    $scope.colGroupsBySubjects[1] = [
                    {idGroup: 4},
                    {idGroup: 5},
                    {idGroup: 6},
        ];
}]);