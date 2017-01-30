angular.module('moduleWeb', [])

//GET -------------------------------------------------------------------------
    .factory('sWeb_getTeacher', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject){
        $http({
            method: "GET",
            url: constants.apiUrl + "/teacher"
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getClass', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject){
        $http({
            method: "GET",
            url: constants.apiUrl + "/class/fromAD"
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_sendEmail', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject){
        $http({
            method: "POST",
            url: constants.apiUrl + "/teacher/sendGrades/" + constants.teacherId
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])
        .factory('sWeb_setEMailDates', ["$q", '$http', 'constants',
            function($q, $http, constants) {
                console.log("in service Web");
                return function(resolve, reject, data) {
                    $http({
                        method: "POST",
                        url: constants.apiUrl + "/teacher/sendGrades/byGradedOnDate",
                        data: {
                            "idTeacher": data.idTeacher,
                            "lowerDate": data.von,
                            "upperDate": data.bis
                        }
                    }).then(function(response){
                        resolve(response.data);
                    }, function(response){
                        reject(response);
                    });
                }
            }])
    /*
    .factory('sWeb_getTeaches', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject){
        $http({
            method: "GET",
            url: constants.apiUrl + "/teaches"
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])
    */
    .factory('sWeb_getPupilByClass', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "POST",
            url: constants.apiUrl + "/pupil/byClass/fromAD",
            data:{
                name: data.classname
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getPupilByGroup', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, groupId){
        $http({
            method: "GET",
            url: constants.apiUrl + "/pupil/byGroup/" + groupId
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getEventByGroup', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "GET",
            url: constants.apiUrl + "/event/byGroup/" + data.idGradeGroup
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getGroupByTeacherAndSubject', ["$http", "constants", 
                                            function($http, constants) {
    return function(resolve, reject, data){
        $http({
        method : "GET",
        url: constants.apiUrl + "/group/byTeacherAndSubject/" + constants.teacherId + "/" + data.idGradeSubject
        }).then(function(response){
            resolve(response.data);
        }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getSubjectByTeacher', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject){
        $http({
            method: "GET",
            url: constants.apiUrl + "/subject/byTeacher/" + constants.teacherId
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getTeachesByTeacherAndSubject', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "GET",
            url: constants.apiUrl + "/teaches/byTeacherAndSubject/" + constants.teacherId + "/" + data.idGradeSubject
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getParticipationByEvent', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "GET",
            url: constants.apiUrl + "/participation/pupil/byEvent/" + data.idGradeEvent
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getParticipationByPupilAndTeaches', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "GET",
            url: constants.apiUrl + "/participation/byPupilAndTeaches/" + data.idPupil + "/" + data.idTeaches
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getParticipationHistory', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "GET",
            url: constants.apiUrl + "/participation/history/" + data.idParticipation
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getParticipationByPupilAndTeaches', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "GET",
            url: constants.apiUrl + "/participation/byPupilAndTeaches/" + data.idPupil + "/" + data.idTeaches
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getNoteHistory', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "GET",
            url: constants.apiUrl + "/note/history/" + data.idNote
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_getNoteByTeachesAndPupil', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "GET",
            url: constants.apiUrl + "/note/byTeachesAndPupil/" + data.idTeaches + "/" + data.idPupil
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

//POST -------------------------------------------------------------------------

    .factory('sWeb_authenticate', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, userData){
        $http({
            method: "POST",
            url: constants.apiUrl + "/login",
            data:{
                "username": userData.username,
                "password": userData.password
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_registerPupils', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "POST",
            url: constants.apiUrl + "/pupil",
            data: data
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_setSubject', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "POST",
            url: constants.apiUrl + "/subject",
            data: {
                "name": data.name
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_setGroup', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "POST",
            url: constants.apiUrl + "/group",
            data: {
                "name": data.name
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_setTeaches', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "POST",
            url: constants.apiUrl + "/teaches",
            data: {
                "fkTeacher": constants.teacherId,
                "fkGradeGroup": data.idGradeGroup,
                "fkGradeSubject": data.idGradeSubject
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_setNoteByTeachesAndPupil', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "POST",
            url: constants.apiUrl + "/note/byTeachesAndPupil/" + data.idTeaches + "/" + data.idPupil,
            data: {
                "note": data.note
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    //for initialization as well as for updating
    .factory('sWeb_setAssigned', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "POST",
            url: constants.apiUrl + "/assigned/" + data.idGradeGroup,
            data: data.colPupils
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_setEvent', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        data.eventDate.setDate(data.eventDate.getDate() + 1);
        $http({
            method: "POST",
            url: constants.apiUrl + "/event",
            data: {
                "fkTeaches": data.fkTeaches,
                "eventDate": data.eventDate,
                "eventDescription": data.eventDescription
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    //for initialization as well as for updating
    .factory('sWeb_setParticipation', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "POST",
            url: constants.apiUrl + "/participation/" + data.idGradeEvent,
            data: data.colPupils
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

//PUT -------------------------------------------------------------------------
    .factory('sWeb_putParticipation', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "PUT",
            url: constants.apiUrl + "/participation/" + data.idParticipation,
            data: {
                "grade": data.grade
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_putNote', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "PUT",
            url: constants.apiUrl + "/note/" + data.idNote,
            data: {
                "note": data.note
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_putEvent', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "PUT",
            url: constants.apiUrl + "/event/" + data.idGradeEvent,
            data: {
                fkTeaches: data.fkTeaches,
                eventDate: data.eventDate,
                eventDescription: data.eventDescription
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

    .factory('sWeb_putTeaches', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "PUT",
            url: constants.apiUrl + "/teaches/" + data.idTeaches,
            data: {
                fkTeacher: constants.teacherId,
                fkGradeGroup: data.fkGradeGroup,
                fkGradeSubject: data.fkGradeSubject
            }
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])

//DELETE
    .factory('sWeb_deleteEvent', ["$q", '$http', 'constants', 
                        function($q, $http, constants) {
    return function(resolve, reject, data){
        $http({
            method: "DELETE",
            url: constants.apiUrl + "/event/" + data.idGradeEvent
        }).then(function(response){
            resolve(response.data);
            }, function(response){
            reject(response);
        });
    }
    }])