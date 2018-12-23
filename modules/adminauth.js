const fs = require('fs');
const privateKEY  = fs.readFileSync('../keys/private.key', 'utf8');
const publicKEY  = fs.readFileSync('../keys/public.key', 'utf8');

const signOptions = {
 issuer:  "www.symcemg.local",
 subject:  "Admin Users",
 audience:  "Any",
 expiresIn:  "12h",
 algorithm:  "RS256"
};

const verifyOptions = {
 issuer:  "www.symcemg.local",
 subject:  "Admin Users",
 audience:  "Any",
 expiresIn:  "12h",
 algorithm:  ["RS256"]
};

module.exports = {
	adminAuthentication: (req, res) => {
        let message = '';
        let sess = req.session;

        let username= req.body.username;
        let password= req.body.password;
        let token= jwt.sign 

        let authQuery="SELECT id,username FROM `admincredentials` WHERE `username`='"+username+"' and password = '"+password+"'";            
        db.query(authQuery, function(err, results){
         if(results.length > 0 ){
            //req.session.userId = results[0].id;
            //req.session.user = results[0];
            //console.log(results[0].id);
            res.render('admin/index.ejs');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('login.ejs',{
                    message});
         }

      });

    },	
};
