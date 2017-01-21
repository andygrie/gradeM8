angular.module("moduleGroup", ['ngMaterial'])
    .controller("ctrlGroup", ["$scope", "$routeParams", "$location", "sData_pupilsByGroups", "sData_eventsByGroups",
        "sData_CUDHandler", "sData_allData", "sData_teaches", "sData_classes", "sData_pupilsByClass", "sData_participationsByEvent", "$mdDialog",
        function ($scope, $routeParams, $location, sData_pupilsByGroups, sData_eventsByGroups,
                  sData_CUDHandler, sData_allData, sData_teaches, sData_classes, sData_pupilsByClass, sData_participationsByEvent, $mdDialog) {

            $scope.idGradeGroup = $routeParams.idGradeGroup;


            $scope.data = {};
            $scope.data.displayModalEvent = false;
            $scope.data.displayModalPupil = false;
            $scope.data.displayModalEventDetail = false;

            $scope.state = {};
            $scope.state.awaitingPupilData = true;
            $scope.state.awaitingEventData = true;

            $scope.newEvent = {};
            $scope.newEvent.eventDate = new Date();

            $scope.grade = {};
            $scope.grade.gradeOptions = [
                {grade: -1, description: "ungraded"},
                {grade: 0, description: "abscent"},
                {grade: 1, description: "1"},
                {grade: 2, description: "2"},
                {grade: 3, description: "3"},
                {grade: 4, description: "4"},
                {grade: 5, description: "5"}
            ];
            $scope.grade.colParticipations = [];
            $scope.grade.updateGrade = function (item) {
                item.isUpdating = true;

                sData_CUDHandler.putParticipation(item).then(function (reponse) {
                    item.isUpdating = false;
                    console.log("success updating grade");
                }, function (response) {
                    item.isUpdating = false;
                    console.log("update failed");
                    console.log(response);
                });
            }

            $scope.classesSelected = false;
            $scope.colPupils = [];
            $scope.colClasses = [];
            $scope.colAdPupils = [];
            $scope.colSelectedClasses = [];
            $scope.colSelectedPupils = [];
            $scope.colParticipations = [];
            $scope.colEvents = [];

// Breadcrumbs
            $scope.data.displayModalSettings = false;
            $scope.show = true;
            $scope.data.currentSettingstab = "Period";

            var groupname = function () {
                var group;
                sData_allData.data.groups.forEach(function (entry) {
                    if (entry.idGradeGroup == $routeParams.idGradeGroup) {

                        group = entry.name;
                    }
                });
                return group;
            };
            $scope.breadcrumb = groupname();


            $scope.status = '  ';

            $scope.showTabDialog = function (ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: '../../templates/settings_Modal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            function DialogController($scope, $mdDialog) {

                // $scope.eMailDates.von = "";
                // $scope.eMailDates.bis =  "";

                $scope.setEmails = function () {
                    var data = {
                        idTeacher: sData_allData.data.user.idUser,
                        von: $scope.eMailDates.von,
                        bis: $scope.eMailDates.bis
                    };
                    sData_CUDHandler.insertEMailDates(data).then(function (response) {
                        console.log("successfuly inserted new Mail Dates");
                    }, function (response) {
                        console.log("error inserting subj: " + response);
                    });
                    $mdDialog.hide();
                };


                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }

// Autocomplete
            $scope.auto = {};
            $scope.auto.selectedItem = null;
            $scope.auto.searchText = null;
            /**
             * Return the proper object when the append is called.
             */
            $scope.auto.transformChip = function transformChip(chip) {
                // If it is an object, it's already a known chip
                if (angular.isObject(chip)) {
                    return chip;
                }

                // Otherwise, create a new one
                return {name: chip};
            }

            /**
             * Search for classes.
             */
            $scope.auto.querySearch = function querySearch(query) {
                var results = query ? $scope.colClasses.filter(createFilterFor(query)) : [];
                return results;
            }

            /**
             * Create filter function for a query string
             */
            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(paramClass) {
                    return (paramClass.name.toLowerCase().indexOf(lowercaseQuery) === 0);
                };

            }

// Check
            $scope.check = {};

            $scope.check.toggle = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }
            };

            $scope.check.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };

            $scope.check.isIndeterminate = function () {
                return ($scope.colSelectedPupils.length !== 0 &&
                $scope.colSelectedPupils.length !== $scope.colAdPupils.length);
            };

            $scope.check.isChecked = function () {
                return $scope.colSelectedPupils.length === $scope.colAdPupils.length;
            };

            $scope.check.toggleAll = function () {
                if ($scope.colSelectedPupils.length === $scope.colAdPupils.length) {
                    $scope.colSelectedPupils = [];
                } else if ($scope.colSelectedPupils.length === 0 || $scope.colSelectedPupils.length > 0) {
                    $scope.colSelectedPupils = $scope.colAdPupils.slice(0);
                }
            };

