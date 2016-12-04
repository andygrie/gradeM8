﻿exports.login = function (req, res) {
    var ActiveDirectory = require('activedirectory');
    var config = {
        url: 'ldap://212.152.179.122',
        baseDN: 'ou=EDVO,ou=schueler,ou=Benutzer,dc=htl-vil,dc=local'
    }
    var username = req.body.username + '@htl-vil';
    var password = req.body.password;
    console.log('user: ' + username + ', pw: ' + password);
    var ad = new ActiveDirectory(config);

    

    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
        }

        if (auth) {
            //res.send({
            //    'message': 'authenticated'
            //});
            var sAMAccountName = 'griessera';
            ad.opts.bindDN = username;
            ad.opts.bindCredentials = password;
            //ad.findUser(sAMAccountName, function (err, user) {
            //    if (err) {
            //        console.log('ERROR: ' + JSON.stringify(err));
            //        res.send({
            //            'message': 'ERROR: ' + JSON.stringify(err)
            //        });
            //        return;
            //    }

            //    if (!user) {
            //        console.log('User: ' + sAMAccountName + ' not found.');
            //        res.send({
            //            'message': 'User: ' + sAMAccountName + ' not found.'
            //        });
            //    }
            //    else {
            //        console.log(JSON.stringify(user));
            //        res.send({
            //            'message': JSON.stringify(user)
            //        });
            //    }
            //});
            var groupName = '5BHIFS';

            ad.getUsersForGroup(groupName, function (err, users) {
                if (err) {
                    console.log('ERROR: ' + JSON.stringify(err));
                    return;
                }

                if (!users) console.log('Group: ' + groupName + ' not found.');
                else {
                    console.log(JSON.stringify(users));
                }
            });
        }
        else {
            res.send({
                'message': 'authentication failed'
            });
        }
    });
}