var sql = require('mssql');
var ted = require('tedious');

var Connection = ted.Connection;
var config = {
    userName: 'grademin',
    password: 'Grade2016',
    server: 'grade-server.database.windows.net',
    options: { encrypt: true, database: 'gradeDB' }
};
var Request = ted.Request;
var TYPES = ted.TYPES;

var atob = require('atob');
var ActiveDirectory = require('activedirectory');
var adConfig = {
    url: 'ldap://212.152.179.122',
    //url: 'ldap://192.168.128.253',
    baseDN: 'ou=schueler,ou=Benutzer,dc=htl-vil,dc=local'
}

var username = 'griessera@htl-vil';
var password = atob('emFzcDI1');


var ad = new ActiveDirectory(adConfig);


exports.getParticipation = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select p.idParticipation, p.fkGradeEvent, p.fkPupil, p.grade, p.gradedOn from participation p where p.participation = 0", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            var result = {};
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result[column.metadata.colName] = column.value;
                }
            });
            results.push(result);
            result = {};
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(results);
        });
        connection.execSql(request);
    }
}


exports.insertParticipation = function (req, res) {
    var data = req.body;
    var results = [];
    var requestString = "";
    var i = 0;
    console.log(data);
    console.log(data.length);

    data.forEach(function (item) {
        requestString = requestString + "INSERT INTO participation ( fkGradeEvent, fkPupil, grade, gradedOn ) VALUES ";
        requestString = requestString + "(" + req.params.fkGradeEvent + ", " + item.fkPupil + ", " + item.grade + ", " + null + ")";
        requestString = requestString + "; select @@identity; ";
    });
    console.log(requestString);

    var connection = new Connection(config);
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request(requestString, function (err) {
            if (err) {
                console.log(err);
            }
        });

        request.on('row', function (columns) {
            console.log(columns[0].value);
            results.push({
                "idParticipation": columns[0].value,
                "fkGradeEvent": req.params.fkGradeEvent,
                "fkPupil": data[i].fkPupil,
                "grade": data[i].grade,
                "gradedOn": null
            });
            
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(results);
        });

        connection.on('debug', function (err) { console.log('debug:', err); });
        connection.execSql(request);
    }



}


exports.updateParticipation = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("UPDATE participation SET grade = @g WHERE idParticipation = @id", function (err) {
            if (err) {
                console.log(err);
                result = err;
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send(result);
        });
        request.addParameter('g', TYPES.Int, req.body.grade);
        request.addParameter('id', TYPES.Int, req.params.idParticipation);

        console.log(req);
        
        connection.execSql(request);
    }
}

exports.deleteParticipation = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM participation WHERE idParticipation = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });
        request.addParameter('id', TYPES.Int, req.params.idParticipation);
        connection.execSql(request);
    }
}

exports.getParticipationByPupilAndTeaches = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("SELECT p.idParticipation, p.fkGradeEvent, p.fkPupil, p.grade, p.gradedOn, e.fkTeaches FROM participation p inner join gradeevent e on" +
            " e.idGradeEvent = p.fkGradeEvent WHERE p.fkPupil = @fkp AND e.fkTeaches = @fkt AND p.successor = 0", function (err) {
                if (err) {
                    console.log(err);
                }
            });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            var result = {};
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result[column.metadata.colName] = column.value;
                }
            });
            results.push(result);
            result = {};
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(results);
        });
        request.addParameter('fkp', TYPES.Int, req.params.idPupil);
        request.addParameter('fkt', TYPES.Int, req.params.idTeaches);
        connection.execSql(request);
    }


}

exports.getParticipationByEvent = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("SELECT p.idParticipation, p.fkGradeEvent, p.fkPupil, p.grade, p.gradedOn from participation p where p.fkGradeEvent = @fke", function (err) {
                if (err) {
                    console.log(err);
                }
            });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            var result = {};
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result[column.metadata.colName] = column.value;
                }
            });
            results.push(result);
            result = {};
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(results);
        });
        
        
        request.addParameter('fke', TYPES.Int, req.params.idEvent);
        connection.execSql(request);
    }


}

exports.getVersionHistory = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    var reqString = ";WITH    q AS " +
        "( " +
        "SELECT * " +
        "FROM    participation " +
        "WHERE   idParticipation = @id " +
        "UNION ALL " +
        "SELECT  n.* " +
        "FROM    participation n " +
        "JOIN    q " +
        "ON      n.successor = q.idParticipation " +
        ") " +
        "SELECT * " +
        "FROM    q; ";
    connection.on('connect', executeStatement);
    console.log(reqString);

    function executeStatement() {
        request = new Request(reqString, function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send(results);
        });
        request.addParameter('id', TYPES.Int, req.params.idParticipation);
        connection.execSql(request);

        request.on('row', function (columns) {
            var result = {};
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result[column.metadata.colName] = column.value;
                }
            });
            results.push(result);
            result = {};
        });

    }


}

exports.getPupilByParticipationEvent = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    var reqString = "select idParticipation, Participation.fkGradeEvent, grade, gradedOn, username from pupil " +
        "inner join Participation on pupil.fkUser = Participation.fkPupil " +
        "inner join GradeEvent on GradeEvent.idGradeEvent = Participation.fkGradeEvent " +
        "inner join Gradeuser on GradeUser.idUser = pupil.fkUser " +
        "where GradeEvent.idGradeEvent = @fkge";

    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request(reqString, function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            var result = {};
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result[column.metadata.colName] = column.value;
                }
            });
            results.push(result);
            result = {};
        });

        request.on('doneProc', function (rowCount, more) {
            getPupilsByUsernameFromAD(results, res);
        });


        request.addParameter('fkge', TYPES.Int, req.params.idEvent);
        connection.execSql(request);
    }
}


function getPupilsByUsernameFromAD(pupils, res) {
    ad.authenticate(username, password, function (err, auth) {
        var pupilsHelp = {};
        var finalPupils = [];
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            ad.opts.bindDN = username;
            ad.opts.bindCredentials = password;

            var query = '(|';
            pupils.forEach(function (item) {
                query = query + '(cn=' + item.username + ')';
                pupilsHelp[item.username] = {
                    fkUser: item.fkUser,
                    fkGradeEvent: item.fkGradeEvent,
                    grade: item.grade,
                    gradedOn: item.gradedOn,
                    idParticipation: item.idParticipation
                };
            });
            query = query + ')';

            ad.findUsers(query, function (err, users) {
                if (err) {
                    console.log('ERROR: ' + JSON.stringify(err));
                    return;
                }

                if ((!users) || (users.length == 0)) console.log('No users found.');
                else {
                    users.forEach(function (item) {
                        finalPupils.push({
                            idParticipation: pupilsHelp[item.cn].idParticipation,
                            fkGradeEvent: pupilsHelp[item.cn].fkGradeEvent,
                            grade: pupilsHelp[item.cn].grade,
                            gradedOn: pupilsHelp[item.cn].gradedOn,
                            Pupil: {
                                fkUser: pupilsHelp[item.cn].fkUser,
                                username: item.cn,
                                forename: item.givenName,
                                surname: item.sn,
                                email: item.mail
                            }
                        });
                    });
                    res.send(finalPupils);
                }
            });
        }
        else {
            res.status(400);
            res.send('wrong credentials');
        }
    });
}