// Other Functions
            $scope.getSubjectOfGroup = function () {
                var retVal = null;
                var colGroups = sData_allData.data.groups;
                for (var i = 0; i < colGroups.length && retVal == null; i++) {
                    if (colGroups[i].idGradeGroup == $scope.idGradeGroup)
                        retVal = colGroups[i].idGradeSubject;
                }

                return retVal;
            }

            $scope.idGradeSubject = $scope.getSubjectOfGroup();
            sData_pupilsByGroups.fillData({idGradeGroup: $scope.idGradeGroup}).then(function (response) {
                console.log("success loading pupils");
                $scope.state.awaitingPupilData = false;
                $scope.colPupils = sData_pupilsByGroups.data[$scope.idGradeGroup];
            }, function (response) {
                $scope.state.awaitingPupilData = false;
                console.log("error loading pupils by groups: " + response);
            })

            sData_teaches.fillData({idGradeSubject: $scope.idGradeSubject}).then(function (response) {
                console.log(response);
                $scope.teaches = findTeaches();
            }, function (response) {
                console.log("error loading teaches: " + response);
            })

            sData_eventsByGroups.fillData({idGradeGroup: $scope.idGradeGroup}).then(function (response) {
                $scope.state.awaitingEventData = false;
                $scope.colEvents = sData_eventsByGroups.data;
            }, function (response) {
                $scope.state.awaitingEventData = false;
                console.log("error loading pupils by groups: " + response);
            })

            $scope.displayParticipationsOfEvent = function (paramEventId) {
                // $scope.switchModalEventDetail();
                $scope.loadParticipationsByEvent(paramEventId);
                $location.path("/group/" + $scope.idGradeGroup + "/" + paramEventId);
            }

            $scope.loadParticipationsByEvent = function (paramEventId) {
                sData_participationsByEvent.fillData({idGradeEvent: paramEventId}).then(function (response) {
                    console.log(response);
                    $scope.grade.colParticipations = sData_participationsByEvent.data.map(function (item) {
                        item.isUpdating = false;
                        return item;
                    });

                    console.log($scope.grade.colParticipations);
                }, function (response) {
                    console.log(response);
                });
            }

            $scope.displayAddPupil = function () {
                $scope.switchModalPupil();
                $scope.loadClasses();
            }

            $scope.registerPupils = function () {
                var paramData = {
                    idGradeGroup: $scope.idGradeGroup,
                    pupils: $scope.colSelectedPupils
                }

                sData_CUDHandler.registerPupils(paramData).then(function (response) {
                    console.log(response);
                    $scope.colPupils = sData_pupilsByGroups.data[$scope.idGradeGroup];
                    $scope.switchModalPupil();
                }, function (response) {
                    console.log(response);
                })
            }

            $scope.loadClasses = function () {
                sData_classes.fillData().then(function (response) {
                    console.log(response);
                    $scope.colClasses = sData_classes.data;
                }, function (response) {
                    console.log("error filling classes: ");
                    console.log(response);
                });
            }

            $scope.loadAdPupils = function () {
                loadPupilsOfClass($scope.colSelectedClasses, 0, function (msg) {
                    $scope.classesSelected = true;
                    console.log("successfully loaded Pupils of selected Classes");
                    console.log(msg);
                }, function (msg) {
                    console.log("error loading pupils");
                    console.log(msg);
                })
            }

            function loadPupilsOfClass(classnames, index, onDone, onError) {
                sData_pupilsByClass.fillData({classname: classnames[index].name}).then(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        $scope.colAdPupils.push(response[i]);
                    }
                    index++;
                    if (index < classnames.length) {
                        loadPupilsOfClass(classnames, index, onDone, onError);
                    }
                    else {
                        onDone($scope.colAdPupils);
                    }
                }, onError)
            }

            $scope.switchModalEvent = function () {
                $scope.data.displayModalEvent = !$scope.data.displayModalEvent;
            }
            $scope.switchModalPupil = function () {
                $scope.data.displayModalPupil = !$scope.data.displayModalPupil;
            }
            $scope.switchModalSettings = function () {
                $scope.data.displayModalSettings = !$scope.data.displayModalSettings;
            }

            $scope.setSettingTabToPeriod = function () {
                $scope.data.currentSettingstab = "Period";
            }

            $scope.setSettingTabToWeekdays = function () {
                $scope.data.currentSettingstab = "Weekdays";
            }

            $scope.switchModalEventDetail = function () {
                $scope.data.displayModalEventDetail = !$scope.data.displayModalEventDetail;
            }
            $scope.navBack = function () {
                $location.path("/overview");
            }

            $scope.navToPupil = function (idPupil) {
                $location.path("/pupil/" + idPupil + "/" + $scope.idGradeGroup);
            }

            $scope.insertNewEvent = function () {
                var data = {
                    idGradeGroup: $scope.idGradeGroup,
                    fkTeaches: $scope.teaches.idTeaches,
                    eventDate: $scope.newEvent.eventDate,
                    eventDescription: $scope.newEvent.eventDescription
                };

                console.log("insert event data: ");
                console.log(data);
                sData_CUDHandler.insertEvent(data).then(function (response) {
                    console.log("successfuly inserted event: " + response);

                    var dataInner = {};
                    dataInner.idGradeEvent = response.idGradeEvent;
                    dataInner.colPupils = [];
                    for (var i = 0; i < $scope.colPupils.length; i++) {
                        dataInner.colPupils.push({
                            fkPupil: $scope.colPupils[i].fkUser,
                            grade: -1
                        });
                    }

                    sData_CUDHandler.insertParticipation(dataInner).then(function (responseData) {
                        console.log("successfully inserted participations");
                        $scope.switchModalEvent();
                    }, function (response) {
                        console.log("error inserting participations" + response);
                    });

                }, function (response) {
                    console.log("error inserting event: " + response);
                });
            }

            function findTeaches() {
                var retVal = null;
                var colTeaches = sData_allData.data.teaches;
                console.log("teaches: ");
                console.log(colTeaches);
                for (var i = 0; i < colTeaches.length && retVal == null; i++) {
                    if (colTeaches[i].fkGradeGroup == $scope.idGradeGroup) {
                        retVal = colTeaches[i];
                    }
                }

                if (retVal == null)
                    console.log("no teaches found");
                console.log("retValTeaches: ");
                console.log(retVal);
                return retVal;
            }

//
        }]);