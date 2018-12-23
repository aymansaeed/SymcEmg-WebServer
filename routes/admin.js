module.exports = {
    getAdminHomePage: (req, res) => {
       res.render('admin/index.ejs');
    },
    
    getChart1Page: (req, res) => {
       res.render('admin/chart1.ejs');
    },

    getChart2Page: (req, res) => {
       res.render('admin/chart2.ejs');
    },

    getTablesPage: (req, res) => {
       res.render('admin/tables.ejs');
    },

    getFormsPage: (req, res) => {
       res.render('admin/forms.ejs');
    }
};