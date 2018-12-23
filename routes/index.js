

module.exports = {
    getCustomersHomePage: (req, res) => {
        let query = "SELECT * FROM `customers` ORDER BY id ASC"; // query database to get all the customers

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/customersdb');
            }
            res.render('index.ejs', {
                title: "Welcome to SymcEmg | View Customers"
                ,customers: result
            });
        });
    },
    
    getAuthPage: (req, res) => {
	let message = '';
	res.render('login.ejs',{
		message});
    },

    getFBDemoPage: (req, res) => {
       res.render('fb-demo.ejs');
    },

    getWarningPage: (req, res) => {
       res.render('warning.ejs');
    }
};
