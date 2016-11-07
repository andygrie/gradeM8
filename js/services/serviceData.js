angular.module('moduleData', [])

.factory('sData_CUDHandler', ["$q", "sData_allData", "sData_groupsBySubjects", "sData_eventsByGroups", "sData_pupilsByGroups", "sData_participationsByPupil",
                                "sWeb_setSubject", "sWeb_setGroup", "sWeb_setTeaches", "sWeb_putParticipation", "sWeb_setParticipation", "sWeb_setNoteByTeachesAndPupil", "sWeb_setEvent",
                        function($q, sData_allData, sData_groupsBySubjects, sData_eventsByGroups, sData_pupilsByGroups, sData_participationsByPupil,
                                sWeb_setSubject, sWeb_setGroup, sWeb_setTeaches, sWeb_putParticipation, sWeb_setParticipation, sWeb_setNoteByTeachesAndPupil, sWeb_setEvent) {
  var retVal;

  retVal = {
      insertGroup: insertGroup,
      insertSubject: insertSubject,
      insertEvent: insertEvent,
      insertPupil: insertPupil,
      insertNote: insertNote,
      putParticipation: putParticipation,
      insertParticipation: insertParticipation
  }

  return retVal;

  //data = {name, idGradeSubject}
  function insertGroup (data){
      return $q(function(resolve, reject){
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
                sData_allData.data.groups.push(responseData);
                sData_allData.data.teaches.push(responseDataInner);
                resolve("successfuly added group");
            }, function(response){
                reject(response);
            }, teachesData);
        }, function(response){
            reject(response);
        }, data);
      });
  }

  //data = {name}
  function insertSubject(data){
      return $q(function(resolve, reject){
        sWeb_setSubject(function(responseData){
            sData_groupsBySubjects.data[responseData.name] = [];

            sData_allData.data.subjects.push(responseData);
            resolve("successfuly added subject");
        }, function(response){
            reject(response);
        }, data);
      });
  }

  //data = {idGradeGroup, fkTeaches, eventDate, eventDescription}
  function insertEvent(data){
    return $q(function(resolve, reject){
        sWeb_setEvent(function(responseData){
            sData_eventsByGroups.data[data.idGradeGroup] = responseData;

            responseData.idGradeGroup = data.idGradeGroup;
            sData_allData.data.events.push(responseData);
            resolve(responseData);
        }, function(response){
            reject(response);
        }, data);
    });
  }
  
  //data = {idParticipation, fkGradeEvent, fkPupil, grade, abscent}
  function putParticipation(data){
      return $q(function(resolve, reject){
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

  //data = {idGradeEvent, colPupils: [{fkPupil, grade, abscent}]}
  function insertParticipation(data){
      return $q(function(resolve, reject){
          sWeb_setParticipation(function(responseData){
              resolve(responseData);
          }, function(response){
              reject(response);
          }, data);
      });
  }

  //data = {idTeaches, idPupil, note}
  function insertNote(data){
      return $q(function(resolve, reject){
          sWeb_setNoteByTeachesAndPupil(function(responseData){
              resolve(responseData);
          }, function(response){
              reject(response);
          }, data)
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
  var teachers = {};
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
            retVal.data = teachers;
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
  var classes = {};
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
            retVal.data = classes;
            sData_allData.data.classes = classes;
            resolve("Successfuly loaded classes");
        }, function(response){
            reject(response);
        });
    })
  }
}])

.factory('sData_email', ["$q", "sWeb_sendEmail", 
                function($q, sWeb_sendEmail) {
  var email = {};
  var retVal;

  retVal = {
      data: email,
      send : send
  }

  return retVal;

  function send(){
    return $q(function(resolve, reject) {
        sWeb_sendEmail(function(responseData){
            email = responseData;
            retVal.data = email;
            resolve("Successfuly sent emails: " + responseData.status);
        }, function(response){
            reject(response);
        });
    })
  }
}])


