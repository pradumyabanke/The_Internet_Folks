const express = require("express");
const Router = express.Router();
const bodyParser = require("body-parser");
const Controller = require("../Controllers/user");
const Middleware = require("../Middleware/auth");



Router.post("/createUser", Controller.createUser);
Router.post("/userLogin",Middleware.jwtValidation, Controller.userLogin);
Router.get("/getuser", Middleware.jwtValidation, Controller.getMe);
Router.post("/role", Controller.Roleuser);
Router.get("/getallrole", Controller.getRoleuser);
Router.post("/:userId/community", Middleware.jwtValidation, Middleware.authorization, Controller.createCommunity);
Router.get("/:userId/getallcommunity", Middleware.jwtValidation, Middleware.authorization, Controller.GetCommunity);
Router.get("/:userId/getcommyownedmunity", Middleware.jwtValidation, Middleware.authorization, Controller.GetmyOwnedCommunity);
// Router.get("/:communityId/getallmember", Middleware.jwtValidation, Controller.GetmyOwnedCommunity);



Router.use(bodyParser.json());
Router.use(bodyParser.urlencoded({ extended: true }));


//===================== checking your end point valid or not =======================//

Router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct or Not!"
    })
});


module.exports = Router;