const dashView = (req, res) => {

    let sess = req.session;
    sess.username;
    if (!sess.username) {
        return res.redirect('/login');
    }

    //load data here
    //data card
    //data chart
    //data user

    res.render("dashboard", {
        pageName: "Dashboard",
        currentMenu: 'dashboard',
        userName : sess.username,
        fullName : sess.fullName,
    });
}
module.exports = {
    dashView
};