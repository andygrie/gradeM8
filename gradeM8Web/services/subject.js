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

exports.getSubjects = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select s.idgradesubject, s.name from gradesubject s", function (err) {
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
exports.getSubject = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select s.idgradesubject, s.name from gradesubject s where s.idgradesubject = @id", function (err) {
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

        request.addParameter('id', TYPES.Int, req.params.idSubject);
        connection.execSql(request);
    }
}

exports.insertSubject = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("INSERT INTO gradesubject(name) VALUES(@name); select @@identity", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            result = {
                idClass: columns[0].value,
                name: req.body.name
            };
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(result);
        });
        request.addParameter('name', TYPES.VarChar, req.body.name);
        connection.execSql(request);
    }
}
exports.updateSubject = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("UPDATE gradesubject SET name = @name WHERE idgradesubject = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });

        request.addParameter('name', TYPES.VarChar, req.body.name);
        request.addParameter('id', TYPES.Int, req.params.idSubject);
        connection.execSql(request);
    }
}
exports.deleteSubject = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM gradesubject WHERE idGradeSubject = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });
        request.addParameter('id', TYPES.Int, req.params.idSubject);
        connection.execSql(request);
    }
}