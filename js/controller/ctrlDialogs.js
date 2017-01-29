angular.module("moduleDialogs", [])
    .controller("DialogController", ["$scope", "sData_allData", "sData_CUDHandler", "$mdDialog",
        function ($scope, sData_allData, sData_CUDHandler, $mdDialog) {
            $scope.myDate = new Date();

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

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
        }])

    .controller("EditEventController", ["$scope", "$routeParams", "sData_allData", "sData_CUDHandler", "$mdDialog",
        function ($scope, $routeParams, sData_allData, sData_CUDHandler, $mdDialog) {

            $scope.event = findEventById($routeParams.idGradeEvent);

            function findEventById(paramId){
                $scope.originalEvent = null;
                var events = sData_allData.events;
                
                for(var i = 0; i < events.length && $scope.originalEvent == null; i++)
                {
                    if(events[i].idGradeEvent == paramId)
                    {
                        $scope.originalEvent = events[i];
                    }
                }

                return {
                    idGradeEvent: $scope.originalEvent.idGradeEvent,
                    fkTeaches: $scope.originalEvent.fkTeaches,
                    eventDate: $scope.originalEvent.eventDate,
                    eventDescription: $scope.originalEvent.eventDescription
                }
            }

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.updateEvent = function () {
                var data = $scope.event;

                sData_CUDHandler.updateEvent(data).then(function (response) {
                    console.log("successfuly updated event: " + response);

                    $scope.originalEvent.eventDate = data.eventDate;
                    $scope.originalEvent.eventDescription = data.eventDescription;

                    $scope.hide();
                }, function (response) {
                    console.log("error updating event: " + response);
                });
            }
        }])
    .controller("AddEventController", ["$scope", "$routeParams", "sData_teaches", "sData_allData", "sData_groupsBySubjects", "sData_CUDHandler", "$mdDialog",
        function ($scope, $routeParams, sData_teaches, sData_allData, sData_groupsBySubjects, sData_CUDHandler, $mdDialog) {


            $scope.newEvent = {};
            $scope.newEvent.eventDate = new Date();
            $scope.idGradeGroup = $routeParams.idGradeGroup;

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.insertNewEvent = function () {
                var data = {
                    idGradeGroup: $scope.idGradeGroup,
                    fkTeaches: $scope.teaches.idTeaches,
                    eventDate: $scope.newEvent.eventDate,
                    eventDescription: $scope.newEvent.eventDescription
                };
                sData_CUDHandler.insertEvent(data).then(function (response) {
                    console.log("successfuly inserted event: " + response);

                    var dataInner = {};
                    dataInner.idGradeEvent = response.idGradeEvent;
                    dataInner.colPupils = [{
                        fkPupil: parseInt($scope.data.idPupil),
                        grade: -1
                    }];
                    sData_CUDHandler.insertParticipation(dataInner).then(function (responseData) {
                        console.log("successfully inserted participations, now should follow response data <.<");
                        console.log(responseData);

                        $scope.data.ungradedEvents.push(response);
                        $scope.data.ungradedParticipations.push(responseData[0]);
                        $scope.data.colParticipations.push(responseData[0]);

                        $scope.hide();
                    }, function (response) {
                        console.log("error inserting participations" + response);
                    })

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

            sData_teaches.fillData({idGradeSubject: $scope.idGradeSubject}).then(function (response) {
                console.log(response);
                $scope.teaches = findTeaches();
            }, function (response) {
                console.log("error loading teaches: " + response);
            })
        }])
    .controller("AddNoteController", ["$scope", "$routeParams", "sData_CUDHandler","sData_allData", "$mdDialog",
        function ($scope, $routeParams, sData_CUDHandler,sData_allData, $mdDialog) {

            $scope.data = {};
            $scope.data.idGradeGroup = $routeParams.idGradeGroup;
            $scope.data.idPupil = $routeParams.idPupil;

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.insertNewNote = function () {

                var data = {
                    idTeaches: $scope.data.teaches.idTeaches,
                    idPupil: $scope.data.idPupil,
                    note: $scope.newNote.note
                }
                console.log(data);

                sData_CUDHandler.insertNote(data).then(function (responseData) {
                    console.log("successfuly inserted note: " + responseData);
                    // $scope.data.colNotes.push(responseData);
                    $scope.hide()
                }, function (response) {
                    console.log("error inserting note: " + response);
                });
            }

            function findTeaches() {
                var retVal = null;

                var colTeaches = sData_allData.data.teaches;
                for (var i = 0; i < colTeaches.length && retVal == null; i++) {
                    if (colTeaches[i].fkGradeGroup == $scope.data.idGradeGroup)
                        retVal = colTeaches[i];
                }

                return retVal;
            }
            $scope.data.teaches = findTeaches();

        }])
    .controller("ctrlAddSubject", ["$scope", "sData_CUDHandler", "$mdDialog",
        function ($scope, sData_CUDHandler, $mdDialog) {

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            $scope.addNewSubject = function () {
                //$scope.colSubjects.push({idGradeSubject: 1, name: $scope.newSubject.name});
                var data = {
                    name: $scope.newSubject.name
                };
                console.log(data);
                sData_CUDHandler.insertSubject(data).then(function (response) {
                    console.log("successfuly inserted subj: " + response);
                    $scope.hide();
                }, function (response) {
                    console.log("error inserting subj: " + response);
                });
            }
        }])
    .controller("AddPupilController", ["$scope", "$mdDialog", "$routeParams", "sData_classes", "sData_CUDHandler", "sData_pupilsByGroups",  
        function ($scope, $mdDialog, $routeParams, sData_classes, sData_CUDHandler, sData_pupilsByGroups) {
            $scope.idGradeGroup = $routeParams.idGradeGroup;
            $scope.classesSelected = false;
            $scope.colPupils = [];
            $scope.colClasses = [];
            $scope.colAdPupils = [];
            $scope.colSelectedClasses = [];
            $scope.colSelectedPupils = [];
            $scope.auto = {};
            $scope.auto.selectedItem = null;
            $scope.auto.searchText = null;


            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

        // Autocomplete

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

            $scope.registerPupils = function () {
                var paramData = {
                    idGradeGroup: $scope.idGradeGroup,
                    pupils: $scope.colSelectedPupils
                }

                sData_CUDHandler.registerPupils(paramData).then(function (response) {
                    console.log(response);
                    $scope.colPupils = sData_pupilsByGroups.data[$scope.idGradeGroup];
                    $scope.cancel();
                }, function (response) {
                    console.log(response);
                })
            }

            $scope.loadClasses = function () {
                sData_classes.fillData().then(function (response) {
                    console.log(response);
                    $scope.colClasses = sData_classes.data;
                    console.log("finished loading classes");
                }, function (response) {
                    console.log("error filling classes: ");
                    console.log(response);
                });
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

            $scope.loadAdPupils = function () {
                console.log("in loadAdPupils");
                loadPupilsOfClass($scope.colSelectedClasses, 0, function (msg) {
                    $scope.classesSelected = true;
                    console.log("successfully loaded Pupils of selected Classes");
                    console.log(msg);
                }, function (msg) {
                    console.log("error loading pupils");
                    console.log(msg);
                });
            }

            angular.element(document).ready(function () {
                $scope.loadClasses();
            });

        }]);



