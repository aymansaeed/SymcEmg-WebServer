const fs = require('fs');

module.exports = {
    addCustomerPage: (req, res) => {
        res.render('add-customer.ejs', {
            title: "Welcome to SymcEmg | Add a new customer"
            ,message: ''
        });
    },
    addCustomer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let phone = req.body.phone;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `customers` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-customer.ejs', {
                    message,
                    title: "Welcome to SymcEmg | Add a new customer"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the customer's details to the database
                        let query = "INSERT INTO `customers` (first_name, last_name, email, phone, image, user_name) VALUES ('" +
                            first_name + "', '" + last_name + "', '" + email + "', '" + phone + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/customersdb');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-customer.ejs', {
                        message,
                        title: "Welcome to CustomersDB | Add a new customer"
                    });
                }
            }
        });
    },
    editCustomerPage: (req, res) => {
        let customerId = req.params.id;
        let query = "SELECT * FROM `customers` WHERE id = '" + customerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-customer.ejs', {
                title: "Edit  Customer"
                ,customer: result[0]
                ,message: ''
            });
        });
    },
    editCustomer: (req, res) => {
        let customerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let phone = req.body.phone;

        let query = "UPDATE `customers` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `email` = '" + email + "', `phone` = '" + phone + "' WHERE `customers`.`id` = '" + customerId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/customersdb');
        });
    },
    deleteCustomer: (req, res) => {
        let customerId = req.params.id;
        let getImageQuery = 'SELECT image from `customers` WHERE id = "' + customerId + '"';
        let deleteUserQuery = 'DELETE FROM customers WHERE id = "' + customerId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/customersdb');
                });
            });
        });
    }
};
