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

exports.getNotesByTeachesAndPupil = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select n.idNote, n.fkTeaches, n.fkPupil, n.note from note n where n.fkTeaches = @fkt and n.fkPupil = @fkp", function (err) {
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

        request.addParameter('fkt', TYPES.Int, req.params.fkTeaches);
        request.addParameter('fkp', TYPES.Int, req.params.fkPupil);
        connection.execSql(request);
    }
}
exports.insertNote = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("INSERT INTO note(fkTeaches, fkPupil, note) VALUES(@fkt,@fkp,@note); select @@identity", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });

        request.on('row', function (columns) {
            result = {
                idNote: columns[0].value,
                fkTeaches: req.params.fkTeaches,
                fkPupil: req.params.fkPupil,
                note: req.body.note
            };
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(result);
        });
        console.log(req.body);
        request.addParameter('fkt', TYPES.VarChar, req.params.fkTeaches);
        request.addParameter('fkp', TYPES.VarChar, req.params.fkPupil);
        request.addParameter('note', TYPES.VarChar, req.body.note);
        connection.execSql(request);
    }
}
exports.updateNote = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("UPDATE note SET note = @note WHERE idNote = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });

        request.addParameter('note', TYPES.VarChar, req.body.note);
        request.addParameter('id', TYPES.Int, req.params.idNote);
        connection.execSql(request);
    }
}
exports.deleteNote = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM note WHERE idNote = @id", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });
        request.addParameter('id', TYPES.Int, req.params.idNote);
        connection.execSql(request);
    }
}