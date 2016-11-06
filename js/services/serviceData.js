angular.module('moduleData', [])

.factory('sData_CUDHandler', ["sData_allData", "sData_groupsBySubjects", "sData_eventsByGroups", "sData_pupilsByGroups", "sData_participationsByPupil",
                                "sWeb_setSubject", "sWeb_setGroup", "sWeb_setTeaches", "sWeb_putParticipation",
                        function(sData_allData, sData_groupsBySubjects, sData_eventsByGroups, sData_pupilsByGroups, sData_participationsByPupil,
                                sWeb_setSubject, sWeb_setGroup, sWeb_setTeaches, sWeb_putParticipation) {
  var retVal;

  retVal = {
      insertGroup: insertGroup,
      insertSubject: insertSubject,
      insertEvent: insertEvent,
      insertPupil: insertPupil
  }

  return retVal;

  //data = {name, idGradeSubject}
  function insertGroup (){
      return $q(function(resolve, reject, data){
        sWeb_setGroup(function(responseData){
            var teachesData = {
                idGradeGroup: responseData.idGradeGroup,
                idGradeSubject: data.idGradeSubject
            };

            sWeb_setTeaches(function(responseDataInner){
                sData_groupsBySubjects.data[data.idGradeSubject].push(responseData);
                sData_eventsByGroups.data[responseData.idGradeGroup] = [];
                sData_pupilsByGroups.data[responseData.idGradeGroup] = [];

                responseData.idGradeSubject = data.idGradeSubject;
                sData_allData.groups.push(responseData);
                sData.allData.teaches.push(responseDataInner);
                resolve("successfuly added group");
            }, function(response){
                reject(response);
            }, teachesData);
        }, function(response){
            reject(response);
        }, data.name);
      });
  }

  //data = {name}
  function insertSubject(){
      return $q(function(resolve, reject, data){
        sWeb_setSubject(function(responseData){
            sData_groupsBySubjects.data[responseData.idGradeSubject] = [];

            sData_allData.subjects.push(responseData);
            resolve("successfuly added subject");
        }, function(response){
            reject(response);
        }, data.name);
      });
  }

  //data = {idGradeGroup, fkTeaches, eventDate, eventDescription}
  function insertEvent(){
    return $q(function(resolve, reject, data){
        sWeb_setEvent(function(responseData){
            sData_eventsByGroups.data[data.idGradeGroup] = responseData;

            responseData.idGradeGroup = data.idGradeGroup;
            sData_allData.events.push(responseData);
            resolve("successfuly added subject");
        }, function(response){
            reject(response);
        }, data);
    });
  }
  
  //data = {idParticipation, fkGradeEvent, fkPupil, grade, abscent}
  function putParticipation(){
      return $q(function(resolve, reject, data){
          sWeb_putParticipation(function(responseData){

              var partData = sData_participationsByPupil.data;
              for(var i = 0; i < partData.length; i++)
              {
                  if(partData[i].idParticipation == responseData.idParticipation)
                  {
                      partData[i].fkPupil = responseData.fkPupil;
                      partData[i].fkGradeEvent = responseData.fkGradeEvent;
                      partData[i].grade = responseData.grade;
                      partData[i].abscent = responseData.abscent;
                  }
              }
              
          }, function(response){
              reject(response);
          }, data);
      });
  }

  function insertPupil(){
      console.log("insertPupil not implemented");
  }
}])


.factory('sData_allData', function() {
  var retVal;
  var applData = {};

  /*
  #text# ... lokales Attribut, nicht in der DB

  applData = {
      groups: [
          {idGradeGroup, #idGradeSubject#, name}
      ],
      teachers: [
          {fkUser, forename, surname, email, password}
      ],
      subjects: [
          {idGradeSubject, name}
      ],
      events: [
          {idGradeEvent, #idGradeGroup#, fkTeaches, eventDate, eventDescription}
      ],
      pupils: [
          {fkUser, fkClass, #idGradeGroup#, forename, surname, email, password}
      ],
      teaches: [
          {idTeaches, fkTeacher, fkGradeSubject, fkGradeGroup}
      ],
      classes: [
          {idClass, name, room}
      ]
  } 
  */

  retVal = {
      data: applData
  }

  return retVal;
})

