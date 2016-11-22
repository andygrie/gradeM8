exports.hack = function (req, res) {
    var ActiveDirectory = require('activedirectory');
    var config = {
        url: 'ldap://192.168.128.253',
        baseDN: 'ou=EDVO,ou=schueler,ou=Benutzer,dc=htl-vil,dc=local'
    }
    username = 'griessera@htl-vil';
    password = 'zasp25';
    var ad = new ActiveDirectory(config);
    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (auth) {
            console.log('Authenticated!');
        }
        else {
            console.log('Authentication failed!');
        }
    });
}