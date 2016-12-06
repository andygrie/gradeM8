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
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("INSERT INTO gradeUser(forename, surname, email, password) VALUES(@fn, @sn, x@x.x, xx); select @@identity", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            result = {
                idUser: columns[0].value,
                forename: req.body.forename,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
            };
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(result);
            insertPupil(result.idUser, req.body.fkClass);
        });

        request.addParameter('fn', TYPES.VarChar, req.body.forename);
        request.addParameter('sn', TYPES.VarChar, req.body.surname);
        //request.addParameter('em', TYPES.VarChar, req.body.email);
        //request.addParameter('pw', TYPES.NVarChar, req.body.password);
        connection.execSql(request);
    }
}
function insertPupil(idUser,idClass) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("INSERT INTO pupil(fkUser,fkClass) VALUES(@id,@cid)", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
            request.on('row', function (columns) {
            });
            request.on('doneProc', function (rowCount, more) {
            });
        request.addParameter('id', TYPES.Int, idUser);
        request.addParameter('cid', TYPES.Int, idClass);
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
            request = new Request("select u.idUser, u.forename, u.surname, u.email, u.password, p.fkClass from gradeUser u INNER JOIN pupil p ON p.fkUser = u.idUser INNER JOIN assignedto a ON a.fkPupil = p.fkUser where fkGradeGroup = @id", function (err) {
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
            request.addParameter('id', TYPES.Int, req.params.idGradeGroup);
            connection.execSql(request);
        }
    }
}

exports.getAllPupils = function (req, res) {
    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            getGroupsFromAD();
        }
        else {
            res.status(400);
            res.send('wrong credentials');
        }
    });


    function getGroupsFromAD() {

        ad.opts.bindDN = username;
        ad.opts.bindCredentials = password;

        var query = '';

        ad.findGroups(query, function (err, groups) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                return;
            }

            if ((!groups) || (groups.length == 0)) console.log('No groups found.');
            else {
                console.log('findGroups: ' + JSON.stringify(groups));
                getPupilsFromAD(groups);
            }
        });
    }
    function getPupilsFromAD(groups) {
        var groupsWithPupils = [];
        var myCounter = '';
        for (var idx = 0; idx < groups.length; idx = idx + 1) {
            var i = idx;
            ad.getUsersForGroup(groups[i].cn, function (err, users) {
                if (err) {
                    console.log('ERROR: ' + JSON.stringify(err));
                    res.send({
                        'message': 'ERROR: ' + JSON.stringify(err)
                    });
                    return;
                }

                if (!users) {
                    console.log('Group: ' + groups[i].cn + ' not found.');
                    res.send({
                        'message': 'Group: ' + groups[i].cn + ' not found.'
                    });
                }
                else {
                    groupsWithPupils.push({
                        class: groups[i].cn,
                        pupils: users
                    });
                }
                if (groupsWithPupils.length == i)
                    res.send(groupsWithPupils);
            });
        }
    }
}

exports.getGroups = function (req, res) {
    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            getGroupsFromAD();
        }
        else {
            res.status(400);
            res.send('wrong credentials');
        }
    });


    function getGroupsFromAD() {

        ad.opts.bindDN = username;
        ad.opts.bindCredentials = password;

        var query = '';
        
        ad.findGroups(query, function (err, groups) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                return;
            }

            if ((!groups) || (groups.length == 0)) console.log('No groups found.');
            else {
                console.log('findGroups: ' + JSON.stringify(groups));
                res.send(groups);
            }
        });
    }
}

function getPupilsForGroup (req, res) {
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

        var groupName = '5BHIFS-Schüler';

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
                console.log(JSON.stringify(users));
                res.send(users);
            }
        });
    }
}