.factory('sData_teachers', ["$q", "sData_allData", "sWeb_getTeacher", 
                function($q, sData_allData, sWeb_getTeacher) {
  var teachers = null;
  var retVal;

  retVal = {
      data: teachers,
      fillData : fillData
  }

  return retVal;

  function fillData(){
    return $q(function(resolve, reject) {
        sWeb_getTeacher(function(responseData){
            teachers = responseData;
            sData_allData.data.teachers = teachers;
            resolve("Successfuly loaded teachers");
        }, function(response){
            reject(response);
        });
    })
  }
}])

.factory('sData_classes', ["$q", "sData_allData", "sWeb_getClass", 
                function($q, sData_allData, sWeb_getClass) {
  var classes = null;
  var retVal;

  retVal = {
      data: classes,
      fillData : fillData
  }

  return retVal;

  function fillData(){
    return $q(function(resolve, reject) {
        sWeb_getTeacher(function(responseData){
            classes = responseData;
            sData_allData.data.classes = classes;
            resolve("Successfuly loaded classes");
        }, function(response){
            reject(response);
        });
    })
  }
}])

.factory('sData_teaches', ["$q", "sData_allData", "sWeb_getTeaches", 
                function($q, sData_allData, sWeb_getTeaches) {
  var teaches = null;
  var retVal;

  retVal = {
      data: teaches,
      fillData : fillData
  }

  return retVal;

  function fillData(){
    return $q(function(resolve, reject) {
        sWeb_getTeaches(function(responseData){
            teaches = responseData;
            sData_allData.data.teaches = responseData;
            resolve("Successfuly loaded teaches");
        }, function(response){
            reject(response);
        });
    })
  }
}])



