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
        request = new Request("INSERT INTO gradeUser(forename, surname, email, password) VALUES(@fn, @sn, @em, @pw); select @@identity", function (err) {
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
        request.addParameter('em', TYPES.VarChar, req.body.email);
        request.addParameter('pw', TYPES.NVarChar, req.body.password);
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