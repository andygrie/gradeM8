angular.module('moduleWeb', [])

//GET -------------------------------------------------------------------------
.factory('sWeb_getTeacher', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject){
      $http({
          method: "GET",
          url: constants.apiUrl + "/teacher"
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getPupilByClass', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, classId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/pupil/byClass/" + classId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getPupilByGroup', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, groupId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/pupil/byGroup" + groupId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getEventByGroup', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, groupId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/gradeEvent/byGroup" + groupId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getGroupByTeacherAndSubject', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, subjectId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/group/byTeacherAndSubject/" + constants.teacherId + "/" + subjectId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getSubjectByTeacher', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject){
      $http({
          method: "GET",
          url: constants.apiUrl + "/subject/byTeacher/" + constants.teacherId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getTeachesByTeacherAndSubject', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, subjectId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/teaches/byTeacherAndSubject/" + constants.teacherId + "/" + subjectId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getParticipationByEvent', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, eventId, pupilId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/participation/byEvent/" + eventId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_getParticipationByPupilAndTeaches', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, pupilId, teachesId){
      $http({
          method: "GET",
          url: constants.apiUrl + "/participation/byPupilAndTeaches/" + pupilId + "/" + teachesId
      }).then(function(response){
          resolve(response.data);
        }, function(response){
          reject(response);
      });
  })
}])

//POST -------------------------------------------------------------------------

.factory('sWeb_setSubject', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/subject",
          data: {
              "name": data.name
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])

.factory('sWeb_setGroup', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/group",
          data: {
              "name": data.name
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
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
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/assigned",
          data: {
              "idGroup": data.id,
              "colPupil": data.colPupil
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])

//noch unsicher
.factory('sWeb_setEvent', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/gradeEvent",
          data: {
              "fkTeaches": data.idTeaches,
              "eventDate": data.date,
              "eventDescription": data.description
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])

//noch unsicher
//for initialization as well as for updating
.factory('sWeb_setParticipation', ["$q", '$http', 'constants', 
                    function($q, $http, constants) {
  return $q(function(resolve, reject, data){
      $http({
          method: "POST",
          url: constants.apiUrl + "/participation",
          data: {
              "fkEvent": data.idEvent,
              "colPupil": data.colPupil
          }
      }).then(function(response){
          resolve(response);
        }, function(response){
          reject(response);
      });
  })
}])

//PUT -------------------------------------------------------------------------