.factory('sData_notesByPupil', ["$q", "sWeb_getNoteByTeachesAndPupil", 
                function($q, sWeb_getNoteByTeachesAndPupil) {
  var notes = {};
  var retVal;

  retVal = {
      data: notes,
      fillData : fillData
  }

  return retVal;

  //data = {idTeaches, idPupil}
  function fillData(data){
    return $q(function(resolve, reject) {
        sWeb_getNoteByTeachesAndPupil(function(responseData){
            notes = responseData;
            retVal.data = notes;
            resolve("Successfuly loaded classes");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_teaches', ["$q", "sData_allData", "sWeb_getTeachesByTeacherAndSubject", 
                function($q, sData_allData, sWeb_getTeachesByTeacherAndSubject) {
  var teaches = {};
  var retVal;

  retVal = {
      data: teaches,
      fillData : fillData
  }

  return retVal;

  //data = {idGradeSubject}
  function fillData(data){
    return $q(function(resolve, reject) {
        sWeb_getTeachesByTeacherAndSubject(function(responseData){
            teaches = responseData;
            retVal.data = teaches;
            sData_allData.data.teaches = responseData;
            resolve("Successfuly loaded teaches");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_participationsByPupil', ["$q", "sData_allData", "sWeb_getParticipationByPupilAndTeaches", 
                function($q, sData_allData, sWeb_getParticipationByPupilAndTeaches) {
  var participation = {};
  var retVal;

  retVal = {
      data: participation,
      fillData : fillData
  }

  return retVal;

  //data = {idPupil, idTeaches}
  function fillData(data){
    return $q(function(resolve, reject) {
        sWeb_getParticipationByPupilAndTeaches(function(responseData){
            participation = responseData;
            retVal.data = participation;
            resolve("Successfuly loaded participations");
        }, function(response){
            reject(response);
        }, data);
    })
  }
}])

.factory('sData_groupsBySubjects', ["$q", "sData_allData", "sWeb_getSubjectByTeacher", "sWeb_getGroupByTeacherAndSubject", 
                            function($q, sData_allData, sWeb_getSubjectByTeacher, sWeb_getGroupByTeacherAndSubject) {
  /*
    groupsBySubjects = {
        "subjName" : [
            {idGradeGroup, idGradeSubject, name}
        ]
    }
  */
  var groupsBySubjects = {};
  var retVal;

  retVal = {
      data: groupsBySubjects,
      fillData: fillData
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        if(sData_allData.data.groups == null)
            sData_allData.data.groups = [];
        var tmpI;
        sWeb_getSubjectByTeacher(function(responseData){
            sData_allData.data.subjects = responseData;

            for(var i = 0; i < responseData.length; i++)
            {
                tmpI = parseInt(i + " "); //new reference
                fetchGroups(responseData, tmpI, resolve, reject);
            }
        }, function(response){
            reject(response);
        });
    });
  }

  function fetchGroups(responseData, tmpIdx, resolve, reject)
  {
      sWeb_getGroupByTeacherAndSubject(function(responseDataInner){
            groupsBySubjects[responseData[tmpIdx].name] = responseDataInner;
            for(var j = 0; j < responseDataInner.length; j++)
            {
                
                responseDataInner[j].idGradeSubject = responseData[tmpIdx].idGradeSubject;
                sData_allData.data.groups.push(responseDataInner[j]);
                if(tmpIdx == responseData.length - 1 && j == responseDataInner.length -1)
                {
                    retVal.data = groupsBySubjects;
                    resolve("Successfully loaded groupsBySubjects");
                }
            }
            
        }, function(response){
            reject(response);
        }, {idGradeSubject: responseData[tmpIdx].idGradeSubject});
  }
}])

.factory('sData_eventsByGroups', ["$q", "sData_allData", "sData_groupsBySubjects",  "sWeb_getEventByGroup",
                            function($q, sData_allData, sData_groupsBySubject, sWeb_getEventByGroup) {
  /*
  eventsByGroups = {
      idGradeGroup : [
          {idGradeEvent, fkTeaches, eventDate, eventDescription}
      ]
  }
  */
  var eventsByGroups = {};
  var retVal;

  retVal = {
      data: eventsByGroups,
      fillData: fillData
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        var baseData = sData_groupsBySubject.data;
        //if(sData_allData.data.events == null)
            sData_allData.data.events = [];
        /*
        if(baseData == null)
        {
            sData_groupsBySubject.fillData().then(function(response){
                //baseData should have updated hence call by reference
                //for bug preventing tho
                baseData = sData_groupsBySubject.data;
            },function(response){
                reject("Dependent Load not working! " + response);
            })
        }*/

        var tmpI;
        var tmpJ;
        var keys = Object.keys(baseData);
        for(var i = 0; i < keys.length; i++)
        {
            
            for(var j = 0; j < baseData[keys[i]].length; j++)
            {
                tmpI = parseInt(" " +i);
                tmpJ = parseInt(" "+j);
                //Pushes every required group into the collection
                eventsByGroups[baseData[keys[i]][j].idGradeGroup];

                fetchEvents(keys, baseData, tmpI, tmpJ, resolve, reject);
            }
        }
    });
  }

  function fetchEvents(keys, baseData, tmpI, tmpJ, resolve, reject)
  {
      sWeb_getEventByGroup(function(responseData){
        // sets the events for each group
        eventsByGroups[baseData[keys[tmpI]][tmpJ].idGradeGroup] = responseData;
        for(var l = 0; l < responseData.length; l++)
        {
            //modifies the data and writes it to local data obj 
            responseData[l].idGradeGroup = baseData[keys[tmpI]][tmpJ].idGradeGroup;
            sData_allData.data.events.push(responseData[l]);

            //if done
            if(tmpI == keys.length - 1 &&
                tmpJ == baseData[keys[tmpI]].length - 1 &&
                l == responseData.length -1)
            {
                retVal.data = eventsByGroups;
                resolve("Successfully loaded eventsByGroups");
            }
        }
    }, function(response){
        reject(response);
    }, baseData[keys[tmpI]][tmpJ].idGradeGroup);
  }
}])

.factory('sData_pupilsByGroups', ["$q", "sData_allData", "sData_groupsBySubjects",  "sWeb_getPupilByGroup",
                            function($q, sData_allData, sData_groupsBySubject, sWeb_getPupilByGroup) {
  /*
  pupilsByGroups = {
      idGradeGroup : [
          {idUser, fkClass, forename, surname, email, password}
      ]
  }
  */
  
  var pupilsByGroups = {};
  var retVal;

  retVal = {
      data: pupilsByGroups,
      fillData: fillData
  }

  return retVal;

  function fillData(){
      return $q(function(resolve, reject){
        var baseData = sData_groupsBySubject.data;
        if(sData_allData.data.pupils == null)
            sData_allData.data.pupils = [];
        /*
        if(baseData == null)
        {
            sData_groupsBySubject.fillData().then(function(response){
                //baseData should have updated hence call by reference
                //for bug preventing tho
                baseData = sData_groupsBySubject.data;
            },function(response){
                reject("Dependent Load not working! " + response);
            })
        }
        */
        var tmpI;
        var tmpJ;
        var keys = Object.keys(baseData);
        for(var i = 0; i < keys.length; i++)
        {
            
            for(var j = 0; j < baseData[keys[i]].length; j++)
            {
                tmpI = parseInt(" "+i);
                tmpJ = parseInt(" "+j);
                //pupilsByGroups every required group into the collection
                pupilsByGroups[baseData[keys[i]][j].idGradeGroup] = [];

                fetchPupils(keys, baseData, tmpI, tmpJ, resolve, reject);
            }
        }
    });
  }

  function fetchPupils(keys, baseData, tmpI, tmpJ, resolve, reject)
  {
      sWeb_getPupilByGroup(function(responseData){
        // sets the events for each group
        pupilsByGroups[baseData[keys[tmpI]][tmpJ].idGradeGroup] = responseData;
        for(var l = 0; l < responseData.length; l++)
        {
            //modifies the data and writes it to local data obj 
            responseData[l].idGradeGroup = baseData[keys[tmpI]][tmpJ].idGradeGroup;
            sData_allData.data.pupils.push(responseData[l]);

            console.log("fetch");
            console.log(tmpI);
            console.log(tmpJ);
            console.log(l);
            //if done
            if(tmpI == keys.length - 1 &&
                tmpJ == baseData[keys[tmpI]].length - 1 &&
                l == responseData.length -1)
            {
                console.log("done");
                retVal.data = pupilsByGroups;
                resolve("Successfully loaded pupilsByGroups");
            }
        }
    }, function(response){
        reject(response);
    }, baseData[keys[tmpI]][tmpJ].idGradeGroup);
  }
}])