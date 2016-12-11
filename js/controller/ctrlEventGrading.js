angular.module("moduleEvent", ['ngMaterial'])
    .controller("ctrlEventGrading", ["$scope", "$routeParams", "$location", "sData_pupilsByGroups", "sData_eventsByGroups",
        "sData_CUDHandler", "sData_allData", "sData_teaches", "sData_classes", "sData_pupilsByClass", "sData_participationsByEvent","$mdDialog",
        function ($scope, $routeParams, $location, sData_pupilsByGroups, sData_eventsByGroups,
                  sData_CUDHandler, sData_allData, sData_teaches, sData_classes, sData_pupilsByClass, sData_participationsByEvent,$mdDialog) {

            $scope.idEvent = $routeParams.idEvent;
            $scope.grade = {};
            $scope.idGradeGroup = $routeParams.idGradeGroup;

                $scope.grade.gradeOptions = [
                    {grade: -1, description: "ungraded"},
                    {grade: 0, description: "abscent"},
                    {grade: 1, description: "1"},
                    {grade: 2, description: "2"},
                    {grade: 3, description: "3"},
                {grade: 4, description: "4"},
                {grade: 5, description: "5"}
            ];

          //  $scope.grade.colParticipations = [];

            $scope.grade.updateGrade = function(item){
                item.isUpdating = true;

                sData_CUDHandler.putParticipation(item).then(function(reponse){
                    item.isUpdating = false;
                    console.log("success updating grade");
                }, function(response){
                    item.isUpdating = false;
                    console.log("update failed");
                    console.log(response);
                });
            }

            $scope.loadParticipationsByEvent = function(paramEventId) {
                sData_participationsByEvent.fillData({idEvent: paramEventId}).then(function(response){
                    console.log(response);
                    $scope.grade.colParticipations = sData_participationsByEvent.data.map(function(item){
                        item.isUpdating = false;
                        return item;
                    });
                    console.log($scope.grade.colParticipations);
                }, function(response){
                    console.log(response);
                });
            }
            $scope.$on('$ionicView.enter', function(){
                $scope.loadParticipationsByEvent($scope.idEvent);
                alert("This function just ran away");
            });

            $scope.back = function () {
                $location.path("/group/" +$scope.idGradeGroup);
            }
            $scope.$on('$viewContentLoaded', function() {
                $scope.loadParticipationsByEvent($scope.idEvent);
            });
            $scope.$on('$stateChangeSuccess', function () {
                alert("This function just ran away");
            });




    }]);