.factory('sData_participationsByPupil', ["$q", "sData_allData", "sWeb_getParticipationByPupilAndTeaches", 
                function($q, sData_allData, sWeb_getParticipationByPupilAndTeaches) {
  var participation = null;
  var retVal;

  retVal = {
      data: participation,
      fillData : fillData
  }

  return retVal;

  //data = {idPupil, idTeaches}
  function fillData(){
    return $q(function(resolve, reject, data) {
        sWeb_getParticipationByPupilAndTeaches(function(responseData){
            participation = responseData;
            resolve("Successfuly loaded participations");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_groupsBySubjects', ["$q", "sData_allData", "sWeb_getSubjectByTeacher", "sWeb_getGroupByTeacherAndSubject", "sWeb_setSubject", 
                            function($q, sData_allData, sWeb_getSubjectByTeacher, sWeb_getGroupByTeacherAndSubject, sWeb_setSubject) {
  /*
    groupsBySubjects = {
        "subjName" : [
            {idGradeGroup, idGradeSubject, name}
        ]
    }
  */
  var groupsBySubjects = null;
  var retVal;

  retVal = {
      data: groupsBySubjects,
      fillData: fillData
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        sWeb_getSubjectByTeacher(function(responseData){
            sData_allData.data.subjects = responseData;

            for(var i = 0; i < responseData.length; i++)
            {
                sWeb_getGroupByTeacherAndSubject(function(responseDataInner){
                    groupsBySubjects[responseData[i].name] = responseDataInner;
                    for(var j = 0; j < responseDataInner.length; j++)
                    {
                        if(sData_allData.data.groups == null)
                            sData_allData.data.groups = [];
                        responseDataInner[j].idGradeSubject = responseData[i].idGradeSubject;
                        sData_allData.data.groups.push(responseDataInner[j]);
                    }
                }, function(response){
                    reject(response);
                }, responseData[i].idGradeSubject);
            }

            resolve("Successfully loaded groupsBySubjects");
        }, function(response){
            reject(response);
        });
    });
  }
}])

//depends on /\ sData_groupsBySubject 
//dont forget to call on group update
.factory('sData_eventsByGroups', ["$q", "sData_allData", "sData_groupsBySubjects",  "sWeb_getEventByGroup",
                            function($q, sData_allData, sData_groupsBySubject, sWeb_getEventByGroup) {
  /*
  eventsByGroups = {
      idGradeGroup : [
          {idGradeEvent, fkTeaches, eventDate, eventDescription}
      ]
  }
  */
  var eventsByGroups = null;
  var retVal;

  retVal = {
      data: eventsByGroups,
      fillData: fillData
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        var baseData = sData_groupsBySubject.data;
        eventsByGroups = [];
        
        if(baseData == null)
        {
            sData_groupsBySubject.fillData(function(response){
                //baseData should have updated hence call by reference
                //for bug preventing tho
                baseData = sData_groupsBySubject.data;
            },function(response){
                reject("Dependent Load not working! " + response);
            })
        }

        var keys = Object.keys(baseData);
        for(var i = 0; i < keys.length; i++)
        {
            for(var j = 0; j < baseData[keys[i]].length; j++)
            {
                //Pushes every required group into the collection
                eventsByGroups.push(baseData[keys[i]][j].idGradeGroup);

                sWeb_getEventByGroup(function(responseData){
                    // sets the events for each group
                    eventsByGroups[baseData[keys[i]][j].idGradeGroup] = responseData;
                    for(var l = 0; l < responseData.length; l++)
                    {
                        //modifies the data and writes it to local data obj 
                        if(sData_allData.data.groups == null)
                            sData_allData.data.groups = [];
                        responseData[l].idGradeGroup = baseData[keys[i]][j].idGradeGroup;
                        sData_allData.data.events.push(responseData[l]);
                    }
                }, function(response){
                    reject(response);
                }, baseData[keys[i]][j].idGradeGroup);
            }
        }

        resolve("Successfully loaded eventsByGroups");
    });
  }
}])

.factory('sData_pupilsByGroups', ["$q", "sData_allData", "sData_groupsBySubjects",  "sWeb_getPupilByGroup", "sWeb_setGroup",
                            function($q, sData_allData, sData_groupsBySubject, sWeb_getPupilByGroup, sWeb_setGroup) {
  /*
  pupilsByGroups = {
      idGradeGroup : [
          {idUser, fkClass, forename, surname, email, password}
      ]
  }
  */
  
  var pupilsByGroups = null;
  var retVal;

  retVal = {
      data: pupilsByGroups,
      fillData: fillData
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        var baseData = sData_groupsBySubject.data;
        if(baseData == null)
        {
            sData_groupsBySubject.fillData(function(response){
                //baseData should have updated hence call by reference
                //for bug preventing tho
                baseData = sData_groupsBySubject.data;
            },function(response){
                reject("Dependent Load not working! " + response);
            })
        }

        var keys = Object.keys(baseData);
        for(var i = 0; i < keys.length; i++)
        {
            for(var j = 0; j < baseData[keys[i]].length; j++)
            {
                //pupilsByGroups every required group into the collection
                pupilsByGroups.push(baseData[keys[i]][j].idGradeGroup);

                sWeb_getPupilByGroup(function(responseData){
                    // sets the events for each group
                    pupilsByGroups[baseData[keys[i]][j].idGradeGroup] = responseData;
                    for(var l = 0; l < responseData.length; l++)
                    {
                        //modifies the data and writes it to local data obj 
                        if(sData_allData.data.pupils == null)
                            sData_allData.data.pupils = [];
                        responseData[l].idGradeGroup = baseData[keys[i]][j].idGradeGroup;
                        sData_allData.data.events.push(responseData[l]);
                    }
                }, function(response){
                    reject(response);
                }, baseData[keys[i]][j].idGradeGroup);
            }
        }

        resolve("Successfully loaded pupilsByGroups");
    });
  }
}])