angular.module("moduleOverview", [])
    .controller("ctrlOverview", ["$scope", "$location", "sData_allData", "sData_groupsBySubjects", "sData_CUDHandler", 
                                    "sData_email", "sData_setEMailDates", "$mdDialog", "$timeout", "$mdSidenav", "sData_authenticate",
        function ($scope, $location, sData_allData, sData_groupsBySubjects, sData_CUDHandler, 
                                        sData_email, sData_setEMailDates, $mdDialog, $timeout, $mdSidenav, sData_authenticate) {

            if(!sData_authenticate.isAuthenticated())
            {
                $location.path("/");
            }

            $scope.breadcrumb = "Overview-" + sData_allData.data.user.username;
            $scope.state = {};
            $scope.state.awaitingData = true;
            $scope.data = {};
            $scope.data.displayModalGroup = false;
            $scope.colGroupsBySubjects = {};
            $scope.colSubjects = {};
            $scope.colGroups = {};
            $scope.showRename = {};
            $scope.clickedSubject = null;
            $scope.showRename.show = false;

            $scope.toggleshowRename = function () {
                $scope.showRename.show = !$scope.showRename.show;
            }

            $scope.showAddGroup = {};
            $scope.showAddGroup.show = false;

            $scope.toggleshowAddGroup = function () {
                $scope.showAddGroup.show = !$scope.showAddGroup.show;
            }


            $scope.toggleRight = function buildToggler($event) {
                $scope.clickedSubject = $event.target.id;
                var navID = 'right';
                return function () {
                    $scope.sidenav.show = true;
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            console.log("toggle " + navID + " is done");
                        });
                }
            }

            $scope.close = function () {
                $mdSidenav('right').close()
                    .then(function () {
                        console.log("close RIGHT is done");
                    });
            };

            $scope.sidenav = {};
            $scope.sidenav.show = false;

            $scope.close = function () {
                $mdSidenav('right').close()
                    .then(function () {
                        console.log("close RIGHT is done");
                    });
            };

            function debounce(func, wait, context) {
                var timer;

                return function debounced() {
                    var context = $scope,
                        args = Array.prototype.slice.call(arguments);
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        timer = undefined;
                        func.apply(context, args);
                    }, wait || 10);
                };
            }

            function buildDelayedToggler(navID) {
                return debounce(function () {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            console.logdebug("toggle " + navID + " is done");
                        });
                }, 200);
            }

            $scope.data.displayModalSettings = false;
            $scope.show = true;
            $scope.data.currentSettingstab = "Period";


            $scope.status = '  ';

            $scope.showAddSubjectDialog = function (ev) {
                $mdDialog.show({
                    controller: 'ctrlAddSubject',
                    templateUrl: '../../templates/styled_modal_AddSubject.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            $scope.showTabDialog = function (ev) {
                $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: '../../templates/settings_Modal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            sData_groupsBySubjects.fillData().then(function (response) {
                console.log(response);
                $scope.colGroupsBySubjects = sData_groupsBySubjects.data;
                $scope.colSubjects = sData_allData.data.subjects;
                $scope.colGroups = sData_allData.data.groups;
                $scope.state.awaitingData = false;
            }, function (response) {
                console.log("error loading groups by subjects: " + response);
                $scope.state.awaitingData = false;
            })


            $scope.sendEmail = function () {
                sData_email.send().then(function (response) {
                    alert(response);
                }, function (response) {
                    alert("error: ", response);
                })
            }

            $scope.navToGroup = function (id) {
                $location.path("/group/" + id);
            }

            $scope.addNewGroup = function () {
                /*$scope.colGroups.push({idGradeGroup: 1,
                 idGradeSubject: $scope.newGroup.subject.idGradeSubject,
                 name: $scope.newGroup.name});*/

                var data = {
                    idGradeSubject: $scope.clickedSubject,//$scope.newGroup.subject.idGradeSubject,
                    name: $scope.newGroup.name
                };

                console.log(data);
                sData_CUDHandler.insertGroup(data).then(function (response) {
                    console.log("successfuly inserted group: " + response);
                    $scope.switchModalGroup();
                }, function (response) {
                    console.log("error inserting group: " + response);
                });

            }
            $scope.goToOverview = function (){
                $location.path("/overview");
            }
        }])
    .directive('pressableElement', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $elm, $attrs) {
                $elm.bind('mousedown', function (evt) {
                    $scope.longPress = true;
                    $scope.click = true;

                    // onLongPress: on-long-press
                    $timeout(function () {
                        $scope.click = false;
                        if ($scope.longPress && $attrs.onLongPress) {
                            $scope.$apply(function () {
                                $scope.$eval($attrs.onLongPress, {$event: evt});
                            });
                        }
                    }, $attrs.timeOut || 600); // timeOut: time-out

                    // onTouch: on-touch
                    if ($attrs.onTouch) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onTouch, {$event: evt});
                        });
                    }
                });

                $elm.bind('mouseup', function (evt) {
                    $scope.longPress = false;

                    // onTouchEnd: on-touch-end
                    if ($attrs.onTouchEnd) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onTouchEnd, {$event: evt});
                        });
                    }

                    // onClick: on-click
                    if ($scope.click && $attrs.onClick) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onClick, {$event: evt});
                        });
                    }
                });
            }
        };
    });