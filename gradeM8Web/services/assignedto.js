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


exports.getAssignedTo = function (req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("select a.fkGradeGroup, a.fkPupil from assignedto a", function (err) {
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


exports.insertAssignedTo = function (req, res) {
    var data = req.body;
    var results = [];
    var requestString = "INSERT INTO assignedto ( fkGradeGroup, fkPupil ) VALUES ";
    data.forEach(function (item) {
        requestString = requestString + "(" + req.params.idGroup + ", " + item.fkPupil + "),";
        results.push({ 'fkGradeGroup': req.params.idGroup, 'fkPupil': item.fkPupil });
    });
    requestString = requestString.substring(0, requestString.length -1);

    var connection = new Connection(config);
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request(requestString, function (err) {
            if (err) {
                console.log(err);
            }
        });

        request.on('doneProc', function (rowCount, more) {
            res.send(results);
        });

        connection.on('debug', function (err) { console.log('debug:', err); });
        connection.execSql(request);
    }
     



        
}


exports.deleteAssignedTo = function (req, res) {
    var connection = new Connection(config);
    var result = {};
    connection.on('connect', executeStatement);
    function executeStatement() {
        request = new Request("DELETE FROM assignedto WHERE fkgradegroup = @fkgg AND fkpupil = @fkp", function (err) {
            if (err) {
                console.log(err);
            }
        });
        connection.on('debug', function (err) { console.log('debug:', err); });
        request.on('doneProc', function (rowCount, more) {
            res.send();
        });
        request.addParameter('fkgg', TYPES.Int, req.body.fkGradeGroup);
        request.addParameter('fkp', TYPES.Int, req.body.fkPupil);
        connection.execSql(request);
    }
}