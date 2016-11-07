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
          url: constants.apiUrl + "/class"
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
          method: "GET",
          url: constants.apiUrl + "/teacher/sendGrades/" + constants.teacherId
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
  return function(resolve, reject, classId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/pupil/byClass/" + classId
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
  return function(resolve, reject, groupId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/event/byGroup/" + groupId
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
  return function(resolve, reject, eventId, pupilId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/participation/byEvent/" + eventId
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
          url: constants.apiUrl + "/note/byTeachesAndPupil/" + data.fkTeaches + "/" + data.fkPupil,
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

/* Unsinnig, kläre AD
.factory('sWeb_setPupil', ['$http', 'constants', 
                    function($http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/pupil",
          data: {
              "forename": data.forename,
              "surname": data.surname,
              "email": data.email,
              "password": data.password,
              "fkClass": data.classId
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])
*/
//noch unsicher
//for initialization as well as for updating
.factory('sWeb_setAssigned', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/assigned",
          data: {
              "idGroup": data.id,
              "colPupil": data.colPupil
          }
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  }
}])

//noch unsicher
.factory('sWeb_setEvent', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return function(resolve, reject, data){
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

//noch unsicher
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
          method: "POST",
          url: constants.apiUrl + "/participation/" + data.idParticipation,
          data: {
              "grade": data.grade,
              "abscent": data.abscent
          }
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  }
}])