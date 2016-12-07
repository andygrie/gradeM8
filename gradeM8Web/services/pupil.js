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

exports.getPupil = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select u.idUser, u.forename, u.surname, u.email, u.password, p.fkClass from gradeUser u INNER JOIN pupil p ON p.fkUser = u.idUser", function (err) {
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
exports.insertUser = function (req, res) {
    var connection = new Connection(config);
    connection.on('connect', executeStatement);

    var data = req.body;
    var results = [];
    var requestString = "";
    data.forEach(function (item) {
        requestString = requestString + "INSERT INTO gradeUser ( username ) VALUES ";
        requestString = requestString + "('" + item.username + "')";
        requestString = requestString + "; SELECT idUser FROM gradeUser WHERE username LIKE '" + item.username + "'; ";
    });
    function executeStatement() {
        request = new Request(requestString, function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            console.log("asdf");
            results.push(columns[0].value);
        });

        request.on('doneProc', function (rowCount, more) {
            for (var i = 0; i < data.length; i++)
                data[i].fkUser = results[i];
            res.send(data);
            insertPupil(results);
        });
        connection.execSql(request);
    }
}
function insertPupil(userIds) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    
    var results = [];
    var requestString = "";
    userIds.forEach(function (id) {
        requestString = requestString + "INSERT INTO pupil ( fkUser ) VALUES ";
        requestString = requestString + "(" + id + "); ";
    });

    function executeStatement() {
        request = new Request(requestString, function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
            request.on('row', function (columns) {
            });
            request.on('doneProc', function (rowCount, more) {
            });
        connection.execSql(request);
    }
}
exports.updateUser = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        requestUser = new Request("UPDATE gradeUser SET forename = @fn, surname = @sn, email = @em, password = @pw WHERE idUser = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });




        connection.on('debug', function (err) { console.log('debug:', err); });

        requestUser.on('doneProc', function (rowCount, more) {
            res.send();
            updatePupil(req.params.idUser,req.body.fkClass);
        });



        requestUser.addParameter('fn', TYPES.VarChar, req.body.forename);
        requestUser.addParameter('sn', TYPES.VarChar, req.body.surname);
        requestUser.addParameter('em', TYPES.VarChar, req.body.email);
        requestUser.addParameter('pw', TYPES.NVarChar, req.body.password);
        requestUser.addParameter('id', TYPES.Int, req.params.idUser);

        console.log(req.params.idUser + "    laksdjflkajldsfjakldsf");
        connection.execSql(requestUser);


    }
}
function updatePupil(idUser, idClass) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);

    function executeStatement() {

        requestPupil = new Request("UPDATE pupil SET fkClass = @fkc WHERE idUser = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });

        connection.on('debug', function (err) { console.log('debug:', err); });

        requestPupil.on('doneProc', function (rowCount, more) {
        });

        requestPupil.addParameter('fkc', TYPES.Int, idClass);
        requestPupil.addParameter('id', TYPES.Int, idUser);
        connection.execSql(requestPupil);
    }


}
exports.deletePupil = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM pupil WHERE fkUser = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
            deleteUser(req.params.idUser);
        });
        request.addParameter('id', TYPES.Int, req.params.idUser);
        connection.execSql(request);
    }
}
function deleteUser(idUser) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM gradeUser WHERE idUser = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.addParameter('id', TYPES.Int, idUser);
        connection.execSql(request);
    }
}

exports.getPupilsByClass = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select u.idUser, u.forename, u.surname, u.email, u.password, p.fkClass from gradeUser u INNER JOIN pupil p ON p.fkUser = u.idUser WHERE fkClass = @id", function (err) {
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
        request.addParameter('id', TYPES.Int, req.params.idClass);
        connection.execSql(request);
    }
}

exports.getPupilsByGroup = function (req, res) {
    {
        var connection = new Connection(config);
        var results = [];
        connection.on('connect', executeStatement);
        function executeStatement() {
            request = new Request("select p.fkUser username from gradeUser u INNER JOIN pupil p ON p.fkUser = u.idUser INNER JOIN assignedto a ON a.fkPupil = p.fkUser where fkGradeGroup = @id", function (err) {
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
            request.addParameter('id', TYPES.Int, req.params.idGradeGroup);
            connection.execSql(request);
        }
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
                pupilsHelp[item.username] = item.fkUser;
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
                            fkUser: pupilsHelp[item.cn],
                            username: item.cn,
                            forename: item.givenName,
                            surname: item.sn,
                            email: item.mail
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

exports.getAllPupils = function (req, res) {
    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            ad.opts.bindDN = username;
            ad.opts.bindCredentials = password;
            
            var query = '(|(cn=dreierl)(cn=drumla)(cn=haiderm)(cn=sammerm)(cn=kramerl)(cn=leitert)(cn=griessera))';
            
            ad.findUsers(query, function (err, users) {
                if (err) {
                    console.log('ERROR: ' + JSON.stringify(err));
                    return;
                }

                if ((!users) || (users.length == 0)) console.log('No users found.');
                else {
                    console.log('findUsers: ' + JSON.stringify(users));
                    res.send(users);
                }
            });
        }
        else {
            res.status(400);
            res.send('wrong credentials');
        }
    });
}

exports.getPupilsForADGroup = function (req, res) {
    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            getPupilsFromAD();
        }
        else {
            res.status(400);
            res.send('wrong credentials');
        }
    });


    function getPupilsFromAD() {

        ad.opts.bindDN = username;
        ad.opts.bindCredentials = password;

        var groupName = req.body.name;

        ad.getUsersForGroup(groupName, function (err, users) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                res.send({
                    'message': 'ERROR: ' + JSON.stringify(err)
                });
                return;
            }

            if (!users) {
                console.log('Group: ' + groupName + ' not found.');
                res.send({
                    'message': 'Group: ' + groupName + ' not found.'
                });
            }
            else {
                var pupils = [];
                for (var i = 0; i < users.length; i++) {
                    pupils.push({
                        email: users[i].mail,
                        forename: users[i].givenName,
                        surname: users[i].sn,
                        username: users[i].cn
                    });
                }
                console.log(JSON.stringify(users));
                res.send(pupils);
            }
        });
    }
}

