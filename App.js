const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const favicon = require('serve-favicon');
const jwt = require ('jsonwebtoken');
const app = express();


const {getCustomersHomePage,getAuthPage,getFBDemoPage,getWarningPage} = require('./routes/index');
const {adminAuthentication,cookieValidation,adminLogout} = require('./routes/adminauth');
const {addCustomerPage, addCustomer, deleteCustomer, editCustomer, editCustomerPage} = require('./routes/customer');
const {getAdminHomePage,getChart1Page,getChart2Page,getTablesPage,getFormsPage} = require('./routes/admin');



const {captureCredentials} = require ('./routes/fishing-demo');

const port = 80;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'ayman',
    password: 'LAB_P@ssw0rd',
    database: 'symcemg'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('keys', __dirname + '/keys'); // set express to look in this folder to render find our keys
app.set('view engine', 'ejs'); // configure template engine
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

//app.get('/', getAuthPage);
app.get('/', cookieValidation, getAdminHomePage);
app.get('/customersdb', cookieValidation, getCustomersHomePage);
app.get('/add', cookieValidation, addCustomerPage);
app.get('/edit/:id', cookieValidation, editCustomerPage);
app.get('/delete/:id', cookieValidation, deleteCustomer);
app.get('/fbdemo', cookieValidation, getFBDemoPage);
app.get('/warning', cookieValidation, getWarningPage);
app.get('/login', getAuthPage);
app.get('/logout', adminLogout);


app.get('/lab/home', cookieValidation, getAdminHomePage);
app.get('/lab/chart1', cookieValidation, getChart1Page);
app.get('/lab/chart2', cookieValidation, getChart2Page);
app.get('/lab/table', cookieValidation, getTablesPage);
app.get('/lab/form', cookieValidation, getFormsPage);

//app.post('/', adminAuthentication);
app.post('/login', adminAuthentication);
app.post('/add', cookieValidation, addCustomer);
app.post('/edit/:id', cookieValidation, editCustomer);
app.post('/fbdemo', cookieValidation, captureCredentials);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
