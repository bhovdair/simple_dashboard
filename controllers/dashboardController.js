const dashView = (req, res) => {

    res.render("dashboard", {
        pageName: "Dashboard",
        currentMenu: 'dashboard'
      });
}
module.exports =  {
    dashView
};