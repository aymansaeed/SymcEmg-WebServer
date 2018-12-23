const express = require('express');
const fs = require ('fs');
const jwt = require ('jsonwebtoken');
const cookieParser = require ('cookie-parser');
const jwtsimple = require('jwt-simple');
const adminauth = express();

const privateKEY  = fs.readFileSync('keys/private.key', 'utf8');
const publicKEY  = fs.readFileSync('keys/public.key', 'utf8');

const signOptions = {
 expiresIn:  "12h",
 algorithm:  "RS256"
};

const verifyOptions = {
 expiresIn:  "12h",
 algorithm:  "RS256"
};

const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

adminauth.use(cookieParser());

let cookieParts =[];

module.exports = {
	adminAuthentication: (req, res) => {

        let message = '';

        let username= req.body.username;
        let password= req.body.password;
        let payload = {
            userID: username,
            Role: 'Admin',
            Domain: 'SYMCEMG'
        };
        let token = jwtsimple.encode (payload,privateKEY);

        let authQuery="SELECT id,username FROM `admincredentials` WHERE `username`='"+username+"' and password = '"+password+"'";            
        db.query(authQuery, function(err, results){
         if(results.length > 0 ){
            res.cookie('authCookie',token, {httpOnly: true,domain: 'symcemg.local',expires: expiryDate,path: '/'}).status(301).redirect('/lab/home');
            console.log("Token: ", token);
         }
         else{
            message = 'Wrong Credentials.';
            res.cookie('authCookie','logged-out',{httpOnly: true,domain: 'symcemg.local',expires: expiryDate,path: '/'}).render('login.ejs',{
                    message});
         }
      });

    },	

    adminLogout: (req, res) => {
        res.cookie('authCookie','logged-out',{httpOnly: true,domain: 'symcemg.local',expires: expiryDate,path: '/'}).redirect('/login');
        cookieParts=[];
    },

    cookieValidation: (req, res, next) => {
        console.log('Validating the cookie..');
        let validationFlag = true;
        cookieParts=[];

        if (req.headers.cookie){
            let cookie = req.headers.cookie;
            cookieParts = cookie.split('=');
            console.log("Cookies: ", cookieParts[1]);

            if (cookieParts[1]=='logged-out'){
                res.redirect('/login')
            } else{
                let decodedcookie = null;
                try {
                      decodedcookie = jwtsimple.decode(cookieParts[1],privateKEY);
                    } catch (error) {
                      validationFlag = false;
                      console.log('decode error: ', error); 
                    }

                if (validationFlag==true)
                {
                    next();

                } else if (validationFlag==false) {
                    message = 'Invalid Token.';
                    res.cookie('authCookie','logged-out',{httpOnly: true,domain: 'symcemg.local',expires: expiryDate,path: '/'}).render('login.ejs',{
                        message});
                } else{
                    res.cookie('authCookie','logged-out',{httpOnly: true,domain: 'symcemg.local',expires: expiryDate,path: '/'}).redirect('/login');
                }
            }

        } else {
            res.redirect('/login');
            //res.render('login.ejs');
            console.log('No Cookies--'+req.headers.cookie);
    }
    }
};
