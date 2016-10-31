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



exports.addUser = function addUser(req, res) {
    var connection = new Connection(config);
    connection.on('connect', executeStatement);  

    function executeStatement() {
        request = new Request("select * from gradeUser", function (err) {
            if (err) {
                console.log(err);
            }
        });

        connection.on('debug', function (err) { console.log('debug:', err); });


        var result = "";
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result += column.value + " ";
                }
            });
            console.log(result);
            result = "";
        });

        request.on('done', function (rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }  



}

            