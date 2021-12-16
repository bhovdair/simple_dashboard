const dashView = (req, res) => {

    let sess = req.session;
    sess.username;
    if (!sess.username) {
        return res.redirect('/login');
    }


    res.render("dashboard", {
        pageName: "Dashboard",
        currentMenu: 'dashboard'
    });
}
module.exports = {
    dashView
};